from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PersonViewSet, TreeView, RegisterView, CustomAuthToken

router = DefaultRouter()
router.register(r'people', PersonViewSet, basename='person')

urlpatterns = [
    path('', include(router.urls)),
    path('tree/', TreeView.as_view(), name='family-tree'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomAuthToken.as_view(), name='login'),
]
