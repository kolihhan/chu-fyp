from django.urls import path
from .views import register, MyTokenObtainPairView, getAllCompany, getAnnouncements, getUserAnnouncements, getAnnouncement
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
#Routes

urlpatterns = [
    path('register', register, name='register'),
    path('login', MyTokenObtainPairView.as_view(), name='login'),
    
    path('company/<str:pk>', views.getCompany, name='getCompany'),
    path('createCompany', views.createCompany, name='createCompany'),
    path('updateCompany/<str:pk>', views.updateCompany, name='updateCompany'),
    path('deleteCompany/<str:pk>', views.deleteCompany, name='deleteCompany'),

    path('addCompanyEmployee', views.addCompanyEmployee, name='addCompanyEmployee'),
    path('companyEmployee/<str:pk>', views.getCompanyEmployee, name='getCompanyEmployee'),
    path('updateCompanyEmployee/<str:pk>', views.updateCompanyEmployee, name='updateCompanyEmployee'),
    path('deleteCompanyEmployee/<str:pk>', views.deleteCompanyEmployee, name='deleteCompanyEmployee'),

    path('announcements', getAnnouncements, name='announcements'),
    path('announcementsuser/<str:companyId>/<str:userId>', getUserAnnouncements, name='announcementsByUser'),
    path('announcement/<str:pk>', getAnnouncement, name='announcement'),
    
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    
    path('companys', getAllCompany, name='company'),
]
