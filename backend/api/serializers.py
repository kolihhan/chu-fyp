from django import forms
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework import exceptions, serializers
from rest_framework_simplejwt.serializers import (PasswordField,
                                                  TokenObtainPairSerializer,
                                                  TokenRefreshSerializer)
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import RefreshToken

from . import models
from .models import CustomOutstandingToken, CustomTokenUser, UserAccount


class UserIdAndEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserAccount
        fields = ['id', 'email', 'name']
        
class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    class Meta:
        model = UserAccount
        fields = ['id', 'name', 'email', 'password', 'gender', 'birthday', 'address', 'phone', 'avatar_url', 'created_at', 'updated_at']
        extra_kwargs = {
            'password': {'write_only': True},
            'id': {'read_only': True},
            'address': {'required': False},
            'avatar_url': {'required': False}
        }

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = UserAccount(**validated_data)
        user.set_password(password)
        user.save()
        return user  
    
# class BossSerializer(ModelSerializer):
#     class Meta:
#         model = Boss
#         fields = ['body','update','created']


class CompanySerializer(serializers.ModelSerializer):
    boss_id = UserIdAndEmailSerializer(many=False, read_only=True)
    admin_id = UserIdAndEmailSerializer(many=False, read_only=True)
    class Meta: 
        model = models.Company
        fields = '__all__'

class CompanyEmployeeSerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.CompanyEmployee
        fields = '__all__'

class PermissionSerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.Permission
        fields = '__all__'

class UserPermissionSerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.UserPermission
        fields = '__all__'

class CheckInSerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.checkIn
        fields = '__all__'

class CompanyCheckInRuleSerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.companyCheckInRule
        fields = '__all__'

class AnnouncementGroupSerializer(serializers.ModelSerializer):
    user_id = UserIdAndEmailSerializer(many=True, read_only=True)
    class Meta: 
        model = models.AnnouncementGroup
        fields = '__all__'

class AnnouncementSerializer(serializers.ModelSerializer):
    group = AnnouncementGroupSerializer(many=True, read_only=True)
    class Meta: 
        model = models.Announcement
        fields = '__all__'

class TaskHeaderSerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.TaskHeader
        fields = '__all__'

class TaskItemSerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.TaskItem
        fields = '__all__'

class UserResumeSerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.UserResume
        fields = '__all__'
