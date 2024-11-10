from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, book_details, recommendations

router = DefaultRouter()
router.register(r'books', BookViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('books/<int:book_id>/details/', book_details, name='book-details'),  
    path('books/<int:book_id>/recommendations/', recommendations, name='recommendations'),
]