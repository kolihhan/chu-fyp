from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer, PasswordField
from rest_framework import serializers, exceptions
from rest_framework_simplejwt.settings import api_settings
from django.utils.translation import gettext_lazy as _
from django import forms
from django.contrib.auth import authenticate
from .models import UserAccount, CustomTokenUser, CustomOutstandingToken
from rest_framework_simplejwt.tokens import RefreshToken
from . import models


class UserIdAndEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserAccount
        fields = ['id', 'email']
        
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

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    username_field = 'email'

    def validate(self, attrs):

        data = {}

        # 使用你的UserAccount模型进行验证
        user = UserAccount.objects.filter(email=attrs.get('email')).first()

        if user is None and not user.check_password(attrs.get('password')):
            raise serializers.ValidationError(
                '錯誤密碼或賬戶'
            )

        # 使用你的CustomTokenUser模型进行token生成
        refresh = CustomTokenUser.refresh_token(self = user)

        data['access'] = str(refresh.access_token)
        data['refresh'] = str(refresh)
        data['user_id'] = user.pk

        return data
    
# class BossSerializer(ModelSerializer):
#     class Meta:
#         model = Boss
#         fields = ['body','update','created']


class CompanySerializer(serializers.ModelSerializer):
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
