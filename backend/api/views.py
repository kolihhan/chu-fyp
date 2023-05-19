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
from .models import UserAccount, CompanyEmployee, UserResume, UserPermission , Company
from . import models
from . import serializers
from django.db.models import Q
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createCompany(request):
    companyData = request.data
    createdCompany = models.Company.objects.create(
        name = companyData['name'],
        email = companyData['email'],
        phone = companyData['phone'],
        address = companyData['address'],
        company_desc = companyData['company_desc'],
        company_benefits = companyData['company_benefits'],
        boss_id = models.UserAccount.objects.get(id=companyData['boss_id']),
        admin_id = models.UserAccount.objects.get(id=companyData['admin_id'])
    )
    serializer = serializers.CompanySerializer(createdCompany, many=False)

    if(createdCompany.id):  # company create success
        print("company create success")
        # if(companyData['boss_id']!=companyData['admin_id']):
        #     admin = models.UserAccount.objects.get(id=companyData['boss_id'])
        #     addedAdmin = models.CompanyEmployee.objects.create(
        #         role = "admin", position = "manager", salary = 0, company_id = createdCompany, user_id = admin
        #     )
        #     if(addedAdmin.id):
        #         print("admin added")

        # boss = models.UserAccount.objects.get(id=companyData['boss_id'])
        # addedBoss = models.CompanyEmployee.objects.create(
        #     role = "boss", position = "boss", salary = 0, company_id = createdCompany, user_id = boss
        # )
        # if(addedBoss.id):
        #     print("boss added")

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def getCompany(request, pk):
    companyData = models.Company.objects.get(id=pk)
    serializer = serializers.CompanySerializer(companyData, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def getBossCompany(request, pk):
    companyData = models.Company.objects.filter(boss_id=pk)
    serializer = serializers.CompanySerializer(companyData, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([AllowAny])
def updateCompanyAdmin(request):
    companyId = request.data['id']
    adminId = request.data['admin_id']
    companyData = models.Company.objects.get(id=companyId)
    companyData.admin_id = models.UserAccount.objects.get(id=adminId)
    companyData.save()
    serializer = serializers.CompanySerializer(companyData)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def getBossCompanyAdmin(request, pk):
    companyData = models.Company.objects.filter(Q(boss_id=pk)).exclude(Q(admin_id=pk))
    serializer = serializers.CompanySerializer(companyData, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def getBossCompanyEmployee(request, pk):
    companyData = models.CompanyEmployee.objects.filter(Q(company_id__boss_id=pk)).exclude(Q(role='admin') | Q(role='boss'))
    serializer = serializers.CompanyEmployeeSerializer(companyData, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def getCompanyAdmin(request, pk):
    companyData = models.Company.objects.get(id=pk)
    serializer = serializers.CompanySerializer(companyData, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateCompany(request, pk):
    updatedCompany = request.data
    originalCompany = models.Company.objects.get(id=pk)
    originalCompany.boss_id = models.UserAccount.objects.get(id=updatedCompany['boss_id'])
    originalCompany.admin_id = models.UserAccount.objects.get(id=updatedCompany['admin_id'])
    originalCompany.name = updatedCompany.get('name', originalCompany.name)
    originalCompany.email = updatedCompany.get('email', originalCompany.email)
    originalCompany.phone = updatedCompany.get('phone', originalCompany.phone)
    originalCompany.address = updatedCompany.get('address', originalCompany.address)
    originalCompany.company_desc = updatedCompany.get('company_desc', originalCompany.company_desc)
    originalCompany.company_benefits = updatedCompany.get('company_benefits', originalCompany.company_benefits)
    originalCompany.save()
    serializer = serializers.CompanySerializer(originalCompany)
    # if(serializer.is_valid()):
    #     serializer.save()
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteCompany(request, pk):
    deletedCompany = models.Company.objects.get(id=pk)
    deleted = deletedCompany.delete()
    return Response(deleted)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addCompanyEmployee(request):
    data = request.data
    employee = models.UserAccount.objects.get(id=data['user_id'])
    company = models.Company.objects.get(id=data['company_id'])
    addedEmployee = models.CompanyEmployee.objects.create(
        role = data['role'],
        position = data['position'],
        salary = data['salary'],
        company_id = company,
        user_id = employee
    )
    serializer = serializers.CompanyEmployeeSerializer(addedEmployee, many=False)
    return Response(serializer.data)

@api_view(['get'])
@permission_classes([AllowAny])
def getCompanyEmployee(request, pk):
    companyEmployee = models.CompanyEmployee.objects.filter(company_id=pk)
    serializer = serializers.CompanyEmployeeSerializer(companyEmployee, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def getEmployee(request, pk):
    companyEmployee = models.CompanyEmployee.objects.get(id=pk)
    serializer = serializers.CompanyEmployeeSerializer(companyEmployee, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateCompanyEmployee(request):
    updatedCompanyEmployee = request.data
    userId = request.data['user_id']
    companyId = request.data['company_id']
    originalCompanyEmployee = models.CompanyEmployee.objects.filter(Q(user_id__id=userId) & Q(company_id__id=companyId)).first()
    if(originalCompanyEmployee):
        print(originalCompanyEmployee)
        serializer = serializers.CompanyEmployeeSerializer(instance=originalCompanyEmployee, data=updatedCompanyEmployee)
        if(serializer.is_valid()):
            serializer.save()
        return Response(serializer.data)
    else:
        return Response({'message': 'CompanyEmployee does not exist'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteCompanyEmployee(request):
    userId = request.data['user_id']
    companyId = request.data['company_id']
    deletedCompanyEmployee = models.CompanyEmployee.objects.filter(Q(user_id__id = userId) & Q(company_id__id=companyId)).first()
    if(deletedCompanyEmployee):
        delete = deletedCompanyEmployee.delete()
        return Response(delete)
    else: 
        return Response({'message': 'Company Employee does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def postAnnouncement(request):
    companyId = request.data['company_id']
    userId = request.data['user_id']

    groupIds = request.data['group']
    groups = []
    for groupId in groupIds:
        group = models.AnnouncementGroup.objects.get(id=groupId)
        groups.append(group)
    postedAnnouncement = models.Announcement.objects.create(
        company_id = models.Company.objects.get(id=companyId),
        user_id = models.UserAccount.objects.get(id=userId),
        title = request.data['title'],
        content = request.data['content'],
        expire_at = request.data.get('expire_at', None)
    )
    postedAnnouncement.group.set(groups)
    serializer = serializers.AnnouncementSerializer(postedAnnouncement, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def getAnnouncements(request):
    announcementData = models.Announcement.objects.all()
    serializer = serializers.AnnouncementSerializer(announcementData, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserAnnouncements(request, companyId, userId):
    announcementData = models.Announcement.objects.filter(Q(company_id=companyId) & (Q(group__isnull=True) | Q(group__user_id__id=userId)))
    serializer = serializers.AnnouncementSerializer(announcementData, many=True)
    return Response(serializer.data)
    '''
    get announcement by group user id
        group is ManyToManyField to table AnnouncementGroup, 
        user_id is manyToManyField to table UserAccount,
        id is field from table UserAccount
        seperate double underscore
    ManyToManyFieldInAnnouncementTABLE__ManyToManyFieldInAnnouncementGroupTABLE__fieldInUserAccountTABLE
    announcementData = models.Announcement.objects.filter(group__user_id__id=2)
    '''

@api_view(['GET'])
@permission_classes([AllowAny])
def getAnnouncement(request, pk):
    announcementData = models.Announcement.objects.get(id=pk)
    serializer = serializers.AnnouncementSerializer(announcementData, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateAnnouncement(request, pk):
    updatedAnnouncement = request.data
    originalAnnouncement = models.Announcement.objects.get(id=pk)
    originalAnnouncement.title = updatedAnnouncement.get('title', originalAnnouncement.title)
    originalAnnouncement.content = updatedAnnouncement.get('content', originalAnnouncement.content)
    originalAnnouncement.expire_at = updatedAnnouncement.get('expire_at', originalAnnouncement.expire_at)
    groups = []
    for group in updatedAnnouncement['group']:
        groups.append(models.AnnouncementGroup.objects.get(id=group))
    originalAnnouncement.group.set(groups)
    originalAnnouncement.save()
    
    serializer = serializers.AnnouncementSerializer(originalAnnouncement)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getIdFromToken(request):
    # get token from header
    token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]  
    accessToken = AccessToken(token)
    userId = accessToken.payload['user_id']
    return Response(userId)

@api_view(['GET'])
@permission_classes([AllowAny])
def getAllCompany(request):
    companyData = models.Company.objects.all()
    serializer = serializers.CompanySerializer(companyData, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def getAllAnnouncements(request):
    announcementData = models.Announcement.objects.all()
    serializer = serializers.AnnouncementSerializer(announcementData, many=True)
    return Response(serializer.data)

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
        user_account = CompanyEmployee.objects.get(user_id=pk)
        user_account.delete()
        return Response({"detail": "員工成功移除。"}, status=status.HTTP_204_NO_CONTENT)
    except CompanyEmployee.DoesNotExist:
        return Response({"detail": "員工未發現。"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logging.exception("An error occurred: %s", e)
        return Response({"detail": "移除員工時，發生錯誤。"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserResumeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = UserResumeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user_resume_instance = serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request, pk, format=None):
        user_resume_instance = UserResume.objects.get(pk=pk, user=request.user)
        serializer = UserResumeSerializer(user_resume_instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk, format=None):
        user_resume_instance = UserResume.objects.get(pk=pk, user=request.user)
        user_resume_instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_position(request):
    user_id = request.data.get('user_id')
    position = request.data.get('position')

    company_employee = get_object_or_404(CompanyEmployee, user_id=user_id)
    company_employee.position = position
    company_employee.save()

    return Response({'message': 'Position assigned successfully.'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def replace_admin(request):
    
    admin_id = request.data.get('admin_id')

    company = get_object_or_404(Company, id=1)  # Assuming there's only one company instance
    company.admin_id = admin_id
    company.save()

    return Response({'message': 'Administrator has been replaced.'})

@api_view(['POST'])
def change_permissions(request):
    admin_id = request.data.get('admin_id')
    permissions = request.data.get('permissions')

    admin_user_permission = get_object_or_404(UserPermission, user_id=admin_id)
    admin_user_permission.permission_id.set(permissions)
    admin_user_permission.save()

    return Response({'message': 'Permissions changed successfully.'})