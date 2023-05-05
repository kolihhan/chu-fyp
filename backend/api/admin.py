from django.contrib import admin
from django import forms
from django.contrib.admin.widgets import AutocompleteSelect
from .models import UserAccount, CustomOutstandingToken
from . import models

#Show ur api models in super user page

# set showing column in table
companyExclude = ['']

class UserAccountAdmin(admin.ModelAdmin):
    list_display = [f.name for f in UserAccount._meta.fields]

class CustomOutstandingTokenAdmin(admin.ModelAdmin):
    list_display = [f.name for f in CustomOutstandingToken._meta.fields]

class CompanyAdmin(admin.ModelAdmin):
    
    list_display = ('id', 'name', '_boss_id', '_admin_id','email', 'phone', 'address', 'company_desc', 'company_benefits', 'create_at', 'update_at')
    def _boss_id(self, obj):
        return str(obj.boss_id.id) +" "+ obj.boss_id.email
    def _admin_id(self, obj):
        return str(obj.admin_id.id) +" "+ obj.admin_id.email if obj.admin_id else None

    _boss_id.short_description = 'Boss ID'
    _admin_id.short_description = 'Admin ID'

class CompanyEmployeeAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.CompanyEmployee._meta.fields]
    if 'company_id' in list_display:
        list_display[list_display.index('company_id')] = '_company_id'
    if 'user_id' in list_display:
        list_display[list_display.index('user_id')] = '_user_id'

    def _company_id(self, obj):
        return str(obj.company_id.id) + " " + obj.company_id.name
    def _user_id(self, obj):
        return str(obj.user_id.id) + " " + obj.user_id.email

class PermissionAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.Permission._meta.fields]

class UserPermissionAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.UserPermission._meta.fields]
    if 'company_id' in list_display:
        list_display[list_display.index('company_id')] = '_company_id'
    if 'user_id' in list_display:
        list_display[list_display.index('user_id')] = '_user_id'

    def _company_id(self, obj):
        return str(obj.company_id.id) + " " + obj.company_id.name
    def _user_id(self, obj):
        return str(obj.user_id.id) + " " + obj.user_id.email

class checkInAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.checkIn._meta.fields]
    if 'company_id' in list_display:
        list_display[list_display.index('company_id')] = '_company_id'
    if 'user_id' in list_display:
        list_display[list_display.index('user_id')] = '_user_id'

    def _company_id(self, obj):
        return str(obj.company_id.id) + " " + obj.company_id.name
    def _user_id(self, obj):
        return str(obj.user_id.id) + " " + obj.user_id.email

class companyCheckInRuleAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.companyCheckInRule._meta.fields]
    if 'company_id' in list_display:
        list_display[list_display.index('company_id')] = '_company_id'

    def _company_id(self, obj):
        return str(obj.company_id.id) + " " + obj.company_id.name

class AnnouncementGroupAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.AnnouncementGroup._meta.fields]
    if 'company_id' in list_display:
        list_display[list_display.index('company_id')] = '_company_id'
    if 'user_id' in list_display:
        list_display[list_display.index('user_id')] = '_user_id'

    def _company_id(self, obj):
        return str(obj.company_id.id) + " " + obj.company_id.name
    def _user_id(self, obj):
        return str(obj.user_id.id) + " " + obj.user_id.email

class AnnouncementAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.Announcement._meta.fields]
    if 'company_id' in list_display:
        list_display[list_display.index('company_id')] = '_company_id'
    if 'user_id' in list_display:
        list_display[list_display.index('user_id')] = '_user_id'

    def _company_id(self, obj):
        return str(obj.company_id.id) + " " + obj.company_id.name
    def _user_id(self, obj):
        return str(obj.user_id.id) + " " + obj.user_id.email

class TaskHeaderAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.TaskHeader._meta.fields]
    if 'company_id' in list_display:
        list_display[list_display.index('company_id')] = '_company_id'
    if 'create_by' in list_display:
        list_display[list_display.index('create_by')] = '_create_by'

    def _company_id(self, obj):
        return str(obj.company_id.id) + " " + obj.company_id.name
    def _create_by(self, obj):
        return str(obj.create_by.id) + " " + obj.create_by.email    

class TaskItemAdmin(admin.ModelAdmin):
    list_display = [f.name for f in models.TaskItem._meta.fields]
    if 'task_header_id' in list_display:
        list_display[list_display.index('task_header_id')] = '_task_header_id'
    if 'create_by' in list_display:
        list_display[list_display.index('create_by')] = '_create_by'

    def _task_header_id(self, obj):
        return str(obj.task_header_id.id) + " " + obj.task_header_id.name
    def _create_by(self, obj):
        return str(obj.create_by.id) + " " + obj.create_by.email

# Register your models here.
admin.site.register(UserAccount, UserAccountAdmin)
admin.site.register(CustomOutstandingToken, CustomOutstandingTokenAdmin)
admin.site.register(models.Company, CompanyAdmin)
admin.site.register(models.CompanyEmployee, CompanyEmployeeAdmin)
admin.site.register(models.Permission, PermissionAdmin)
admin.site.register(models.UserPermission, UserPermissionAdmin)
admin.site.register(models.checkIn, checkInAdmin)
admin.site.register(models.companyCheckInRule, companyCheckInRuleAdmin)
admin.site.register(models.AnnouncementGroup, AnnouncementGroupAdmin)
admin.site.register(models.Announcement, AnnouncementAdmin)
admin.site.register(models.TaskHeader, TaskHeaderAdmin)
admin.site.register(models.TaskItem, TaskItemAdmin)