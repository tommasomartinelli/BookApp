-- Tabella books
CREATE TABLE books (
    id BIGINT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) DEFAULT 'Unknown',
    price DECIMAL(10, 2),
    category VARCHAR(100) DEFAULT 'Unknown',
    publication_year INT DEFAULT NULL,
    publisher VARCHAR(255) DEFAULT 'Unknown',
    description TEXT DEFAULT 'Empty',
    review_count INT DEFAULT 0,
    avg_rating DECIMAL(3, 2) DEFAULT 0.0
);

-- Tabella reviews
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    book_id BIGINT REFERENCES books(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    summary TEXT DEFAULT 'Empty',
    review_text TEXT DEFAULT 'Empty'
);

-- Creazione della funzione per aggiornare review_count e avg_rating su INSERT e UPDATE
CREATE FUNCTION update_book_stats() RETURNS TRIGGER AS $$
BEGIN
    UPDATE books
    SET
        review_count = (SELECT COUNT(*) FROM reviews WHERE book_id = NEW.book_id),
        avg_rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE book_id = NEW.book_id)
    WHERE
        id = NEW.book_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Creazione della funzione per aggiornare review_count e avg_rating su DELETE
CREATE FUNCTION update_book_stats_on_delete() RETURNS TRIGGER AS $$
BEGIN
    UPDATE books
    SET
        review_count = (SELECT COUNT(*) FROM reviews WHERE book_id = OLD.book_id),
        avg_rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE book_id = OLD.book_id)
    WHERE
        id = OLD.book_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Creazione del trigger su INSERT
CREATE TRIGGER update_book_stats_after_insert
AFTER INSERT ON reviews
FOR EACH ROW EXECUTE FUNCTION update_book_stats();

-- Creazione del trigger su UPDATE per il campo rating
CREATE TRIGGER update_book_stats_after_update
AFTER UPDATE OF rating ON reviews
FOR EACH ROW EXECUTE FUNCTION update_book_stats();

-- Creazione del trigger su DELETE
CREATE TRIGGER update_book_stats_after_delete
AFTER DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_book_stats_on_delete();

-- Funzione di trigger per la tabella books
CREATE OR REPLACE FUNCTION set_default_books() 
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.author IS NULL THEN
        NEW.author := 'Unknown';
    END IF;
    IF NEW.category IS NULL THEN
        NEW.category := 'Unknown';
    END IF;
    IF NEW.publisher IS NULL THEN
        NEW.publisher := 'Unknown';
    END IF;
    IF NEW.description IS NULL THEN
        NEW.description := 'Empty';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger per la tabella books
CREATE TRIGGER trigger_set_default_books
BEFORE INSERT OR UPDATE ON books
FOR EACH ROW
EXECUTE FUNCTION set_default_books();

-- Funzione di trigger per la tabella reviews
CREATE OR REPLACE FUNCTION set_default_reviews() 
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.summary IS NULL THEN
        NEW.summary := 'Empty';
    END IF;
    IF NEW.review_text IS NULL THEN
        NEW.review_text := 'Empty';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger per la tabella reviews
CREATE TRIGGER trigger_set_default_reviews
BEFORE INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION set_default_reviews();