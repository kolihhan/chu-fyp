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

    # announcementGroup
    path('announcementGroup/create', createAnnouncementGroup, name='createAnnouncementGroup'),
    path('announcementGroup/get/<int:pk>', getAnnouncementGroup, name='getAnnouncementGroup'),
    path('announcementGroup/get/company/all/<int:pk>', getCompanyAllAnnouncementGroup, name='getCompanyAllAnnouncementGroup'),
    path('announcementGroup/update/<int:pk>', updateAnnouncementGroup, name='updateAnnouncementGroup'),
    path('announcementGroup/delete/<int:pk>', deleteAnnouncementGroup, name='deleteAnnouncementGroup'),

    # announcement
    path('announcement/create', postAnnouncement, name='postAnnouncement'),
    path('announcement/get/<int:pk>', getAnnouncement, name='getAnnouncement'),
    path('announcement/get/user/all/<int:companyId>/<int:employeeId>', getUserAllAnnouncement, name='getUserAllAnnouncement'),
    path('announcement/get/company/all/<int:companyId>', getCompanyAllAnnouncement, name='getCompanyAllAnnouncement'),
    path('announcement/update/<int:pk>', updateAnnouncement, name='updateAnnouncement'),
    path('announcement/delete/<int:pk>', deleteAnnouncement, name='deleteAnnouncement'),

    # companyTraining
    path('companyTraining/create', createCompanyTraining, name='createCompanyTraining'),
    path('companyTraining/get/<int:pk>', getCompanyTraining, name='getCompanyTraining'),
    path('companyTraining/get/company/all/<int:pk>', getCompanyAllTraining, name='getCompanyAllTraining'),
    path('companyTraining/update/<int:pk>', updateCompanyTraining, name='updateCompanyTraining'),
    path('companyTraining/delete/<int:pk>', deleteCompanyTraining, name='deleteCompanyTraining'),
    
    # companyEmployeeTraining
    path('companyEmployeeTraining/create', createCompanyEmployeeTraining, name='createCompanyEmployeeTraining'),
    path('companyEmployeeTraining/get/<int:pk>', getCompanyEmployeeTraining, name='getCompanyEmployeeTraining'),
    path('companyEmployeeTraining/get/company/all/<int:pk>', getCompanyAllCompanyEmployeeTraining, name='getCompanyAllCompanyEmployeeTraining'),
    path('companyEmployeeTraining/get/employee/all/<int:pk>', getEmployeeAllCompanyEmployeeTraining, name='getEmployeeAllCompanyEmployeeTraining'),
    path('companyEmployeeTraining/update/<int:pk>', updateCompanyEmployeeTraining, name='updateCompanyEmployeeTraining'),
    path('companyEmployeeTraining/delete/<int:pk>', deleteCompanyEmployeeTraining, name='deleteCompanyEmployeeTraining'),

    # CompanyEmployeePerformance
    path('companyEmployeePerformance/create', createCompanyEmployeePerformance, name='createCompanyEmployeePerformance'),
    path('companyEmployeePerformance/get/<int:pk>', getCompanyEmployeePerformance, name='getCompanyEmployeePerformance'),
    path('companyEmployeePerformance/get/company/all/<int:pk>', getCompanyAllEmployeePerformance, name='getCompanyAllEmployeePerformance'),
    path('companyEmployeePerformance/get/employee/all/<int:pk>', getEmployeeAllEmployeePerformance, name='getEmployeeAllEmployeePerformance'),
    path('companyEmployeePerformance/update/<int:pk>', updateCompanyEmployeePerformance, name='updateCompanyEmployeePerformance'),
    path('companyEmployeePerformance/delete/<int:pk>', deleteCompanyEmployeePerformance, name='deleteCompanyEmployeePerformance'),
    
    # CompanyEmployeeFeedBackReview
    path('companyEmployeeFeedBackReview/create', createCompanyEmployeeFeedbackReview, name='createCompanyEmployeeFeedbackReview'),
    path('companyEmployeeFeedBackReview/get/<int:pk>', getCompanyEmployeeFeedbackReview, name='getCompanyEmployeeFeedbackReview'),
    path('companyEmployeeFeedBackReview/get/company/all/<int:pk>', getCompanyAllEmployeeFeedbackReview, name='getCompanyAllEmployeeFeedbackReview'),
    path('companyEmployeeFeedBackReview/get/employee/by/all/<int:pk>', getEmployeeAllEmployeeFeedbackReviewBy, name='getEmployeeAllEmployeeFeedbackReviewBy'),
    path('companyEmployeeFeedBackReview/get/employee/to/all/<int:pk>', getEmployeeAllEmployeeFeedbackReviewTo, name='getEmployeeAllEmployeeFeedbackReviewTo'),
    path('companyEmployeeFeedBackReview/update/<int:pk>', updateCompanyEmployeeFeedbackReview, name='updateCompanyEmployeeFeedbackReview'),
    path('companyEmployeeFeedBackReview/delete/<int:pk>', deleteCompanyEmployeeFeedbackReview, name='deleteCompanyEmployeeFeedbackReview'),
    
    # CompanyEmployeeFeedBackReview
    path('companyRecruitment/create', createCompanyRecruitment, name='createCompanyRecruitment'),
    path('companyRecruitment/get/<int:pk>', getCompanyRecruitment, name='getCompanyRecruitment'),
    path('companyRecruitment/get/company/all/<int:pk>', getCompanyAllRecruitment, name='getCompanyAllRecruitment'),
    path('companyRecruitment/get/applied/all/<int:pk>', getCompanyRecruitmentAppliedUser, name='getCompanyRecruitmentAppliedUser'),
    path('companyRecruitment/update/<int:pk>', updateCompanyRecruitment, name='updateCompanyRecruitment'),
    path('companyRecruitment/close/<int:pk>', closeCompanyRecruitment, name='closeCompanyRecruitment'),
    path('companyRecruitment/delete/<int:pk>', deleteCompanyRecruitment, name='deleteCompanyRecruitment'),
  
    # CompanyCheckInRule
    path('companyCheckInRule/create', createCompanyCheckInRule, name='createCompanyCheckInRule'),
    path('companyCheckInRule/get/<int:pk>', getCompanyCheckInRule, name='getCompanyCheckInRule'),
    path('companyCheckInRule/update/<int:pk>', updateCompanyCheckInRule, name='updateCompanyCheckInRule'),
    path('companyCheckInRule/delete/<int:pk>', deleteCompanyCheckInRule, name='deleteCompanyCheckInRule'),

    # resume
    path('userResume/create', createUserResume, name='createUserResume'),
    path('userResume/get/<int:pk>', getUserResume, name='getUserResume'),
    path('userResume/get/user/all/<int:pk>', getUserAllResume, name='getUserAllResume'),
    path('userResume/update/<int:pk>', updateUserResume, name='updateUserResume'),
    path('userResume/delete/<int:pk>', deleteUserResume, name='deleteUserResume'),

    path('user/resume', UserResumeAPIView.as_view(), name='user-resume'),
    path('user/resume/<int:resume_id>', UserResumeAPIView.as_view(), name='user-resume-detail'),

    # userApplicationRecord
    path('userApplicationRecord/create', createUserApplicationRecord, name='createUserApplicationRecord'),
    path('userApplicationRecord/get/<int:pk>', getUserApplicationRecord, name='getUserApplicationRecord'),
    path('userApplicationRecord/get/user/all/<int:pk>', getAllUserApplicationRecordByUser, name='getUserApplicationRecordByUser'),
    path('userApplicationRecord/get/company/all/<int:pk>', getAllUserApplicationRecordByCompany, name='getUserApplicationRecordByCompany'),
    path('userApplicationRecord/update/<int:pk>', updateUserApplicationRecord, name='updateUserApplicationRecord'),
    path('userApplicationRecord/delete/<int:pk>', deleteUserApplicationRecord, name='deleteUserApplicationRecord'),

    path('user/application', UserApplicationRecordAPIView.as_view(), name='job-application'),
    path('user/application/<int:application_id>', UserApplicationRecordAPIView.as_view(), name='job-application-detail'),

    # companyCheckIn
    path('company/check-in/<int:pk>', CompanyCheckInAPIView.as_view(), name='company-check-in'),
    path('company/check-in/<int:pk>/<int:record_id>', CompanyCheckInAPIView.as_view(), name='company-check-in'),

    #companyPromotionRecord
    path('company/promotion/<int:pk>', CompanyPromotionRecordAPIView.as_view(), name='company-promotion'),
    path('company/promotion/<int:pk>/<int:record_id>', CompanyPromotionRecordAPIView.as_view(), name='company-promotion'),

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