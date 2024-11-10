from django.db import models

class Book(models.Model):
    id = models.BigIntegerField(primary_key=True)  
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255, default='Unknown', null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    category = models.CharField(max_length=100, default='Unknown', null=True, blank=True)
    publication_year = models.IntegerField(null=True, blank=True)
    publisher = models.CharField(max_length=255, default='Unknown', null=True, blank=True)
    description = models.TextField(default='Empty', null=True, blank=True)
    review_count = models.IntegerField(default=0)
    avg_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)

    class Meta:
        db_table = 'books' 

    def __str__(self):
        return self.title
    
class Review(models.Model):
    id = models.AutoField(primary_key=True)  # SERIAL in PostgreSQL
    book_id = models.ForeignKey(Book, on_delete=models.CASCADE, db_column="book_id")
    user_id = models.CharField(max_length=255)  # ID dell'utente come VARCHAR
    rating = models.IntegerField()  # Controllo del valore nel validatore
    summary = models.TextField(default='Empty', blank=True, null=True)
    review_text = models.TextField(default='Empty', blank=True, null=True)

    class Meta:
        db_table = 'reviews'

    def __str__(self):
        return f"Review by {self.user_id} for Book ID {self.book_id}"

    def clean(self):
        # Imposta un validatore per il rating (deve essere tra 1 e 5)
        if self.rating < 1 or self.rating > 5:
            raise ValidationError('Rating must be between 1 and 5.')
