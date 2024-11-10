from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import viewsets
from .models import Book, Review
from .serializers import BookSerializer
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix
from scipy.sparse.linalg import svds

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

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
    # Carica i dati dei libri
    book_info = pd.DataFrame(list(Book.objects.values('id', 'title', 'author', 'category', 'description', 'price'))).set_index('id')
    
    # Carica le recensioni
    reviews = pd.DataFrame(list(Review.objects.values('user_id', 'book_id', 'rating')))
    reviews = reviews.rename(columns={'book_id': 'id', 'rating': 'review_score'})
    
    # Crea la matrice user-book
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