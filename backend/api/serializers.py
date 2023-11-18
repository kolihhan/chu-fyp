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
from .models import UserAccount


class UserIdAndEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserAccount
        fields = ['id', 'email', 'name', 'avatar_url']

class WorkingExperienceSerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.WorkingExperience
        fields = '__all__'
    
class EducationSerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.Education
        fields = '__all__'

class CompanyPermissionNameAndDescSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CompanyPermission
        fields = ['id', 'permission_name', 'permission_desc']

class CompanyDepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CompanyDepartment
        fields = '__all__'

class CompanyEmployeePositionPermissionSerializer(serializers.ModelSerializer):
    companyPermission_id = CompanyPermissionNameAndDescSerializer(many=True, read_only=True)
    companyDepartment_id = CompanyDepartmentSerializer(many=False, read_only=True)
    class Meta:
        model = models.CompanyEmployeePosition
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True)
    class Meta:
        model = UserAccount
        fields = ['id', 'name', 'email', 'password', 'gender', 'birthday', 'address', 'phone', 'avatar_url', 'created_at', 'updated_at', 'type']
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
class UserUpdateSerializer(serializers.ModelSerializer):

    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = UserAccount
        fields = ['id', 'name', 'email', 'password', 'gender', 'birthday', 'address', 'phone', 'avatar_url', 'created_at', 'updated_at']
        extra_kwargs = {
            'id': {'read_only': True},
            'address': {'required': False},
            'avatar_url': {'required': False}
        }
    
# class BossSerializer(ModelSerializer):
#     class Meta:
#         model = Boss
#         fields = ['body','update','created']


class CompanySerializer(serializers.ModelSerializer):
    boss_id = UserIdAndEmailSerializer(many=False, read_only=True)
    class Meta: 
        model = models.Company
        fields = '__all__'

class CompanyImagesSerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.CompanyImages
        fields = '__all__'

class CompanyEmployeeSerializer(serializers.ModelSerializer):
    user_id = UserIdAndEmailSerializer(many=False, read_only=True)
    company_id = CompanySerializer(many=False, read_only=True)
    companyEmployeePosition_id = CompanyEmployeePositionPermissionSerializer(many=False, read_only=True)
    class Meta: 
        model = models.CompanyEmployee
        fields = '__all__'


class CompanyEmployeeSerializerIdAndUserId(serializers.ModelSerializer):
    user_id = UserIdAndEmailSerializer(many=False, read_only=True)
    class Meta: 
        model = models.CompanyEmployee
        fields = ['id', 'user_id']

class CompanyDepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CompanyDepartment
        fields = '__all__'

class PermissionSerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.Permission
        fields = '__all__'

class UserPermissionSerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.CompanyPermission
        fields = '__all__'

class CheckInSerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.CompanyCheckIn
        fields = '__all__'

class CompanyCheckInRuleSerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.companyCheckInRule
        fields = '__all__'

class CompanyAnnouncementGroupSerializer(serializers.ModelSerializer):
    companyEmployee_id = CompanyEmployeeSerializerIdAndUserId(many=True, read_only=True)
    class Meta: 
        model = models.CompanyAnnouncementGroup
        fields = '__all__'

class CompanyAnnouncementSerializer(serializers.ModelSerializer):
    group = CompanyAnnouncementGroupSerializer(many=True, read_only=True)
    companyEmployee_id = CompanyEmployeeSerializerIdAndUserId(many=False, read_only=True)
    class Meta: 
        model = models.CompanyAnnouncement
        fields = '__all__'

class UserResumeSerializer(serializers.ModelSerializer):
    experience = WorkingExperienceSerializer(many=False, read_only=True)
    education = EducationSerializer(many=False, read_only=True)
    class Meta: 
        model = models.UserResume
        fields = '__all__'

class UserOfferRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserOfferRecord
        fields = '__all__'


class UserApplicationRecordSerializer(serializers.ModelSerializer):
    user = UserIdAndEmailSerializer(many=False, read_only=True)
    class Meta: 
        model = models.UserApplicationRecord
        fields = '__all__'


class CompanyPermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CompanyPermission
        fields = '__all__'

class CompanyBenefitsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CompanyBenefits
        fields = '__all__'

class CompanyEmployeePositionSerializer(serializers.ModelSerializer):
    company_id = CompanySerializer(many=False, read_only=True)
    companyDepartment_id = CompanyDepartmentSerializer(many=False, read_only=True)
    companyPermission_id = CompanyPermissionSerializer(many=True, read_only=True)
    companyBenefits_id = CompanyBenefitsSerializer(many=True, read_only=True)
    class Meta:
        model = models.CompanyEmployeePosition
        fields = '__all__'

class CompanyTrainingSerializer(serializers.ModelSerializer):
    trainer = CompanyEmployeeSerializerIdAndUserId(many=False, read_only=True)
    class Meta: 
        model = models.CompanyTraining
        fields = '__all__'

class CompanyEmployeeTrainingSerializer(serializers.ModelSerializer):
    companyEmployee_id = CompanyEmployeeSerializerIdAndUserId(many=False, read_only=True)
    companyTraining_id = CompanyTrainingSerializer(many=False, read_only=False)
    class Meta: 
        model = models.CompanyEmployeeTraining


class CompanyCheckInSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CompanyCheckIn
        fields = '__all__'

class CompanyCheckInRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.companyCheckInRule
        fields = '__all__'

class CompanyPromotionRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CompanyPromotionRecord
        fields = '__all__'
class CompanyEmployeeTrainingSerializer(serializers.ModelSerializer):
    companyEmployee_id = CompanyEmployeeSerializerIdAndUserId(many=False, read_only=True)
    companyTraining_id = CompanyTrainingSerializer(many=False, read_only=False)
    class Meta: 
        model = models.CompanyEmployeeTraining
        fields = '__all__'

class CompanyEmployeePerformanceReviewSerializer(serializers.ModelSerializer):
    companyEmployee_id = CompanyEmployeeSerializerIdAndUserId(many=False, read_only=True)
    class Meta: 
        model = models.CompanyEmployeePerformanceReview
        fields = '__all__'

class CompanyEmployeeFeedBackReviewSerializer(serializers.ModelSerializer):
    companyEmployee_id = CompanyEmployeeSerializerIdAndUserId(many=False, read_only=True)
    feedback_to = CompanyEmployeeSerializerIdAndUserId(many=False, read_only=True)
    class Meta: 
        model = models.CompanyEmployeeFeedBackReview
        fields = '__all__'

class CompanyRecruitmentSerializer(serializers.ModelSerializer):
    companyEmployeePosition = CompanyEmployeePositionSerializer(many=False, read_only=True)
    class Meta: 
        model = models.CompanyRecruitment
        fields = '__all__'

class CompanyCheckInRuleSerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.companyCheckInRule
        fields = '__all__'

class CompanyEmployeeEvaluateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CompanyEmployeeEvaluate
        fields = '__all__'

class CompanyEmployeeLeaveRecordSerializer(serializers.ModelSerializer):
    companyEmployee_id = CompanyEmployeeSerializer(many=False, read_only=True)
    class Meta:
        model = models.CompanyEmployeeLeaveRecord
        fields = '__all__'

class UserApplicationRecordSerializerTest(serializers.ModelSerializer):
    userofferrecord = serializers.SerializerMethodField()
    companyRecruitment_id = CompanyRecruitmentSerializer(many=False, read_only=True)
    userResume_id = UserResumeSerializer(many=False, read_only=True)

    def get_userofferrecord(self, obj):
        if obj.userofferrecord_set.exists():
            userofferrecords = UserOfferRecordSerializer(obj.userofferrecord_set.all(), many=True).data
            return userofferrecords
        else:
            return None

    class Meta:
        model = models.UserApplicationRecord
        fields = '__all__'


# class CompanyDepartmentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.CompanyDepartment
#         fields = ['id']

# class CompanyPermissionNameAndDescSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = models.CompanyPermission
#         fields = ['id', 'permission_name', 'permission_desc']

class CompanyEmployeePositionPermissionIdOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.CompanyEmployeePosition
        fields = '__all__'

class CompanyEmployeeIdOnlySerializer(serializers.ModelSerializer):
    user_id = UserIdAndEmailSerializer(many=False, read_only=True)
    companyEmployeePosition_id = CompanyEmployeePositionPermissionIdOnlySerializer(many=False, read_only=True)
    class Meta: 
        model = models.CompanyEmployee
        fields = '__all__'
    
class GradientDataSerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.GradientData
        fields = '__all__'
    
class RecommendOptionsSerializer(serializers.ModelSerializer):
    class Meta: 
        model = models.RecommendOptions
        fields = '__all__'

class TaskForceSerializer(serializers.ModelSerializer):
    leader = CompanyEmployeeSerializer(many=False)  # Assuming only one leader per task force

    class Meta:
        model = models.TaskForce
        fields = '__all__'

class TaskForceSerializer2(serializers.ModelSerializer):
    class Meta:
        model = models.TaskForce
        fields = '__all__'

class TaskSerializer(serializers.ModelSerializer):
    task_force = TaskForceSerializer(many=False, read_only=True)
    class Meta: 
        model = models.Task
        fields = '__all__'
