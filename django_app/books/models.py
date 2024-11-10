from django.db import models

class Book(models.Model):
    id = models.BigIntegerField(primary_key=True)  
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255, default='Unknown')
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    category = models.CharField(max_length=100, default='Unknown')
    publication_year = models.IntegerField(null=True)
    publisher = models.CharField(max_length=255, default='Unknown')
    description = models.TextField(default='Empty')
    review_count = models.IntegerField(default=0)
    avg_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)

    class Meta:
        db_table = 'books' 

    def __str__(self):
        return self.title