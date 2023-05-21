from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView, TokenVerifyView)

from .views import *

#Routes

urlpatterns = [
    path('register', register, name='register'),
    path('login', MyTokenObtainPairView.as_view(), name='login'),
    
    path('company/<str:pk>', getCompany, name='getCompany'),
    path('createCompany', createCompany, name='createCompany'),
    path('updateCompany/<str:pk>', updateCompany, name='updateCompany'),
    path('deleteCompany/<str:pk>', deleteCompany, name='deleteCompany'),

    path('addCompanyEmployee', addCompanyEmployee, name='addCompanyEmployee'),
    path('companyEmployee/<str:pk>', getCompanyEmployee, name='getCompanyEmployee'),
    path('updateCompanyEmployee/<str:pk>', updateCompanyEmployee, name='updateCompanyEmployee'),
    path('deleteCompanyEmployee/<str:pk>', deleteCompanyEmployee, name='deleteCompanyEmployee'),

    path('announcements', getAnnouncements, name='announcements'),
    path('announcementsuser/<str:companyId>/<str:userId>', getUserAnnouncements, name='announcementsByUser'),
    path('announcement/<str:pk>', getAnnouncement, name='announcement'),

    path('update/<int:pk>', update_user_account, name='update_account'),
    
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    path('resumes/', UserResumeView.as_view(), name='user_resume_list'),
    path('resumes/<int:pk>/', UserResumeView.as_view(), name='user_resume_detail'),

    
    path('companys', getAllCompany, name='company'),
    path('boss/company/<str:pk>', getBossCompany, name='getBossCompany')


]

# create company
# get all company of the boss
# get a company by company id
# update company data
# delete company by company id
# set admin for the company
# add employee to a company
# get boss all company's admin
# get boss all company's employee
# get company's admin
# get company's employee
# get employee
# update data of company employee (role, position, salary)
# delete company employee by company id and user id
# post announcement
# get all announcements
# get all announcement of user by companyId and userId
# get one announcement
# update announcement
    # delete announcement