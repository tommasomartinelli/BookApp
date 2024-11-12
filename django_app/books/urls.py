from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookViewSet, book_details, recommendations, get_reviews, add_review, get_user_reviews, update_review, delete_review, user_based_recommendations

router = DefaultRouter()
router.register(r'books', BookViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('books/<int:book_id>/details/', book_details, name='book-details'),  
    path('books/<int:book_id>/recommendations/', recommendations, name='recommendations'),
    path('books/<int:book_id>/reviews/', get_reviews, name='get-reviews'),  
    path('books/<int:book_id>/add-review/', add_review, name='add-review'),
    path('user/<str:user_id>/reviews/', get_user_reviews, name='get-user-reviews'),
    path('review/<int:review_id>/update/', update_review, name='update-review'),
    path('review/<int:review_id>/delete/', delete_review, name='delete-review'),
    path('user/<str:user_id>/recommendations/', user_based_recommendations, name='user-based-recommendations'),
]