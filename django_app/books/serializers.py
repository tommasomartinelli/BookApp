from rest_framework import serializers
from .models import Book, Review

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__' 

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'book_id', 'user_id', 'rating', 'summary', 'review_text']
        read_only_fields = ['id']