import psycopg2
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix
from scipy.sparse.linalg import svds

# Configurazione del database
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "bookstore"
DB_USER = "user"
DB_PASSWORD = "password"

# Funzione per connettersi al database
def connect_to_db():
    connection = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
    return connection

# Funzione per ottenere i dati dal database e caricarli in una matrice user_book
def load_data(connection):
    query_books = """
        SELECT 
            id, 
            title, 
            author, 
            category, 
            description, 
            price 
        FROM books;
    """
    book_info = pd.read_sql(query_books, connection).set_index('id')

    query_reviews = """
        SELECT 
            user_id, 
            book_id AS id,
            rating AS review_score
        FROM reviews;
    """
    reviews_data = pd.read_sql(query_reviews, connection)
    
    user_book_matrix = reviews_data.pivot(index='user_id', columns='id', values='review_score').fillna(0)
    
    return user_book_matrix, book_info

# Funzione di raccomandazione basata su similarità coseno semplice
def recommend_books(book_id, similarity_matrix, num_recommendations=5):
    if book_id not in similarity_matrix.index:
        print(f"Book ID {book_id} not found in similarity matrix.")
        return []
    
    similar_scores = similarity_matrix[book_id]
    similar_books = similar_scores.sort_values(ascending=False).drop(book_id)
    
    return similar_books.head(num_recommendations).index.tolist()

# Funzione di raccomandazione basata su SVD
def recommend_books_svd(book_id, similarity_matrix, num_recommendations=5):
    if book_id not in similarity_matrix.index:
        print(f"Book ID {book_id} not found in similarity matrix.")
        return []
    
    similar_scores = similarity_matrix[book_id]
    similar_books = similar_scores.sort_values(ascending=False).drop(book_id)
    
    return similar_books.head(num_recommendations).index.tolist()

# Funzione combinata di raccomandazione
def combined_recommendation(book_id, simple_similarity_matrix, svd_similarity_matrix, num_recommendations=5):
    simple_recommendations = recommend_books(book_id, simple_similarity_matrix, num_recommendations)
    svd_recommendations = recommend_books_svd(book_id, svd_similarity_matrix, num_recommendations * 2)
    svd_recommendations = [rec for rec in svd_recommendations if rec not in simple_recommendations][:num_recommendations]
    
    return simple_recommendations + svd_recommendations

# Funzione principale per generare le raccomandazioni
def get_recommendations(book_id, num_recommendations=5):
    connection = connect_to_db()
    user_book_matrix, book_info = load_data(connection)
    connection.close()

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

    # Ottieni raccomandazioni combinate
    recommendations = combined_recommendation(book_id, book_similarity_df, book_similarity_svd_df, num_recommendations)
    
    original_book = book_info.loc[book_id]
    recommended_books_info = book_info.loc[recommendations].reset_index()
    
    print("\nDettagli del libro originale:")
    print(pd.DataFrame([original_book]).rename(index={book_id: "Original"}))

    print("\nRaccomandazioni combinate per il libro ID", book_id)
    print(recommended_books_info)

# Esempio di utilizzo
if __name__ == "__main__":
    book_id = int(input("Inserisci l'ID del libro per ottenere le raccomandazioni: "))
    get_recommendations(book_id)
