from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets
from .models import Book, Review
from .serializers import BookSerializer, ReviewSerializer
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix
from scipy.sparse.linalg import svds
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import ReviewSerializer


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtraggio
        author = self.request.query_params.get('author')
        title = self.request.query_params.get('title')
        category = self.request.query_params.get('category')
        max_price = self.request.query_params.get('max_price')
        publication_year = self.request.query_params.get('publication_year')

        if author:
            queryset = queryset.filter(author__icontains=author)
        if title:
            queryset = queryset.filter(title__icontains=title)
        if category:
            queryset = queryset.filter(category__icontains=category)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        if publication_year:
            queryset = queryset.filter(publication_year=publication_year)
        
        # Ordinamento
        sort_by = self.request.query_params.get('sort_by')
        if sort_by in ['price', '-price', 'author', '-author', 'title', '-title', 'category', '-category']:
            queryset = queryset.order_by(sort_by)
        
        return queryset

@api_view(['GET'])
def book_details(request, book_id):
    try:
        book = Book.objects.get(id=book_id)
        serializer = BookSerializer(book)
        return Response(serializer.data)
    except Book.DoesNotExist:
        return Response({"error": "Book not found"}, status=404)

# Funzione per caricare i dati in matrice user_book
def load_data():
    book_info = pd.DataFrame(list(Book.objects.values('id', 'title', 'author', 'category', 'description', 'price'))).set_index('id')
    
    reviews = pd.DataFrame(list(Review.objects.values('user_id', 'book_id', 'rating')))
    reviews = reviews.rename(columns={'book_id': 'id', 'rating': 'review_score'})
    
    user_book_matrix = reviews.pivot(index='user_id', columns='id', values='review_score').fillna(0)
    
    return user_book_matrix, book_info

# Funzioni di raccomandazione
def recommend_books(book_id, similarity_matrix, num_recommendations=5):
    if book_id not in similarity_matrix.index:
        return []
    
    similar_scores = similarity_matrix[book_id]
    similar_books = similar_scores.sort_values(ascending=False).drop(book_id)
    
    return similar_books.head(num_recommendations).index.tolist()

def recommend_books_svd(book_id, similarity_matrix, num_recommendations=5):
    if book_id not in similarity_matrix.index:
        return []
    
    similar_scores = similarity_matrix[book_id]
    similar_books = similar_scores.sort_values(ascending=False).drop(book_id)
    
    return similar_books.head(num_recommendations).index.tolist()

# Funzione combinata di raccomandazione
def get_recommendations(book_id, num_recommendations=5):
    user_book_matrix, book_info = load_data()

    # Calcola la matrice di similarità semplice
    book_similarity = cosine_similarity(user_book_matrix.T)
    book_similarity_df = pd.DataFrame(book_similarity, index=user_book_matrix.columns, columns=user_book_matrix.columns)
    
    # Calcola la matrice di similarità basata su SVD
    k = 50
    user_book_sparse = csr_matrix(user_book_matrix.T)
    U, sigma, Vt = svds(user_book_sparse.T, k=k)
    sigma_matrix = np.diag(sigma)
    book_factors = np.dot(sigma_matrix, Vt)
    book_similarity_svd = cosine_similarity(book_factors.T)
    book_similarity_svd_df = pd.DataFrame(book_similarity_svd, index=user_book_matrix.columns, columns=user_book_matrix.columns)

    # Raccomandazioni combinate
    simple_recommendations = recommend_books(book_id, book_similarity_df, num_recommendations)
    svd_recommendations = recommend_books_svd(book_id, book_similarity_svd_df, num_recommendations * 2)
    svd_recommendations = [rec for rec in svd_recommendations if rec not in simple_recommendations][:num_recommendations]
    recommendations = simple_recommendations + svd_recommendations
    
    recommended_books_info = book_info.loc[recommendations].reset_index()
    return recommended_books_info

# API di raccomandazione
@api_view(['GET'])
def recommendations(request, book_id):
    try:
        recommended_books = get_recommendations(book_id, num_recommendations=5)
        recommended_books_data = recommended_books.to_dict(orient='records')
        return Response(recommended_books_data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
# API per le recensioni
@api_view(['GET'])
def get_reviews(request, book_id):

    reviews = Review.objects.filter(book_id=book_id)
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def add_review(request, book_id):
    if Review.objects.filter(book_id=book_id, user_id="test_user").exists():
        return Response({"error": "You have already reviewed this book."}, status=status.HTTP_400_BAD_REQUEST)

    data = request.data.copy()
    data["user_id"] = "test_user"  # Default ID
    data["book_id"] = book_id

    serializer = ReviewSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API per restituire le recensioni di un utente
@api_view(['GET'])
def get_user_reviews(request, user_id):
    reviews = Review.objects.filter(user_id=user_id)
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# API di aggiornamento e modifica delle recensioni
@api_view(['PUT'])
def update_review(request, review_id):
    try:
        review = Review.objects.get(id=review_id)
        if review.user_id != "test_user":  # Controllo user_id per evitare modifiche di altre recensioni
            return Response({"error": "You can only edit your own reviews."}, status=status.HTTP_403_FORBIDDEN)
        data = request.data
        serializer = ReviewSerializer(review, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Review.DoesNotExist:
        return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def delete_review(request, review_id):
    try:
        review = Review.objects.get(id=review_id)
        if review.user_id != "test_user":
            return Response({"error": "You can only delete your own reviews."}, status=status.HTTP_403_FORBIDDEN)
        review.delete()
        return Response({"message": "Review deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Review.DoesNotExist:
        return Response({"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND)
    
# raccomandazione user-based
def build_user_book_matrix():
    
    reviews = pd.DataFrame(list(Review.objects.values('user_id', 'book_id', 'rating')))
    user_book_matrix = reviews.pivot(index='user_id', columns='book_id', values='rating').fillna(0)
    
    return user_book_matrix

def calculate_user_similarity(user_book_matrix):

    user_similarity = cosine_similarity(user_book_matrix)
    user_similarity_df = pd.DataFrame(user_similarity, index=user_book_matrix.index, columns=user_book_matrix.index)
    
    return user_similarity_df

def calculate_user_similarity_svd(user_book_matrix, k=50):

    user_book_sparse = csr_matrix(user_book_matrix)
    
    # SVD
    U, sigma, Vt = svds(user_book_sparse, k=k)
    sigma_matrix = np.diag(sigma)
    user_factors = np.dot(U, sigma_matrix)
    user_similarity_svd = cosine_similarity(user_factors)
    user_similarity_svd_df = pd.DataFrame(user_similarity_svd, index=user_book_matrix.index, columns=user_book_matrix.index)
    
    return user_similarity_svd_df

def recommend_books_for_user(user_id, user_similarity_df, user_book_matrix, num_recommendations=5):
    similar_users = user_similarity_df[user_id].sort_values(ascending=False).index[1:]  
    user_books = set(user_book_matrix.columns[user_book_matrix.loc[user_id] > 0])
    recommended_books = []
    
    for similar_user in similar_users:
        books_to_recommend = user_book_matrix.loc[similar_user][user_book_matrix.loc[similar_user] > 0].index.difference(user_books)
        recommended_books.extend(books_to_recommend)

        if len(recommended_books) >= num_recommendations:
            break
    
    return list(recommended_books[:num_recommendations])

def get_combined_user_recommendations(user_id, user_book_matrix, num_recommendations=5):

    user_similarity_df = calculate_user_similarity(user_book_matrix)
    
    user_similarity_svd_df = calculate_user_similarity_svd(user_book_matrix)
    
    simple_recommendations = recommend_books_for_user(user_id, user_similarity_df, user_book_matrix, num_recommendations)
    
    svd_recommendations = recommend_books_for_user(user_id, user_similarity_svd_df, user_book_matrix, num_recommendations * 2)
    svd_recommendations = [book for book in svd_recommendations if book not in simple_recommendations][:num_recommendations]
    
    combined_recommendations = simple_recommendations + svd_recommendations
    
    return combined_recommendations

@api_view(['GET'])
def user_based_recommendations(request, user_id):
    try:
        user_book_matrix = build_user_book_matrix()
        recommended_book_ids = get_combined_user_recommendations(user_id, user_book_matrix, num_recommendations=5)
        
        recommended_books = Book.objects.filter(id__in=recommended_book_ids)
        serializer = BookSerializer(recommended_books, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)