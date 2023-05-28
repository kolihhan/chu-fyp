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
from .serializers import UserSerializer, UserResumeSerializer, UserApplicationRecordSerializer
from .customToken import MyTokenObtainPairSerializer
from .models import UserAccount, UserResume, CompanyPermission , Company, UserApplicationRecord
from rest_framework.exceptions import NotFound, ValidationError
from . import models
from . import serializers
from django.db.models import Q
from django.db import transaction
from django.utils import timezone
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


# class

# region user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMultipleUserByEmail(request, pk):
    userList = models.UserAccount.objects.filter(email__contains=pk)
    serializer = serializers.UserIdAndEmailSerializer(userList, many=True)
    return Response(serializer.data)
# endregion

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

            createdCompanyEmployeePosition2 = models.CompanyEmployeePosition.objects.create(
                company_id = createdCompany,
                position_name = "Employee",
                companyDepartment_id = createdDepartment,
            )
        
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

# region resume 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createResume(request):
    try:
        resumeData = request.data
        createdResume = models.UserResume.objects.create(
            user = models.UserAccount.objects.get(id=resumeData['user']),
            summary = resumeData['summary'],
            experience = resumeData['experience'],
            education = resumeData['education'],
            skills = resumeData['skills'],
            prefer_work = resumeData['prefer_work'],
            language = resumeData['language']
        )
        serializer = serializers.UserResumeSerializer(createdResume, many=False)
        if createdResume.id:
            return Response({'message':'履歷建立成功', 'data':serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'message':'履歷建立失敗 , 請稍後再嘗試'})
    except Exception as e:
        return Response({'message':'履歷建立失敗 , 請稍後再嘗試'})
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getResume(request, pk):
    try:
        resume = models.UserResume.objects.get(id=pk)
        serializer = serializers.UserResumeSerializer(resume, many=False)
        return Response({'messagge':'', 'data':serializer.data})
    except models.UserResume.DoesNotExist:
        return Response({'message':'履歷不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'履歷取得失敗，請稍後再嘗試'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserAllResume(request, pk):
    try:
        resume = models.UserResume.objects.filter(user__id=pk)
        serializer = serializers.UserResumeSerializer(resume, many=True)
        return Response({'messagge':'', 'data':serializer.data})
    except models.UserResume.DoesNotExist:
        return Response({'message':'履歷不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'履歷取得失敗，請稍後再嘗試'})

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateResume(request, pk):
    try:
        updatedResume = request.data
        originalResume = models.UserResume.objects.get(id=pk)
        originalResume.summary = updatedResume.get('summary', originalResume.summary)
        originalResume.experience = updatedResume.get('experience', originalResume.experience)
        originalResume.education = updatedResume.get('education', originalResume.education)
        originalResume.skills = updatedResume.get('skills', originalResume.skills)
        originalResume.prefer_work = updatedResume.get('prefer_work', originalResume.prefer_work)
        originalResume.language = updatedResume.get('language', originalResume.language)
        originalResume.save()
        serializer = serializers.UserResumeSerializer(originalResume, many=False)
        return Response({'messagge':'', 'data':serializer.data}, status=status.HTTP_200_OK)
    except models.UserResume.DoesNotExist:
        return Response({'message':'履歷不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'履歷更新失敗，請稍後再嘗試'})
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteResume(request, pk):
    try:
        deletedResume = models.UserResume.objects.get(id=pk)
        delete = deletedResume.delete()
        if delete[0] > 0: 
            return Response({'message':'履歷刪除成功'}, status=status.HTTP_200_OK)
        else:
            return Response({'message':'刪除失敗，請稍後再嘗試'})
    except models.UserResume.DoesNotExist:
        return Response({'message':'履歷不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'刪除失敗，請稍後再嘗試'})
    
# endregion

# region CompanyEmployee
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createCompanyEmployee(request):
    try:
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
    except (models.Company.DoesNotExist, models.UserAccount.DoesNotExist, models.CompanyEmployeePosition.DoesNotExist):
        return Response({"message": "公司、使用者帳號或員工職位不存在"})
    except Exception as e:
        return Response({"message": "員工增加失敗", "error": str(e)})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createMultipleCompanyEmployee(request):
    try:
        with transaction.atomic():
            createdCompanyEmployees = []
            employeeData = request.data
            for userID in employeeData['user_id']:
                createdCompanyEmployee  = models.CompanyEmployee.objects.create(
                    company_id = models.Company.objects.get(id=employeeData["company_id"]),
                    user_id = models.UserAccount.objects.get(id=userID),
                    companyEmployeePosition_id = models.CompanyEmployeePosition.objects.get(id=employeeData['companyEmployeePosition_id']),
                    salary = employeeData['salary'],
                )
                serializer = serializers.CompanyEmployeeSerializer(createdCompanyEmployee, many=False)
                createdCompanyEmployees.append(serializer.data)
            return Response({"message":"員工增加成功", "data":createdCompanyEmployees})
    except (models.Company.DoesNotExist, models.UserAccount.DoesNotExist, models.CompanyEmployeePosition.DoesNotExist):
        return Response({"message": "公司、使用者帳號或員工職位不存在"})
    except Exception as e:
        return Response({"message": "員工增加失敗", "error": str(e)})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCompanyEmployee(request, pk):
    # pass in companyEmployee id
    companyEmployee = models.CompanyEmployee.objects.get(id=pk)
    serializer = serializers.CompanyEmployeeSerializer(companyEmployee, many=False)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCompanyAllEmployee(request, pk):
    # pass in company id
    companyEmployee = models.CompanyEmployee.objects.filter(company_id=pk)
    serializer = serializers.CompanyEmployeeSerializer(companyEmployee, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateCompanyEmployee(request, pk):
    try:
        updatedCompanyEmployee = request.data
        newCompanyEmployeePosition_id = updatedCompanyEmployee.get('companyEmployeePosition_id', None)
        originalCompanyEmployee = models.CompanyEmployee.objects.get(id=pk)
        if(newCompanyEmployeePosition_id==None): newCompanyEmployeePosition_id = originalCompanyEmployee.companyEmployeePosition_id
        else: newCompanyEmployeePosition_id = models.CompanyEmployeePosition.objects.get(id=newCompanyEmployeePosition_id)
        
        originalCompanyEmployee.companyEmployeePosition_id  = newCompanyEmployeePosition_id
        originalCompanyEmployee.salary = updatedCompanyEmployee.get('salary', originalCompanyEmployee.salary)
        originalCompanyEmployee.save()
        serializer = serializers.CompanyEmployeeSerializer(originalCompanyEmployee, many=False)

        return Response({"message":"員工資料更新成功", 'data':serializer.data},status=status.HTTP_200_OK)
    except models.CompanyEmployee.DoesNotExist:
        return Response({'message':'員工不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"message":"員工資料更新失敗，請稍後再嘗試"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def fireEmployee(request, pk):
    try:
        originalCompanyEmployee = models.CompanyEmployee.objects.get(id=pk)
        originalCompanyEmployee.end_date = timezone.now()
        originalCompanyEmployee.save()
        serializer = serializers.CompanyEmployeeSerializer(originalCompanyEmployee, many=False)
        return Response({"message":"員工資料更新成功", 'data':serializer.data},status=status.HTTP_200_OK)
    except models.CompanyEmployee.DoesNotExist:
        return Response({'message':'員工不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"message":"員工資料更新失敗，請稍後再嘗試"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteCompanyEmployee(request, pk):
    try:
        deletedCompanyEmployee = models.CompanyEmployee.objects.get(id=pk)
        delete = deletedCompanyEmployee.delete()
        if delete[0]>0: return Response({"message": "員工刪除成功"}, status=status.HTTP_200_OK)
        else: return Response({"message", "員工刪除失敗，請稍後再嘗試"}) 
    except models.CompanyEmployee.DoesNotExist:
        return Response({"messgae": "員工不存在"}, status=status.HTTP_404_NOT_FOUND)
    except:
        return Response({"messgae": "員工刪除失敗，請稍後再嘗試"})
# endregion

# region department
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createDepartment(request):
    try:
        departmentData = request.data
        createdDepartment = models.CompanyDepartment.objects.create(
            company_id = models.Company.objects.get(id=departmentData['company_id']),
            department_name = departmentData['department_name'],
        )
        serializer = serializers.CompanyDepartmentSerializer(createdDepartment, many=False)
        return Response(serializer.data)
    except Exception as e:
        return Response({'message':'部門創建失敗,請稍後再嘗試', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getDepartment(request, pk):
    try:
        department = models.CompanyDepartment.objects.get(id=pk)
        serializer = serializers.CompanyDepartmentSerializer(department, many=False)
        return Response({'data':serializer.data})
    except models.CompanyDepartment.DoesNotExist:
        return Response({'message':'部門不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCompanyAllDepartment(request, pk):
    try:
        department = models.CompanyDepartment.objects.filter(company_id__id=pk)
        serializer = serializers.CompanyDepartmentSerializer(department, many=True)
        return Response({'data':serializer.data})
    except models.CompanyDepartment.DoesNotExist:
        return Response({'message':'部門不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateDepartment(request, pk):
    try:
        departmentData = request.data
        department = models.CompanyDepartment.objects.get(id=pk)
        department.department_name = departmentData['department_name']
        department.save()
        serializer = serializers.CompanyDepartmentSerializer(department, many=False)
        return Response({'data':serializer.data}, status=status.HTTP_200_OK)
    except models.CompanyDepartment.DoesNotExist:
        return Response({'message':'部門不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'部門跟新失敗，請稍後再嘗試', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteDepartment(request, pk):
    try:
        deletedDepartment = models.CompanyDepartment.objects.get(id=pk)
        delete = deletedDepartment.delete()
        if delete[0] > 0:
            return Response({'message':'部門刪除成功'}, status=status.HTTP_200_OK)
        else:
            return Response({'message':'部門刪除失敗，請稍後再嘗試'}, status=status.HTTP_400_BAD_REQUEST)
    except models.CompanyDepartment.DoesNotExist:
        return Response({'message':'部門不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'部門刪除失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
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
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def getIdFromToken(request):
    # get token from header
    token = request.META.get('HTTP_AUTHORIZATION', '').split(' ')[1]
    accessToken = AccessToken(token)
    userId = accessToken.payload['user_id']
    return Response(userId)



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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assign_position(request):
    user_id = request.data.get('user_id')
    position = request.data.get('position')

    company_employee = get_object_or_404(models.CompanyEmployee, user_id=user_id)
    company_employee.position = position
    company_employee.save()

    return Response({'message': 'Position assigned successfully.'})

# endregion

class UserResumeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_resumes = UserResume.objects.filter(user=request.user)
            # 根据需要获取用户的履历列表

            # 序列化user_resumes并返回响应
            serializer = UserResumeSerializer(user_resumes, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(str(e), status=500)

    def post(self, request):
        try:
            data = {
                'user': request.user.id,
                'summary': request.data.get('summary'),
                'experience': request.data.get('experience'),
                'education': request.data.get('education'),
                'skills': request.data.get('skills'),
                'prefer_work': request.data.get('prefer_work', 'High Salary'),
                'language': request.data.get('language', 'Chinese')
            }

            # 创建新的用户履历
            user_resume = UserResume.objects.create(**data)

            # 序列化user_resume并返回响应
            serializer = UserResumeSerializer(user_resume)
            return Response(serializer.data, status=201)
        except Exception as e:
            return Response(str(e), status=500)

    def put(self, request, resume_id):
        try:
            user_resume = get_object_or_404(UserResume, id=resume_id, user=request.user)
            # 更新用户履历的代码

            user_resume.summary = request.data.get('summary', user_resume.summary)
            user_resume.experience = request.data.get('experience', user_resume.experience)
            user_resume.education = request.data.get('education', user_resume.education)
            user_resume.skills = request.data.get('skills', user_resume.skills)
            user_resume.prefer_work = request.data.get('prefer_work', user_resume.prefer_work)
            user_resume.language = request.data.get('language', user_resume.language)
            user_resume.save()

            # 序列化user_resume并返回响应
            serializer = UserResumeSerializer(user_resume)
            return Response(serializer.data)
        except NotFound:
            return Response("履历不存在", status=404)
        except Exception as e:
            return Response(str(e), status=500)

    def delete(self, request, resume_id):
        try:
            user_resume = get_object_or_404(UserResume, id=resume_id, user=request.user)
            # 删除用户履历的代码
            user_resume.delete()

            return Response("履历已删除")
        except NotFound:
            return Response("履历不存在", status=404)
        except Exception as e:
            return Response(str(e), status=500)

class UserApplicationRecordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = {
                'user': request.user.id,
                'userResume_id': request.data.get('user_resume_id'),
                'companyRecruitment_id': request.data.get('company_recruitment_id'),
                'status': 'Pending'  # 默认状态为受理中
            }

            # 创建新的面试申请记录
            application_record = UserApplicationRecord.objects.create(**data)

            # 序列化application_record并返回响应
            serializer = UserApplicationRecordSerializer(application_record)
            return Response(serializer.data, status=201)
        except ValidationError as e:
            return Response(str(e), status=400)
        except Exception as e:
            return Response(str(e), status=500)

    def get(self, request):
        try:
            application_records = UserApplicationRecord.objects.filter(user=request.user)
            # 根据需要获取用户的面试申请记录列表

            # 序列化application_records并返回响应
            serializer = UserApplicationRecordSerializer(application_records, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(str(e), status=500)

    def delete(self, request, application_id):
        try:
            application_record = get_object_or_404(UserApplicationRecord, id=application_id, user=request.user)
            application_record.status = 'Withdrawn'  # 将状态改为已取消
            application_record.save()

            return Response("應聘已取消")
        except NotFound:
            return Response("應聘記錄不存在", status=404)
        except Exception as e:
            return Response(str(e), status=500)

    def put(self, request, application_id):
        try:
            application_record = get_object_or_404(UserApplicationRecord, id=application_id, user=request.user)
            # 更新用户面试申请记录的代码

            serializer = UserApplicationRecordSerializer(application_record, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        except NotFound:
            return Response("應聘記錄不存在", status=404)
        except Exception as e:
            return Response(str(e), status=500)
