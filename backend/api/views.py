from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
import jwt
from rest_framework import status
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from .serializers import UserSerializer, MyTokenObtainPairSerializer
from .models import CustomOutstandingToken, CustomTokenUser , UserAccount
from . import models
from . import serializers
from django.db.models import Q
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
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def getCompany(request, pk):
    companyData = models.Company.objects.get(id=pk)
    serializer = serializers.CompanySerializer(companyData, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateCompany(request, pk):
    updatedCompany = request.data
    originalCompany = models.Company.objects.get(id=pk)
    serializer = serializers.CompanySerializer(instance=originalCompany, data=updatedCompany)
    if(serializer.is_valid()):
        serializer.save()
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

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateCompanyEmployee(request, pk):
    updatedCompanyEmployee = request.data
    originalCompanyEmployee = models.CompanyEmployee.objects.get(id=pk)
    serializer = serializers.CompanyEmployeeSerializer(instance=originalCompanyEmployee, data=updatedCompanyEmployee)
    if(serializer.is_valid()):
        serializer.save()
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteCompanyEmployee(request, pk):
    deletedCompanyEmployee = models.CompanyEmployee.objects.get(id=pk)
    delete = deletedCompanyEmployee.delete()
    return Response(delete)

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