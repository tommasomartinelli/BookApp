import psycopg2
import pandas as pd

DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "bookstore"
DB_USER = "user"
DB_PASSWORD = "password"

def connect_to_db():
    try:
        connection = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        connection.autocommit = True
        return connection
    except Exception as error:
        print("Errore nella connessione al database:", error)
        return None

def load_books_data(connection, books_csv_path):
    books_df = pd.read_csv(books_csv_path)
    with connection.cursor() as cursor:
        for _, row in books_df.iterrows():
            cursor.execute("""
                INSERT INTO books (id, title, author, price, category, publication_year, publisher, description)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO NOTHING;  -- Ignora se esiste già un libro con questo ID
            """, (
                row['Unified_Id'],              
                row['Title'] if pd.notna(row['Title']) else 'Unknown',
                row['authors'] if pd.notna(row['authors']) else 'Unknown',
                row['Price'] if pd.notna(row['Price']) else 0.0,
                row['categories'] if pd.notna(row['categories']) else 'Unknown',
                row['publishedYear'] if pd.notna(row['publishedYear']) else None,
                row['publisher'] if pd.notna(row['publisher']) else 'Unknown',
                row['description'] if pd.notna(row['description']) else 'Empty'
            ))
    print("Dati dei libri caricati con successo.")

# Funzione per caricare i dati delle recensioni
def load_reviews_data(connection, reviews_csv_path):
    reviews_df = pd.read_csv(reviews_csv_path)
    with connection.cursor() as cursor:
        for _, row in reviews_df.iterrows():
            cursor.execute("""
                INSERT INTO reviews (book_id, user_id, rating, summary, review_text)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT DO NOTHING;  -- Ignora se c'è già una recensione con lo stesso ID
            """, (
                row['Unified_Id'],              
                row['User_id'],
                row['review/score'] if pd.notna(row['review/score']) else 0,
                row['review/summary'] if pd.notna(row['review/summary']) else 'Empty',
                row['review/text'] if pd.notna(row['review/text']) else 'Empty'
            ))
    print("Dati delle recensioni caricati con successo.")

def main():
    connection = connect_to_db()
    if connection:
        load_books_data(connection, 'data_preprocessed/books_table.csv')   
        load_reviews_data(connection, 'data_preprocessed/reviews_table.csv')  
        connection.close()
        print("Caricamento dei dati completato e connessione chiusa.")

if __name__ == "__main__":
    main()