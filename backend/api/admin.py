from django.contrib import admin
from django import forms
from django.contrib.admin.widgets import AutocompleteSelect
from .models import UserAccount
from . import models

#Show ur api models in super user page

# set showing column in table
companyExclude = ['']

class UserAccountAdmin(admin.ModelAdmin):
    list_display = [f.name for f in UserAccount._meta.fields]

# class CustomOutstandingTokenAdmin(admin.ModelAdmin):
#     list_display = [f.name for f in CustomOutstandingToken._meta.fields]

class UserResumeAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.UserResume._meta.fields]

class UserApplicationRecordAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.UserApplicationRecord._meta.fields]

class UserOfferRecordAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.UserOfferRecord._meta.fields]

class CompanyAdmin(admin.ModelAdmin):
    list_display = [
        '_boss_id' if f.name=='boss_id' 
        else f.name for f in models.Company._meta.fields
    ]
    def _boss_id(self, obj):
        return str(obj.boss_id.id) +" "+ obj.boss_id.email
    # _boss_id.short_description = 'Boss'

class CompanyEmployeeAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.CompanyEmployee._meta.fields]

class CompanyEmployeePositionAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.CompanyEmployeePosition._meta.fields]

class CompanyDepartmentAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.CompanyDepartment._meta.fields]

class CompanyPermissionAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.CompanyPermission._meta.fields]
    
class CompanyRecruitmentAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.CompanyRecruitment._meta.fields]

class CompanyBenefitsAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.CompanyBenefits._meta.fields]

class CompanyPromotionRecordAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.CompanyPromotionRecord._meta.fields]

class CompanyEmployeePerformanceReviewAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.CompanyEmployeePerformanceReview._meta.fields]

class CompanyTrainingAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.CompanyTraining._meta.fields]

class CompanyEmployeeTrainingAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.CompanyEmployeeTraining._meta.fields]

class CompanyEmployeeFeedBackReviewAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.CompanyEmployeeFeedBackReview._meta.fields]

class checkInAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.CompanyCheckIn._meta.fields]

class companyCheckInRuleAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.companyCheckInRule._meta.fields]

class AnnouncementGroupAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.CompanyAnnouncementGroup._meta.fields]

class AnnouncementAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.CompanyAnnouncement._meta.fields]

class CompanyEmployeeEvaluateAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.CompanyEmployeeEvaluate._meta.fields]

# Register your models here.
admin.site.register(UserAccount, UserAccountAdmin)
admin.site.register(models.UserResume, UserResumeAdmin)
admin.site.register(models.UserApplicationRecord, UserApplicationRecordAdmin)
admin.site.register(models.UserOfferRecord, UserOfferRecordAdmin)
admin.site.register(models.Company, CompanyAdmin)
admin.site.register(models.CompanyEmployee, CompanyEmployeeAdmin)
admin.site.register(models.CompanyEmployeePosition, CompanyEmployeePositionAdmin)
admin.site.register(models.CompanyDepartment, CompanyDepartmentAdmin)
admin.site.register(models.CompanyPermission, CompanyPermissionAdmin)
admin.site.register(models.CompanyRecruitment, CompanyRecruitmentAdmin)
admin.site.register(models.CompanyBenefits, CompanyBenefitsAdmin)
admin.site.register(models.CompanyPromotionRecord, CompanyPromotionRecordAdmin)
admin.site.register(models.CompanyEmployeePerformanceReview, CompanyEmployeePerformanceReviewAdmin)
admin.site.register(models.CompanyTraining, CompanyTrainingAdmin)
admin.site.register(models.CompanyEmployeeTraining, CompanyEmployeeTrainingAdmin)
admin.site.register(models.CompanyEmployeeFeedBackReview, CompanyEmployeeFeedBackReviewAdmin)
admin.site.register(models.CompanyCheckIn, checkInAdmin)
admin.site.register(models.companyCheckInRule, companyCheckInRuleAdmin)
admin.site.register(models.CompanyAnnouncementGroup, AnnouncementGroupAdmin)
admin.site.register(models.CompanyAnnouncement, AnnouncementAdmin)
admin.site.register(models.CompanyEmployeeEvaluate, CompanyEmployeeEvaluateAdmin)
# admin.site.register(CustomOutstandingToken, CustomOutstandingTokenAdmin)