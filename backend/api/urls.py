from django.urls import path
from rest_framework_simplejwt.views import (TokenObtainPairView,
                                            TokenRefreshView, TokenVerifyView)

from .views import *
from . import views


#Routes

urlpatterns = [
    path('register', register, name='register'),
    path('login', MyTokenObtainPairView.as_view(), name='login'),
    
    # user
    path('user/get/multiple/email/<str:pk>', getMultipleUserByEmail, name='getMultipleUserByEmail'),

    # company
    path('company/<str:pk>', getCompany, name='getCompany'),
    path('createCompany', createCompany, name='createCompany'),
    path('updateCompany/<str:pk>', updateCompany, name='updateCompany'),
    path('deleteCompany/<str:pk>', deleteCompany, name='deleteCompany'),
    path('boss/company/<str:pk>', getBossAllCompany, name='getBossCompany'),

    # resume
    path('resume/create', createResume, name='createResume'),
    path('resume/get/<int:pk>', getResume, name='getResume'),
    path('resume/get/user/<int:pk>', getUserAllResume, name='getUserAllResume'),
    path('resume/update/<int:pk>', updateResume, name='updateResume'),
    path('resume/delete/<int:pk>', deleteResume, name='deleteResume'),

    # department
    path('companyDepartment/create', createDepartment, name='createDepartment'),
    path('companyDepartment/get/<int:pk>', getDepartment, name='getDepartment'),
    path('companyDepartment/get/company/all/<int:pk>', getCompanyAllDepartment, name='getCompanyAllDepartment'),
    path('companyDepartment/update/<int:pk>', updateDepartment, name='updateDepartment'),
    path('companyDepartment/delete/<int:pk>', deleteDepartment, name='deleteDepartment'),

    # benefit
    path('companyBenefit/create', createBenefit, name='createBenefit'),
    path('companyBenefit/get/<int:pk>', getBenefit, name='getBenefit'),
    path('companyBenefit/get/company/all/<int:pk>', getCompanyAllBenefit, name='getCompanyAllBenefit'),
    path('companyBenefit/update/<int:pk>', updateBenefit, name='updateBenefit'),
    path('companyBenefit/delete/<int:pk>', deleteBenefit, name='deleteBenefit'),

    # position
    path('companyPosition/create', createPosition, name='createPosition'),
    path('companyPosition/get/<int:pk>', getPosition, name='getPosition'),
    path('companyPosition/get/company/all/<int:pk>', getCompanyAllPosition, name='getCompanyAllPosition'),
    path('companyPosition/update/<int:pk>', updatePosition, name='updatePosition'),
    path('companyPosition/delete/<int:pk>', deleteDepartment, name='deleteDepartment'),

    # permission
    path('companyPermission/create', createCompanyPermission, name='createCompanyPermission'),
    path('companyPermission/get/<int:pk>', getCompanyPermission, name='getCompanyPermission'),
    path('companyPermission/update/<int:pk>', updateCompanyPermission, name='updateCompanyPermission'),
    path('companyPermission/delete/<int:pk>', deleteCompanyPermission, name='deleteCompanyPermission'),
    path('companyPermission/get/company/all/<int:pk>', getCompanyAllCompanyPermission, name='getCompanyAllCompanyPermission'),

    # companyEmployee
    path('companyEmployee/create', createCompanyEmployee, name='createCompanyEmployee'),
    path('companyEmployee/get/<str:pk>', getCompanyEmployee, name='getCompanyEmployee'),
    path('companyEmployee/get/company/all/<str:pk>', getCompanyAllEmployee, name='getCompanyAllEmployee'),
    path('companyEmployee/update/<str:pk>', updateCompanyEmployee, name='updateCompanyEmployee'),
    path('companyEmployee/delete/<str:pk>', deleteCompanyEmployee, name='deleteCompanyEmployee'),
    path('companyEmployee/create/multiple', createMultipleCompanyEmployee, name='createMultipleCompanyEmployee'),
    path('companyEmployee/fire/<int:pk>', fireEmployee, name='fireEmployee'),

    # announcement
    path('announcement/create', postAnnouncement, name='postAnnouncement'),
    path('announcement/get/<int:pk>', getAnnouncement, name='getAnnouncement'),
    path('announcement/update/<int:pk>', updateAnnouncement, name='updateAnnouncement'),
    path('announcement/delete/<int:pk>', deleteAnnouncement, name='deleteAnnouncement'),

    # resume
    path('user/resume', UserResumeAPIView.as_view(), name='user-resume'),
    path('user/resume/<int:resume_id>', UserResumeAPIView.as_view(), name='user-resume-detail'),

    path('user/application', UserApplicationRecordAPIView.as_view(), name='job-application'),
    path('user/application/<int:application_id>', UserApplicationRecordAPIView.as_view(), name='job-application-detail'),

    path('update/<int:pk>', update_user_account, name='update_account'),
    
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    
    


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