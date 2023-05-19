import json

from django.contrib.auth import get_user_model
from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager,
                                        Group, Permission, PermissionsMixin)
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.models import TokenUser
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import BlacklistMixin, RefreshToken, Token

# Create your models here.

#Diff between auto_now and auto_now_add
#auto_now_add : 只執行一次
#auto_now : 每次都會執行

# 用戶資料模型
class UserAccountManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
class UserAccount(AbstractBaseUser, PermissionsMixin):

    groups = models.ManyToManyField(
        Group,
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name='user_accounts' # add this
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name='user_accounts' # add this
    )

    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10)
    birthday = models.DateField()
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    avatar_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

    def get_full_name(self):
        return self.name
    
# Company模型
class Company(models.Model):
    name = models.CharField()
    boss_id = models.ForeignKey('UserAccount', on_delete=models.CASCADE, related_name='boss')
    admin_id = models.ForeignKey('UserAccount', blank=True, null=True, on_delete=models.SET_NULL, related_name='admin')
    email = models.CharField()
    phone = models.CharField(max_length=20)
    address = models.CharField()
    company_desc = models.TextField()
    company_benefits = models.TextField()
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name

# Company員工資料模型
class CompanyEmployee(models.Model):
    company_id = models.ForeignKey('Company', on_delete=models.CASCADE)
    user_id = models.ForeignKey('UserAccount', on_delete=models.CASCADE)
    role = models.CharField(default='Staff')
    position = models.CharField(default='Staff')
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return str(self.user_id)

class Permission(models.Model):
    name = models.CharField()
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name
 
class UserPermission(models.Model):
    user_id = models.ForeignKey('UserAccount', on_delete=models.CASCADE)
    permission_id = models.ManyToManyField('Permission')
    company_id = models.ForeignKey('Company', on_delete=models.CASCADE)
    create_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return str(self.user_id)

class checkIn(models.Model):
    user_id = models.ForeignKey('UserAccount', on_delete=models.CASCADE)
    company_id = models.ForeignKey('Company', on_delete=models.CASCADE)
    check_in_time = models.DateTimeField()
    check_out_time= models.DateTimeField(blank=True, null=True)
    create_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return str(self.user_id)

class companyCheckInRule(models.Model):
    company_id = models.ForeignKey('Company', on_delete=models.CASCADE)
    work_time_start = models.TimeField()
    work_time_end = models.TimeField()
    late_tolerance = models.DurationField() # 可容許的遲到範圍 # exp: 9點上班，9點半到不算遲到 # HH:MM:SS
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return str(self.company_id)

class AnnouncementGroup(models.Model):
    company_id = models.ForeignKey('Company', on_delete=models.CASCADE)
    user_id = models.ManyToManyField('UserAccount', blank=True)
    name = models.CharField()
    description = models.TextField(blank=True, null=True)
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return str(self.name)
    
class Announcement(models.Model):
    company_id = models.ForeignKey('Company', on_delete=models.CASCADE)
    user_id = models.ForeignKey('UserAccount', on_delete=models.CASCADE)
    title = models.CharField()
    content = models.TextField()
    group = models.ManyToManyField('AnnouncementGroup', blank=True)
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    expire_at = models.DateTimeField(blank=True, null=True)
    def __str__(self):
        return str(self.company_id)

class UserResume(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    summary = models.TextField()
    experience = models.TextField()
    education = models.TextField()
    skills = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
