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
    
    # create company
    path('createCompany', views.createCompany, name='createCompany'),
    
    # get all company of the boss 
    # pk = boss user id
    path('boss/company/<str:pk>', views.getBossCompany, name='getBossCompany'), 
    
    # get a company by company id 
    # pk = company id
    path('company/<str:pk>', views.getCompany, name='getCompany'), 
    
    # update company data 
    # pk = company id
    path('updateCompany/<str:pk>', views.updateCompany, name='updateCompany'), 
    
    # delete company by company id
    # pk = company id
    path('deleteCompany/<str:pk>', views.deleteCompany, name='deleteCompany'), 
    
    # set admin for the company 
    path('company/update/admin', views.updateCompanyAdmin, name='setCompanyAdmin'), 

    # get boss all company's admin
    # pk = boss user id
    path('boss/company/admin/<str:pk>', views.getBossCompanyAdmin, name='getBossCompanyAdmin'), 
    
    # get boss all company's employee
    # pk = boss user id
    path('boss/company/employee/<str:pk>', views.getBossCompanyEmployee, name='getBossCompanyEmployee'), 
    
    # add employee to a company
    path('addCompanyEmployee', views.addCompanyEmployee, name='addCompanyEmployee'),
    
    # get company's admin
    # pk = company id
    path('company/admin/<str:pk>', views.getCompanyAdmin, name='getCompanyAdmin'),

    # get company's employee
    # pk = company id
    path('company/employee/<str:pk>', views.getCompanyEmployee, name='getCompanyEmployee'),
    
    # get employee
    # pk = employee id
    path('employee/<str:pk>', views.getEmployee, name='getEmployee'),
    
    # update data of company employee (role, position, salary)
    path('updateCompanyEmployee', views.updateCompanyEmployee, name='updateCompanyEmployee'),
    
    # delete company employee by company id and user id
    path('deleteCompanyEmployee', views.deleteCompanyEmployee, name='deleteCompanyEmployee'),

    # post announcement
    path('announcement/post', views.postAnnouncement, name='postAnnouncements'),

    # get all announcements
    path('announcements', views.getAnnouncements, name='announcements'),

    # get all announcement of user by companyId and userId
    path('announcementsuser/<str:companyId>/<str:userId>', views.getUserAnnouncements, name='announcementsByUser'),

    # get one announcement
    path('announcement/<str:pk>', views.getAnnouncement, name='announcement'),

    # update announcement
    path('announcement/update/<str:pk>', views.updateAnnouncement, name='announcement'),
    
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    
    path('companys', getAllCompany, name='company'),


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