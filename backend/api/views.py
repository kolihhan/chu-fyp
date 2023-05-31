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
import datetime

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
            # region create company
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
            # endregion 

            # region create an initial Department for the company
            createdDepartment = models.CompanyDepartment.objects.create(
                company_id = createdCompany,
                department_name = "Main Department"
            )
            # endregion

            # region create all inital permission for the company
            createdPermission = models.CompanyPermission.objects.create(
                company_id = createdCompany,
                permission_name = "Permission_All",
                permission_desc = "Permission that allow to control every thing"
            )
            # todo: create all initial permission for a company
            # endregion

            # region create all inital benefit for the company
            createdBenefit = models.CompanyBenefits.objects.create(
                company_id = createdCompany,
                benefit_name = "Boss benefit",
                benefit_desc = "Boss no need benefit"
            )
            # todo: create all inital benefit for a company
            # endregion

            # region create companyEmployee Position (boss and employee)
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
            # endregion
        
            # region create companyEmployee (boss)
            createdEmployee = models.CompanyEmployee.objects.create(
                company_id = createdCompany,
                user_id = createdCompany.boss_id,
                companyEmployeePosition_id = createdCompanyEmployeePosition,
                salary = 0
            )
            # endregion

            # todo: create initial AnnouncementGroup
            
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
        department.department_name = departmentData.get('department_name', department.department_name)
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

# region benefit
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createBenefit(request):
    try:
        permissionData = request.data
        createdBenefit = models.CompanyBenefits.objects.create(
            company_id = models.Company.objects.get(id=permissionData['company_id']),
            benefit_name = permissionData['benefit_name'],
            benefit_desc = permissionData['benefit_desc'],
        )
        serializer = serializers.CompanyBenefitsSerializer(createdBenefit, many=False)
        if createdBenefit.id :
            return Response({'message':'權限增加成功', 'data':serializer.data}, status=status.HTTP_200_OK)
        else: 
            return Response({'message':'權限增加失敗'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message':'權限增加失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getBenefit(request, pk):
    try:
        benefit = models.CompanyBenefits.objects.get(id=pk)
        serializer = serializers.CompanyBenefitsSerializer(benefit, many=False)
        return Response({'data':serializer.data}, status=status.HTTP_200_OK)
    except models.CompanyBenefits.DoesNotExist:
        return Response({'message':'權限不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Exception({'message','權限獲取失敗'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
      
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCompanyAllBenefit(request, pk):
    try:
        benefit = models.CompanyBenefits.objects.filter(company_id__id=pk)
        serializer = serializers.CompanyBenefitsSerializer(benefit, many=True)
        return Response({'data':serializer.data}, status=status.HTTP_200_OK)
    except models.CompanyBenefits.DoesNotExist:
        return Response({'message':'權限不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Exception({'message':'權限獲取失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateBenefit(request, pk):
    try:
        benefitData = request.data
        benefit = models.CompanyBenefits.objects.get(id=pk)
        benefit.benefit_name = benefitData.get('benefit_name', benefit.benefit_name)
        benefit.benefit_desc = benefitData('benefit_desc', benefit.benefit_desc)
        benefit.save()
        serializer = serializers.CompanyBenefitsSerializer(benefit, many=False)
        return Response({'data':serializer.data}, status=status.HTTP_200_OK)
    except models.CompanyBenefits.DoesNotExist:
        return Response({'message':'權限更新不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'權限更新失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteBenefit(request, pk):
    try:
        benefit = models.CompanyBenefits.objects.get(id=pk)
        delete = benefit.delete()
        if delete[0] > 0: return Response({'message':'權限刪除成功'}, status=status.HTTP_200_OK)
        else: return Response({'message':'權限刪除失敗,請稍後再嘗試'}, status=status.HTTP_400_BAD_REQUEST)
    except models.CompanyBenefits.DoesNotExist:
        return Response({'message':'權限不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'權限刪除失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# endregion

# region employeePosition
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createPosition(request):
    try:
        with transaction.atomic():
            positionData = request.data
            createdPosition = models.CompanyEmployeePosition.objects.create(
                company_id = models.Company.objects.get(id=positionData['company_id']),
                position_name = positionData['position_name'],
                companyDepartment_id = models.CompanyDepartment.objects.get(id=positionData['companyDepartment_id'])
            )
            companyPermissions = []
            for permissionId in positionData.get('companyPermission_id', None) if positionData.get('companyPermission_id', None)!=None else []:
                companyPermissions.append(models.CompanyPermission.objects.get(id=permissionId))

            companyBenefits = []
            for benefitId in positionData.get('companyBenefits_id', None) if positionData.get('companyBenefits_id', None)!=None else []:
                companyBenefits.append(models.CompanyBenefits.objects.get(id=benefitId))
            
            createdPosition.companyPermission_id.set(companyPermissions)
            createdPosition.companyBenefits_id.set(companyBenefits)

            serializer = serializers.CompanyEmployeePositionSerializer(createdPosition, many=False)

            return Response({'message':'職位創建成功', 'data':serializer.data}, status=status.HTTP_200_OK)
        
    except (models.CompanyPermission.DoesNotExist, models.CompanyBenefits.DoesNotExist) as e:
        transaction.rollback
        return Response({'message':'職位創建失敗', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        transaction.rollback
        return Response({'message':'職位創建失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getPosition(request, pk):
    try:
        position = models.CompanyEmployeePosition.objects.get(id=pk)
        serializer = serializers.CompanyEmployeePositionSerializer(position, many=False)
        return Response({'message:': '', 'data':serializer.data})
    except models.CompanyEmployeePosition.DoesNotExist:
        return Response({'message':'職位不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'職位獲取失敗，請稍後在嘗試', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCompanyAllPosition(request, pk):
    try:
        position = models.CompanyEmployeePosition.objects.filter(company_id__id=pk)
        serializer = serializers.CompanyEmployeePositionSerializer(position, many=True)
        return Response({'message:': '', 'data':serializer.data})
    except models.CompanyEmployeePosition.DoesNotExist:
        return Response({'message':'職位不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'職位獲取失敗，請稍後在嘗試', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updatePosition(request, pk):
    try:
        positionData = request.data
        updatedPosition = models.CompanyEmployeePosition.objects.get(id=pk)

        updatedPosition.position_name = positionData.get('position_name', updatedPosition.position_name)

        if positionData.get('companyDepartment_id', None)!=None: departmentId = models.CompanyDepartment.objects.get(id=positionData['companyDepartment_id'])
        else: departmentId = updatedPosition.companyDepartment_id
        updatedPosition.companyDepartment_id = departmentId
        
        companyPermissions = []
        if positionData.get('companyPermission_id', None)!=None:
            for permissionId in positionData['companyPermission_id']:
                companyPermissions.append(models.CompanyPermission.objects.get(id=permissionId))
            updatedPosition.companyPermission_id.set(companyPermissions)
        
        companyBenefits = []
        if positionData.get('companyBenefits_id', None)!=None:
            for benefitId in positionData['companyBenefits_id']:
                companyBenefits.append(models.CompanyBenefits.objects.get(id=benefitId))
            updatedPosition.companyBenefits_id.set(companyBenefits)
        
        updatedPosition.save()

        serializer = serializers.CompanyEmployeePositionSerializer(updatedPosition, many=False)

        return Response({'message:': '職位更新成功', 'data':serializer.data})
    except (models.CompanyPermission.DoesNotExist, models.CompanyPermission.DoesNotExist, models.CompanyBenefits.DoesNotExist) as e:
        return Response({'message':'職位不存在', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'職位更新失敗，請稍後在嘗試', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteDepartment(request, pk):
    try:
        deletedDepartment = models.CompanyEmployeePosition.objects.get(id=pk)
        delete = deletedDepartment.delete()
        if delete[0]> 0:
            return Response({'message':'職位刪除成功'}, status=status.HTTP_200_OK)
        else:
            return Response({'message':'職位刪除失敗,請稍後再嘗試'}, status=status.HTTP_400_BAD_REQUEST)
    except models.CompanyEmployeePosition.DoesNotExist:
        return Response({'message':'職位不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'職位刪除吃白，請稍後再嘗試'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# endregion

# region CompanyPermission
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createCompanyPermission(request):
    try:
        permissionData = request.data
        createdPermission = models.CompanyPermission.objects.create(
            company_id = models.Company.objects.get(id=permissionData['company_id']),
            permission_name = permissionData['permission_name'],
            permission_desc = permissionData['permission_desc']
        )
        serializer = serializers.CompanyPermissionSerializer(createdPermission, many=False)
        if createdPermission.id :
            return Response({'message':'權限增加成功', 'data':serializer.data}, status=status.HTTP_200_OK)
        else: 
            return Response({'message':'權限增加失敗'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'message':'權限增加失敗', 'e':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCompanyPermission(request, pk):
    try:
        companyPermission = models.CompanyPermission.objects.get(id=pk)
        serializer = serializers.CompanyPermissionSerializer(companyPermission, many=False)
        return  Response({'message':'', 'data':serializer.data}, status=status.HTTP_200_OK)
    except models.CompanyPermission.DoesNotExist:
        return Response({'message':'權限不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'權限獲取失敗','error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateCompanyPermission(request, pk):
    try:
        updatedCompanyPermission = request.data
        originalCompanyPermission = models.CompanyPermission.objects.get(id=pk)
        originalCompanyPermission.company_id = updatedCompanyPermission.get('company_id', originalCompanyPermission.company_id)
        originalCompanyPermission.permission_name = updatedCompanyPermission.get('permission_name', originalCompanyPermission.permission_name)
        originalCompanyPermission.permission_desc = updatedCompanyPermission.get('permission_desc', originalCompanyPermission.permission_desc)
        originalCompanyPermission.save()
        serializer = serializers.CompanyPermissionSerializer(originalCompanyPermission, many=False)
        return Response({'message':'權限修改成功', 'data':serializer.data}, status=status.HTTP_200_OK)
    except models.CompanyPermission.DoesNotExist:
        return Response({'message':'權限修改失敗'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'權限修改失敗，請稍後再嘗試', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteCompanyPermission(request, pk):
    try:
        deletedCompanyPermission = models.CompanyPermission.objects.get(id=pk)
        delete = deletedCompanyPermission.delete()
        if(delete[0]>0): 
            return Response({"message":"權限已刪除"}, status=status.HTTP_200_OK)
        else: 
            return Response({'message':'權限刪除失敗，請稍後在嘗試'}, status=status.HTTP_400_BAD_REQUEST)
    except CompanyPermission.DoesNotExist:
        return Response({'message':'權限不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'權限刪除失敗，請稍後再嘗試', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCompanyAllCompanyPermission(request, pk):
    try:
        companyPermission = models.CompanyPermission.objects.filter(company_id__id = pk)
        serializer = serializers.CompanyPermissionSerializer(companyPermission, many=True)
        return  Response({'message':'', 'data':serializer.data}, status=status.HTTP_200_OK)
    except models.CompanyPermission.DoesNotExist:
        return Response({'message':'權限不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'權限獲取失敗','error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# endregion

# region AnnouncementGroup
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createAnnouncementGroup(request):
    try:
        data = request.data
        createdAnnouncementGroup = models.CompanyAnnouncementGroup.objects.create(
            company_id = models.Company.objects.get(id=data['company_id']),
            name= data['name'],
            description=data['description']
        )
        empData = []
        for emp in data['companyEmployee_id']:
            empData.append(models.CompanyEmployee.objects.get(id=emp))
        createdAnnouncementGroup.companyEmployee_id.set(empData)
        createdAnnouncementGroup.save()
        serializer = serializers.CompanyAnnouncementGroupSerializer(createdAnnouncementGroup, many=False)
        return Response({'message':'公告群組創建成功', 'data':serializer.data}, status=status.HTTP_200_OK)
    except (models.Company.DoesNotExist, models.CompanyEmployee.DoesNotExist) as e:
        return Response({'message':'公告群組創建失敗', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'公告群組創建失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getAnnouncementGroup(request, pk):
    try:
        aGroup = models.CompanyAnnouncementGroup.objects.get(id=pk)
        serializer = serializers.CompanyAnnouncementGroupSerializer(aGroup, many=False)
        return Response({'message':'', 'data':serializer.data}, status=status.HTTP_200_OK)
    except models.CompanyAnnouncementGroup.DoesNotExist:
        return Response({'message':'公告群組不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        Response({'message':'公告群組獲取失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCompanyAllAnnouncementGroup(request, pk):
    try:
        aGroup = models.CompanyAnnouncementGroup.objects.filter(company_id__id=pk)
        serializer = serializers.CompanyAnnouncementGroupSerializer(aGroup, many=True)
        return Response({'message':'', 'data':serializer.data}, status=status.HTTP_200_OK)
    except models.CompanyAnnouncementGroup.DoesNotExist:
        return Response({'message':'公告群組不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        Response({'message':'公告群組獲取失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateAnnouncementGroup(request, pk):
    try:
        data = request.data
        oriAGroup = models.CompanyAnnouncementGroup.objects.get(id=pk)
        oriAGroup.name= data.get('name', oriAGroup.name)
        oriAGroup.description=data.get('description', oriAGroup.description)

        empData = []
        if data.get('companyEmployee_id',None)!=None:
            for emp in data['companyEmployee_id']:
                empData.append(models.CompanyEmployee.objects.get(id=emp))
            oriAGroup.companyEmployee_id.set(empData)

        oriAGroup.save()
        
        serializer = serializers.CompanyAnnouncementGroupSerializer(oriAGroup, many=False)
        return Response({'message':'公告群租更新成功', 'data':serializer.data}, status=status.HTTP_200_OK)
    except models.CompanyAnnouncementGroup.DoesNotExist:
        return Response({'message':'公告群組修改失敗'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'公告群租修改失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def deleteAnnouncementGroup(request, pk):
    try:
        deletedAnnouncementGroup = models.CompanyAnnouncementGroup.objects.get(id=pk)
        delete = deletedAnnouncementGroup.delete()
        if delete[0] > 0: 
            return Response({'message':'公告群組刪除成功'}, status=status.HTTP_200_OK)
        else:
            return Response({'message':'公告群組刪除失敗'}, status=status.HTTP_400_BAD_REQUEST)
    except models.CompanyAnnouncementGroup.DoesNotExist:
        return Response({'message':'公告群租不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'公告群組刪除失敗'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# endregion

# region Announcement
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def postAnnouncement(request):
    try:
        with transaction.atomic():
            annData = request.data
            companyId = annData['company_id']
            companyEmployeeId = annData['companyEmployee_id']

            groupIds = annData['group']
            groups = []
            for groupId in groupIds:
                group = models.CompanyAnnouncementGroup.objects.get(id=groupId)
                groups.append(group)

            postedAnnouncement = models.CompanyAnnouncement.objects.create(
                company_id = models.Company.objects.get(id=companyId),
                companyEmployee_id = models.CompanyEmployee.objects.get(id=companyEmployeeId),
                title = annData['title'],
                content = annData['content'],
                expire_at = annData.get('expire_at', None)
            )
            postedAnnouncement.group.set(groups)
            serializer = serializers.CompanyAnnouncementSerializer(postedAnnouncement, many=False)
            return Response({'message':'公告發佈成功','data':serializer.data}, status=status.HTTP_200_OK)
    except (models.CompanyAnnouncementGroup.DoesNotExist, models.CompanyEmployee.DoesNotExist) as e:
        transaction.rollback()
        return Response({'message':'公告發佈失敗', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        transaction.rollback()
        return Response({'message':'公告發佈失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def getAnnouncement(request, pk):
    try:
        announcementData = models.CompanyAnnouncement.objects.get(id=pk)
        serializer = serializers.CompanyAnnouncementSerializer(announcementData, many=False)
        return Response({'data':serializer.data}, status=status.HTTP_200_OK)
    except models.CompanyAnnouncement.DoesNotExist:
        return Response({'message':'公告不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'公告獲取失敗，請稍後再嘗試', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateAnnouncement(request, pk):
    updatedAnnouncement = request.data
    try:
        with transaction.atomic():
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
            return Response({'data':serializer.data}, status=status.HTTP_200_OK)
    except (models.CompanyAnnouncement.DoesNotExist, models.CompanyAnnouncementGroup.DoesNotExist) as e:
        transaction.rollback()
        return Response({'message':'公告不存在', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        transaction.rollback()
        return Response({'message':'公告更新失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteAnnouncement(request, pk):
    try:
        deletedAnnouncement = models.CompanyAnnouncement.objects.get(id=pk)
        delete = deletedAnnouncement.delete()
        if(delete[0]>0): 
            return Response({'message':'公告已刪除'}, status=status.HTTP_200_OK)
        else: 
            return Response({'message':'公告刪除失敗，請稍後再嘗試'}, status=status.HTTP_400_BAD_REQUEST)
    except models.CompanyAnnouncement.DoesNotExist:
        return Response({'message':'公告不存在'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'公告刪除失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserAllAnnouncement(request, companyId, employeeId):
    try:
        announcementData = models.CompanyAnnouncement.objects.filter((Q(company_id__id=companyId)) & (Q(group__isnull=True) | Q(group__companyEmployee_id__id=employeeId)))
        serializer = serializers.CompanyAnnouncementSerializer(announcementData, many=True)
        return Response({'data':serializer.data}, status=status.HTTP_200_OK)
    except models.CompanyAnnouncementGroup.DoesNotExist as e:
        return Response({'message':'公告不存在','error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'公告獲取失敗','error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCompanyAllAnnouncement(request, companyId):
    try:
        announcementData = models.CompanyAnnouncement.objects.filter(Q(company_id__id=companyId))
        serializer = serializers.CompanyAnnouncementSerializer(announcementData, many=True)
        return Response({'data':serializer.data}, status=status.HTTP_200_OK)
    except models.CompanyAnnouncementGroup.DoesNotExist as e:
        return Response({'message':'公告不存在','error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'公告獲取失敗','error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# endregion

# region CompanyTraining
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createCompanyTraining(request):
    try:
        data = request.data
        createdComppanyTraining = models.CompanyTraining.objects.create(
            company_id = models.Company.objects.get(id=data['company_id']),
            title = data['title'],
            description = data['description'],
            trainer = models.CompanyEmployee.objects.get(id=data['trainer']),
            start_date = datetime.datetime.strptime(data['start_date'], '%Y-%m-%d %H:%M:%S'),   # 2023-05-30 10:00:00
            end_date = datetime.datetime.strptime(data['end_date'], '%Y-%m-%d %H:%M:%S')
        )
        serializer = serializers.CompanyTrainingSerializer(createdComppanyTraining, many=False)
        return Response({'message':'公司培訓創建成功','data':serializer.data}, status=status.HTTP_200_OK)
    except (models.Company.DoesNotExist, models.CompanyEmployee.DoesNotExist) as e:
        return Response({'message':'公司培訓創建失敗', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'公司培訓創建失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCompanyTraining(request, pk):
    try:
        createdComppanyTraining = models.CompanyTraining.objects.get(id=pk)
        serializer = serializers.CompanyTrainingSerializer(createdComppanyTraining, many=False)
        return Response({'message':'','data':serializer.data}, status=status.HTTP_200_OK)
    except models.CompanyTraining.DoesNotExist as e:
        return Response({'message':'公司培訓不存在', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'公司培訓獲取失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCompanyAllTraining(request, pk):
    try:
        createdComppanyTraining = models.CompanyTraining.objects.filter(company_id__id=pk)
        serializer = serializers.CompanyTrainingSerializer(createdComppanyTraining, many=True)
        return Response({'message':'','data':serializer.data}, status=status.HTTP_200_OK)
    except models.CompanyTraining.DoesNotExist as e:
        return Response({'message':'公司培訓不存在', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'公司培訓獲取失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateCompanyTraining(request, pk):
    try:
        data = request.data
        updatedCompanyTraining = models.CompanyTraining.objects.get(id=pk)
        updatedCompanyTraining.title = data.get('title', updatedCompanyTraining.title)
        updatedCompanyTraining.description = data.get('description', updatedCompanyTraining.description)
        if data.get('trainer', None)!=None: updatedCompanyTraining.trainer = models.CompanyEmployee.objects.get(id=data['trainer'])
        if data.get('start_date', None)!=None: updatedCompanyTraining.start_date = datetime.datetime.strptime(data['start_date'], '%Y-%m-%d %H:%M:%S')
        if data.get('end_date', None)!=None: updatedCompanyTraining.end_date = datetime.datetime.strptime(data['end_date'], '%Y-%m-%d %H:%M:%S')
        updatedCompanyTraining.save()

        serializer = serializers.CompanyTrainingSerializer(updatedCompanyTraining, many=False)
        return Response({'message':'公司培訓修改成功','data':serializer.data}, status=status.HTTP_200_OK)
    except (models.Company.DoesNotExist, models.CompanyEmployee.DoesNotExist, models.CompanyTraining.DoesNotExist) as e:
        return Response({'message':'公司培訓不存在', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'公司培訓修改失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteCompanyTraining(request, pk):
    try:
        deletedComppanyTraining = models.CompanyTraining.objects.get(id=pk)
        delete = deletedComppanyTraining.delete()
        if delete[0] > 0:
            return Response({'message':'公司培刪除成功'}, status=status.HTTP_200_OK)
        else:
            return Response({'message':'公司培刪除失敗'}, status=status.HTTP_400_BAD_REQUEST)
    except models.CompanyTraining.DoesNotExist as e:
        return Response({'message':'公司培訓不存在', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'公司培訓刪除失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# endregion

# region CompanyEmployeeTraining
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createCompanyEmployeeTraining(request):
    try:
        data = request.data
        createdCET = models.CompanyEmployeeTraining.objects.create(
            companyEmployee_id = models.CompanyEmployee.objects.get(id=data['companyEmployee_id']),
            company_id = models.Company.objects.get(id=data['company_id']),
            companyTraining_id = models.CompanyTraining.objects.get(id=data['companyTraining_id']),
            training_result = 'In Progress'
        )
        serializer = serializers.CompanyEmployeeTrainingSerializer(createdCET, many=False)
        return Response({'message':'員工培訓建立成功', 'data':serializer.data}, status=status.HTTP_200_OK)
    except (models.Company.DoesNotExist, models.CompanyEmployee.DoesNotExist, models.CompanyTraining.DoesNotExist) as e:
        return Response({'message':'員工培訓建立失敗', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'員工培訓建立失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCompanyEmployeeTraining(request, pk):
    try:
        companyEmployeeTraining = models.CompanyEmployeeTraining.objects.get(id=pk)
        serializer = serializers.CompanyEmployeeTrainingSerializer(companyEmployeeTraining, many=False)
        return Response({'message':'員工培訓獲取成功', 'data':serializer.data}, status=status.HTTP_200_OK)
    except models.CompanyTraining.DoesNotExist as e:
        return Response({'message':'員工培訓獲取失敗', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'員工培訓獲取失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCompanyAllCompanyEmployeeTraining(request, pk):
    try:
        companyEmployeeTraining = models.CompanyEmployeeTraining.objects.filter(company_id__id=pk)
        serializer = serializers.CompanyEmployeeTrainingSerializer(companyEmployeeTraining, many=True)
        return Response({'message':'員工培訓獲取成功', 'data':serializer.data}, status=status.HTTP_200_OK)
    except models.CompanyTraining.DoesNotExist as e:
        return Response({'message':'員工培訓獲取失敗', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'員工培訓獲取失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getEmployeeAllCompanyEmployeeTraining(request, pk):
    try:
        companyEmployeeTraining = models.CompanyEmployeeTraining.objects.filter(companyEmployee_id__id=pk)
        serializer = serializers.CompanyEmployeeTrainingSerializer(companyEmployeeTraining, many=True)
        return Response({'message':'員工培訓獲取成功', 'data':serializer.data}, status=status.HTTP_200_OK)
    except models.CompanyTraining.DoesNotExist as e:
        return Response({'message':'員工培訓獲取失敗', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'員工培訓獲取失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateCompanyEmployeeTraining(request, pk):
    try:
        data = request.data
        updatedCET = models.CompanyEmployeeTraining.objects.get(id=pk)
        if data.get('companyEmployee_id', None)!=None: 
            updatedCET.companyEmployee_id = models.CompanyEmployee.objects.get(id=data['companyEmployee_id'])
        if data.get('company_id', None)!=None: 
            updatedCET.company_id = models.Company.objects.get(id=data['company_id'])
        if data.get('companyTraining_id', None)!=None: 
            updatedCET.companyTraining_id = models.CompanyTraining.objects.get(id=data['companyTraining_id'])
        if data.get('training_result', None)!=None: 
            updatedCET.training_result = data['training_result']
        updatedCET.save()
        serializer = serializers.CompanyEmployeeTrainingSerializer(updatedCET, many=False)
        return Response({'message':'員工培訓修改成功', 'data':serializer.data}, status=status.HTTP_200_OK)
    except (models.Company.DoesNotExist, models.CompanyEmployee.DoesNotExist, models.CompanyTraining.DoesNotExist, models.CompanyEmployeeTraining.DoesNotExist) as e:
        return Response({'message':'員工培訓修改失敗', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'員工培訓修改失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteCompanyEmployeeTraining(request, pk):
    try:
        deletedCET = models.CompanyEmployeeTraining.objects.get(id=pk)
        delete = deletedCET.delete()    
        if delete[0]>0:
            return Response({'message':'員工培訓刪除成功'}, status=status.HTTP_200_OK)
        else: 
            return Response({'message':'員工培訓刪除失敗'}, status=status.HTTP_400_BAD_REQUEST)
    except models.CompanyEmployeeTraining.DoesNotExist as e:
        return Response({'message':'員工培訓刪除失敗', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'員工培訓刪除失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
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