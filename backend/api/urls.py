from django.urls import path
from .views import register, MyTokenObtainPairView, getAllCompany, getAllAnnouncements
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
#Routes

urlpatterns = [
    path('register', register, name='register'),
    path('login', MyTokenObtainPairView.as_view(), name='login'),
    path('companys', getAllCompany, name='company'),
    path('announcement', getAllAnnouncements, name='announcement'),
    
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
