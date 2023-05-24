from django.shortcuts import render,get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
import jwt
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from .serializers import UserSerializer, UserResumeSerializer
from .customToken import MyTokenObtainPairSerializer
from .models import UserAccount, UserResume, CompanyPermission , Company
from . import models
from . import serializers
from django.db.models import Q
from django.db import transaction
import logging

# from django.http import JsonResponse


#JSONResponse
#如果 many=True 参数告诉Serializers，employee 字段中可能有多个員工，需要对它们进行序列化。
#如果 many=False，则说明 object 字段只包含一个Query，而不是多个Query。
# @api_view(['GET'])
# def getAllEmployee(request):

#     param = request.GET.get('id') #Fetching request params
#     employee = Employee.objects.all()  #Get all object from Employee
#     employee = Employee.objects.get(id = id)  #Get single id from Employee
#     serializer = EmployeeSerializer(employee,many=True) #Many 如果有多個資料就是True

#     return Response(serializer.data) #Serializer 是一個Object,需要呼叫.data拿到資料

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response("賬號建立成功", status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MyTokenObtainPairView(TokenObtainPairView):
    http_method_names = ['post']
    permission_classes = [AllowAny]
    serializer_class = MyTokenObtainPairSerializer


# region company
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createCompany(request):
    try:
        with transaction.atomic():
            companyData = request.data
            createdCompany = models.Company.objects.create(
                name = companyData['name'],
                email = companyData['email'],
                phone = companyData['phone'],
                address = companyData['address'],
                company_desc = companyData['company_desc'],
                company_benefits = companyData['company_benefits'],
                boss_id = models.UserAccount.objects.get(id=companyData['boss_id']),
            )
            serializer = serializers.CompanySerializer(createdCompany, many=False)
        
            createdDepartment = models.CompanyDepartment.objects.create(
                company_id = createdCompany,
                department = "Main Department"
            )

            createdPermission = models.CompanyPermission.objects.create(
                company_id = createdCompany,
                permission_name = "Permission_All",
                permission_desc = "Permission that allow to control every thing"
            )

            createdBenefit = models.CompanyBenefits.objects.create(
                company_id = createdCompany,
                name = "No benefit"
            )
            
            createdCompanyEmployeePosition = models.CompanyEmployeePosition.objects.create(
                company_id = createdCompany,
                position_name = "Boss",
                companyDepartment_id = createdDepartment,
            )
            createdCompanyEmployeePosition.companyPermission_id.set([createdPermission])
            createdCompanyEmployeePosition.companyBenefits_id.set([createdBenefit])
        
            createdEmployee = models.CompanyEmployee.objects.create(
                company_id = createdCompany,
                user_id = createdCompany.boss_id,
                companyEmployeePosition_id = createdCompanyEmployeePosition,
                salary = 0
            )
        
        return Response({'message':'公司創建成功', 'data':serializer.data})
    except:
        transaction.rollback()
        return Response({'message':'公司創建失敗，請稍後再嘗試'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCompany(request, pk):
    companyData = models.Company.objects.get(id=pk)
    serializer = serializers.CompanySerializer(companyData, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateCompany(request, pk):
    updatedCompany = request.data
    try:
        originalCompany = models.Company.objects.get(id=pk)
        originalCompany.boss_id = models.UserAccount.objects.get(id=updatedCompany.get('boss_id', originalCompany.boss_id.id))
        originalCompany.name = updatedCompany.get('name', originalCompany.name)
        originalCompany.email = updatedCompany.get('email', originalCompany.email)
        originalCompany.phone = updatedCompany.get('phone', originalCompany.phone)
        originalCompany.address = updatedCompany.get('address', originalCompany.address)
        originalCompany.company_desc = updatedCompany.get('company_desc', originalCompany.company_desc)
        originalCompany.company_benefits = updatedCompany.get('company_benefits', originalCompany.company_benefits)
        originalCompany.save()
        serializer = serializers.CompanySerializer(originalCompany)
        return Response({'message':'公司修改成功', 'data':serializer.data})
    except models.Company.DoesNotExist:
        return Response({'message':'公司修改失敗，請稍後在嘗試'})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteCompany(request, pk):
    try:
        deletedCompany = models.Company.objects.get(id=pk)
        deleted = deletedCompany.delete()
        if(deleted[0] > 0): return Response({'message':'公司刪除成功'})
        else: return Response({'message':'公司刪除失敗，請稍後再嘗試'})
    except models.Company.DoesNotExist:
        return Response({"message":"公司不存在"}, status=status.HTTP_404_NOT_FOUND)
# endregion

# region boss manage company
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getBossAllCompany(request, pk):
    companyData = models.Company.objects.filter(boss_id=pk)
    serializer = serializers.CompanySerializer(companyData, many=True)
    return Response(serializer.data)
# endregion

# cannot use post and put on CompanyEmployee
# region CompanyEmployee
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createCmpEmp(request):
    employeeData = request.data
    createdCompanyEmployee  = models.CompanyEmployee.objects.create(
        company_id = models.Company.objects.get(id=employeeData["company_id"]),
        user_id = models.UserAccount.objects.get(id=employeeData['user_id']),
        companyEmployeePosition_id = models.CompanyEmployeePosition.objects.get(id=employeeData['companyEmployeePosition_id']),
        salary = employeeData['salary'],
    )
    serializer = serializers.CompanyEmployeeSerializer(createdCompanyEmployee, many=False)
    if(createdCompanyEmployee.id):
        return Response({"message":"員工增加成功", "data":serializer.data})
    else: return Response({"message":"員工增加失敗"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCompanyEmployee(request, pk):
    companyEmployee = models.CompanyEmployee.objects.get(id=pk)
    serializer = serializers.CompanyEmployeeSerializer(companyEmployee, many=False)
    return Response(serializer.data)

# endregion

# region CompanyPermission
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createCompanyPermission(request):
    companyPermissionData = request.data
    createdCompanyPermission = models.CompanyPermission.objects.create(
        company_id = models.Company.objects.get(id=companyPermissionData['company_id']),
        permission_name = companyPermissionData['permission_name'],
        permission_desc = companyPermissionData['permission_desc'],
    )
    serializer = serializers.CompanyPermissionSerializer(createdCompanyPermission, many=False)
    return Response({'message':'權限增加成功', 'data':serializer.data})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCompanyPermission(request, pk):
    companyPermission = models.CompanyPermission.objects.get(id=pk)
    serializer = serializers.CompanyPermissionSerializer(companyPermission, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateCompanyPermission(request, pk):
    updatedCompanyPermission = request.data
    originalCompanyPermission = models.CompanyPermission.objects.get(id=pk)
    originalCompanyPermission.company_id = updatedCompanyPermission.get('company_id', originalCompanyPermission.company_id)
    originalCompanyPermission.permission_name = updatedCompanyPermission.get('permission_name', originalCompanyPermission.permission_name)
    originalCompanyPermission.permission_desc = updatedCompanyPermission.get('permission_desc', originalCompanyPermission.permission_desc)
    originalCompanyPermission.save()
    serializer = serializers.CompanyPermissionSerializer(originalCompanyPermission, many=False)
    return Response({'message':'權限修改成功', 'data':serializer.data})
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteCompanyPermission(request, pk):
    try:
        deletedCompanyPermission = models.CompanyPermission.objects.get(id=pk)
        delete = deletedCompanyPermission.delete()
        if(delete[0]>0): return Response({"message":"權限已刪除"})
        else: return Response({'message':'權限刪除失敗，請稍後在嘗試'})
    except CompanyPermission.DoesNotExist:
        return Response({'message':'權限不存在'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
# get company's all company permission
def getCompanyAllCompanyPermission(request, pk):
    companyPermission = models.CompanyPermission.objects.filter(company_id__id = pk)
    serializer = serializers.CompanyPermissionSerializer(companyPermission, many=True)
    return Response(serializer.data)

# endregion

# region Announcement
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def postAnnouncement(request):
    companyId = request.data['company_id']
    companyEmployeeId = request.data['companyEmployee_id']

    groupIds = request.data['group']
    groups = []
    for groupId in groupIds:
        group = models.CompanyAnnouncementGroup.objects.get(id=groupId)
        groups.append(group)

    postedAnnouncement = models.CompanyAnnouncement.objects.create(
        company_id = models.Company.objects.get(id=companyId),
        companyEmployee_id = models.CompanyEmployee.objects.get(id=companyEmployeeId),
        title = request.data['title'],
        content = request.data['content'],
        expire_at = request.data.get('expire_at', None)
    )
    postedAnnouncement.group.set(groups)
    serializer = serializers.CompanyAnnouncementSerializer(postedAnnouncement, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def getAnnouncement(request, pk):
    try:
        announcementData = models.CompanyAnnouncement.objects.get(id=pk)
        serializer = serializers.CompanyAnnouncementSerializer(announcementData, many=False)
        return Response(serializer.data)
    except models.CompanyAnnouncement.DoesNotExist:
        return Response({'message':'公告不存在'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateAnnouncement(request, pk):
    updatedAnnouncement = request.data
    try:
        originalAnnouncement = models.CompanyAnnouncement.objects.get(id=pk)
        originalAnnouncement.title = updatedAnnouncement.get('title', originalAnnouncement.title)
        originalAnnouncement.content = updatedAnnouncement.get('content', originalAnnouncement.content)
        originalAnnouncement.expire_at = updatedAnnouncement.get('expire_at', originalAnnouncement.expire_at)

        groups = []
        if(updatedAnnouncement.get('group', None) != None):
            for group in updatedAnnouncement['group']:
                groups.append(models.CompanyAnnouncementGroup.objects.get(id=group))
            originalAnnouncement.group.set(groups)

        originalAnnouncement.save()
        
        serializer = serializers.CompanyAnnouncementSerializer(originalAnnouncement)
        return Response(serializer.data)
    except models.CompanyAnnouncement.DoesNotExist:
        return Response({'message':'公告不存在'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteAnnouncement(request, pk):
    try:
        deletedAnnouncement = models.CompanyAnnouncement.objects.get(id=pk)
        delete = deletedAnnouncement.delete()
        if(delete[0]>0): Response({'message':'公告已刪除'}, status=status.HTTP_200_OK)
        else: Response({'message':'公告刪除失敗，請稍後再嘗試'})
    except models.CompanyAnnouncement.DoesNotExist:
        return Response({'message':'公告不存在'}, status=status.HTTP_404_NOT_FOUND)


# @api_view(['GET'])
# @permission_classes([AllowAny])
# def getAnnouncements(request):
#     announcementData = models.CompanyAnnouncement.objects.all()
#     serializer = serializers.CompanyAnnouncementSerializer(announcementData, many=True)
#     return Response(serializer.data)

# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def getUserAnnouncements(request, companyId, userId):
#     announcementData = models.CompanyAnnouncement.objects.filter(Q(company_id=companyId) & (Q(group__isnull=True) | Q(group__user_id__id=userId)))
#     serializer = serializers.CompanyAnnouncementSerializer(announcementData, many=True)
#     return Response(serializer.data)
#     '''
#     get announcement by group user id
#         group is ManyToManyField to table AnnouncementGroup, 
#         user_id is manyToManyField to table UserAccount,
#         id is field from table UserAccount
#         seperate double underscore
#     ManyToManyFieldInAnnouncementTABLE__ManyToManyFieldInAnnouncementGroupTABLE__fieldInUserAccountTABLE
#     announcementData = models.Announcement.objects.filter(group__user_id__id=2)
#     '''

# endregion

# region 
# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def getIdFromToken(request):
#     # get token from header
#     token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]  
#     accessToken = AccessToken(token)
#     userId = accessToken.payload['user_id']
#     return Response(userId)



# endregion

# region by lihhan
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_account(request,pk):
    
    try:
        user_account = UserAccount.objects.get(id=pk)
    except UserAccount.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user_account, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





@api_view(['POST'])
@permission_classes([IsAuthenticated])
def company_remove_employee(request, pk):
    try:
        user_account = models.CompanyEmployee.objects.get(user_id=pk)
        user_account.delete()
        return Response({"detail": "員工成功移除。"}, status=status.HTTP_204_NO_CONTENT)
    except models.CompanyEmployee.DoesNotExist:
        return Response({"detail": "員工未發現。"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logging.exception("An error occurred: %s", e)
        return Response({"detail": "移除員工時，發生錯誤。"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserResumeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        resumeData = models.UserResume.objects.get(id=pk)
        serializer = serializers.UserResumeSerializer(resumeData, many=False)
        return Response(serializer.data)

    def post(self, request, format=None):
        resumeUser = models.UserAccount.objects.get(id=request.data['user'])
        serializer = UserResumeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_resume_instance = serializer.save(user=resumeUser)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, pk, format=None):
        resumeUser = models.UserAccount.objects.get(id=request.data['user'])
        user_resume_instance = UserResume.objects.get(pk=pk, user=resumeUser)
        serializer = UserResumeSerializer(user_resume_instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk, format=None):
        resumeUser = models.UserAccount.objects.get(id=request.data['user'])
        user_resume_instance = UserResume.objects.get(pk=pk, user=resumeUser)
        user_resume_instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_position(request):
    user_id = request.data.get('user_id')
    position = request.data.get('position')

    company_employee = get_object_or_404(models.CompanyEmployee, user_id=user_id)
    company_employee.position = position
    company_employee.save()

    return Response({'message': 'Position assigned successfully.'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def replace_admin(request):
    
    # admin_id = request.data.get('admin_id')

    # company = get_object_or_404(Company, id=1)  # Assuming there's only one company instance
    # company.admin_id = admin_id
    # company.save()

    # return Response({'message': 'Administrator has been replaced.'})
    pass

@api_view(['POST'])
def change_permissions(request):
    # admin_id = request.data.get('admin_id')
    # permissions = request.data.get('permissions')

    # admin_user_permission = get_object_or_404(models.UserPermission, user_id=admin_id)
    # admin_user_permission.permission_id.set(permissions)
    # admin_user_permission.save()

    # return Response({'message': 'Permissions changed successfully.'})
    pass

# endregion

