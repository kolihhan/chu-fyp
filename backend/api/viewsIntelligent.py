import datetime
from datetime import datetime, timedelta

from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from . import models, serializers
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

from .models import (Company, CompanyEmployeePosition, CompanyRecruitment,
                     UserAccount, UserApplicationRecord, UserResume)

import random
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity, linear_kernel
import spacy
from faker import Faker
from gensim.models import Word2Vec

# feedbackRemarkList = ['毀壞公司財物','辱駡同事','得罪客戶','解決問題','提升業績','缺乏工作效率','未達到工作目標','未能準時完成工作任務','公司帶來利益','不遵守公司政策和程序','缺乏團隊合作精神','態度不積極或消極','拖延工作','不負責任地處理工作','忽略客戶的需求和反饋','經常出現錯誤或粗心大意','經常與同事發生衝突或矛盾','逃避責任或找借口','違反公司的機密和保密政策',]
feedback_remark_list_g = ['積極解決問題', '提升業績', '創造公司利潤', '無私地捐獻資源給公司', '高效率完成工作', '準時達成工作目標', '提前完成工作任務', '細心處理工作', '積極態度', '關心同事', '充分滿足客戶需求', '勤奮工作', '負責任處理工作', '承擔錯誤和負責任', '良好的團隊合作精神', '尊重公司機密和保密政策', '主動學習和成長', '創新和提出改進建議', '善於溝通和協作', '尊重多樣性和包容性']
feedback_remark_list_b = ['頻繁發生問題', '導致公司損失', '損害公司財產', '工作效率不足', '未達工作目標', '未能按時完成工作任務', '經常出現錯誤或粗心大意', '缺乏團隊合作精神', '消極態度', '辱罵同事', '忽略客戶需求和反饋', '不遵守公司政策和程序', '拖延或敷衍工作', '逃避責任或找借口', '經常與同事發生衝突或矛盾', '違反公司的機密和保密政策', '忽略專業發展和學習', '不積極尋求改進和創新', '缺乏有效溝通和團隊協作', '不尊重多樣性和缺乏包容性']
feedback_improvement = ['著重於問題預防和風險管理，確保在解決問題之前預測和處理潛在的問題，以減少頻繁發生的情況','評估業績提升策略的風險和潛在影響，制定可行的計劃和措施，並監控結果以確保不會對公司造成損失','著重於有效的資源管理和保護公司財產，確保在追求利潤的同時，不會對公司財產造成損害','提高工作效率，包括時間管理和任務優先順序的設定，以更有效地利用資源並提高工作效率','制定明確的工作目標和計劃，確保時間分配合理，並監控進度以確保達到工作目標','加強時間管理和優先順序的設定，並建立有效的工作計劃，以確保準時完成工作任務','加強對細節的關注，仔細檢查工作內容，並培養更高的注意力和專注力，以避免經常出現錯誤或粗心失誤','鼓勵團隊合作，積極參與和支持團隊成員，並在工作中表現出協作和共享的態度','鼓勵主動解決問題，積極參與團隊討論和解決方案的提出，以更全面地展現積極的工作態度','尊重同事，避免辱罵和貶低他人，並以友善和建設性的方式與同事進行溝通和解決衝突','重視客戶需求和反饋，主動與客戶溝通，並采取措施以提高客戶滿意度和關注客戶反饋','遵守公司政策和程序，確保工作行為符合公司的要求和規定','提高時間管理能力，確保按時完成工作任務，並以負責任的態度對待每個工作','更加勇於承擔責任，認真面對錯誤，並尋找解決問題的方法，而不是逃避責任或找借口','加強與同事之間的溝通和協調，尊重彼此觀點，並尋求解決衝突的方式和方法，以營造更和諧的工作環境','確保理解並遵守公司的機密和保密政策，妥善保護公司機密信息，並避免洩露或不當使用','積極追求專業發展和學習機會，主動參與培訓、研討會等活動，並持續提升專業技能','鼓勵主動提出改進建議，思考創新解決方案，並積極參與團隊的改進和創新活動','具備善於溝通和協作的能力，但缺乏有效溝通和團隊協作的技巧','增加對不同觀點和背景的理解和接納，建立一個包容和互相尊重的工作環境，並避免偏見或歧視行為',]
score_list = [20, 30, 30, 15, 20, 20, 15, 15, 15, 20, 20, 15, 20, 20, 15, 20, 15, 20, 15, 15]


# region eveluateEmployee
# @api_view(['GET'])
# @permission_classes([AllowAny])
# def eveluateEmployee(request):   
#     # current_dir = os.getcwd()
#     # # Define the path to the script
#     # script_path = os.path.join(current_dir, 'intelligentFunction.py')

#     feedbackReviewJsonFilePath = 'api/intelligentFunction/feedbackReview.json'

#     feedback_reviews = models.CompanyEmployeeFeedBackReview.objects.all()
#     serializer = serializers.CompanyEmployeeFeedBackReviewSerializer(feedback_reviews, many=True)
#     serializer_data = serializer.data
#     with open(feedbackReviewJsonFilePath, "w") as file:
#         json.dump(serializer.data, file)
#     # print("serializer: ",serializer.data)
    
#     # Define the command with arguments
#     command = ['python', 'api/intelligentFunction/intelligentFunction.py', '--v1', 'Chia', '--v2', '18']
#     file_path = os.path.abspath('C:/Users/chiajy/Desktop/intelligentFunction.py')
#     # command = ['python', file_path, '--v1', 'Chia', '--v2', '18']
#     # Run the command
#     process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
#     stdout, stderr = process.communicate()
#     return_code = process.returncode


#     return Response(
#         {
#             "stdout": stdout.decode(), 
#             "stderr": stderr,
#             "return_code":return_code

#         }
#     )
# endregion eveluateEmployee

@api_view(['POST'])
@permission_classes([AllowAny])
def registerMulti(request):
    registerData = request.data
    try:
        for i in range(1,201):
            registerData['email'] = f'chia{i}@gmail.com'
            registerData['name'] = f'chia{i}'
            serializer = serializers.UserSerializer(data=registerData)
            if serializer.is_valid():
                serializer.save()
        return Response("賬號建立成功", status=status.HTTP_201_CREATED)
    except: 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createCompanyMulti(request):
    try:
        with transaction.atomic():
            for i in range(10, 201):
                if i%10==0:
                    companyData = request.data

                    # region create company
                    createdCompany = models.Company.objects.create(
                        name = f'Chia {i} Company',
                        email = f'chia{i}@gmai.com',
                        phone = '-',
                        address = '-',
                        company_desc = f'Company created by chia{i}',
                        company_benefits = 'black company, no benefit',
                        boss_id = models.UserAccount.objects.get(id=(i)),
                    )
                    serializer = serializers.CompanySerializer(createdCompany, many=False)
                    # endregion create company

                    # region create an initial Department for the company
                    createdDepartment = models.CompanyDepartment.objects.create(
                        company_id = createdCompany,
                        department_name = "Main Department"
                    )
                    # endregion create department
                    
                    # region create all inital permission for the company
                    createdPermissionList=[
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_All",
                            permission_desc = "Permission that allow to control every thing"
                        ),
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_Invite_Employee",
                            permission_desc = "Permission that allow to invite employee from this platform"
                        ),
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_Get_Employee_List",
                            permission_desc = "Permission that allow to get all employee from company"
                        ),
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_Get_Employee_Data",
                            permission_desc = "Permission that allow to get employee data"
                        ),
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_Update_Employee_Salary",
                            permission_desc = "Permission that allow to update employee data"
                        ),
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_Update_Employee_Permission",
                            permission_desc = "Permission that allow to update employee permission"
                        ),
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_Fire_Employee",
                            permission_desc = "Permission that allow to get all employee from company"
                        ),
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_Recruit_Employee",
                            permission_desc = "Permission that allow to recruit employee"
                        ),
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_Create_New_Department",
                            permission_desc = "Permission that allow to get all employee from company"
                        ),
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_Get_Company_Benefits",
                            permission_desc = "Permission that allow to get all employee from company"
                        ),
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_Create_Company_Benefits",
                            permission_desc = "Permission that allow to get all employee from company"
                        ),
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_Update_Company_Benefits",
                            permission_desc = "Permission that allow to get all employee from company"
                        ),
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_Delete_Company_Benefits",
                            permission_desc = "Permission that allow to get all employee from company"
                        ),
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_Create_Announcement_Group",
                            permission_desc = "Permission that allow to get all employee from company"
                        ),
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_Get_All_Announcement_Group",
                            permission_desc = "Permission that allow to get all employee from company"
                        ),
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_View_Announcement_Group",
                            permission_desc = "Permission that allow to get all employee from company"
                        ),
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_Update_Announcement_Group",
                            permission_desc = "Permission that allow to get all employee from company"
                        ),
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_Delete_Announcement_Group",
                            permission_desc = "Permission that allow to get all employee from company"
                        ),
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_Post_Announcement",
                            permission_desc = "Permission that allow to get all employee from company"
                        ),
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_View_Announcement",
                            permission_desc = "Permission that allow to get all employee from company"
                        ),
                        models.CompanyPermission(
                            company_id = createdCompany,
                            permission_name = "Permission_Feedback",
                            permission_desc = "Permission that allow to get all employee from company"
                        ),
                    ]
                    models.CompanyPermission.objects.bulk_create(createdPermissionList)            
                    # endregion create permission
                    
                    # region create all inital benefit for the company
                    bossBenefit = models.CompanyBenefits.objects.create(
                        company_id = createdCompany,
                        benefit_name = "Boss benefit",
                        benefit_desc = "Boss no need benefit"
                    )
                    employeeBenefit = models.CompanyBenefits.objects.create(
                        company_id = createdCompany,
                        benefit_name = "Employee benefit",
                        benefit_desc = "五險一金，員工旅游（之後再改）"
                    )
                    # endregion create benefit

                    # region create companyEmployee Position
                    positionBoss = models.CompanyEmployeePosition.objects.create(
                        company_id = createdCompany,
                        position_name = "Boss",
                        companyDepartment_id = createdDepartment
                    )
                    positionBoss.companyPermission_id.set([models.CompanyPermission.objects.get(Q(permission_name='Permission_All') & Q(company_id=createdCompany))])
                    positionBoss.companyBenefits_id.set([bossBenefit])
                    positionBoss.save()

                    positionEmployee = models.CompanyEmployeePosition.objects.create(
                        company_id = createdCompany,
                        position_name = "Employee",
                        companyDepartment_id = createdDepartment,
                    )
                    positionEmployee.companyPermission_id.set([
                        models.CompanyPermission.objects.get(Q(permission_name='Permission_Get_Employee_List') & Q(company_id=createdCompany)),
                        models.CompanyPermission.objects.get(Q(permission_name='Permission_Get_All_Announcement_Group') & Q(company_id=createdCompany)),
                        models.CompanyPermission.objects.get(Q(permission_name='Permission_View_Announcement_Group') & Q(company_id=createdCompany)),
                        models.CompanyPermission.objects.get(Q(permission_name='Permission_Post_Announcement') & Q(company_id=createdCompany)),
                        models.CompanyPermission.objects.get(Q(permission_name='Permission_View_Announcement') & Q(company_id=createdCompany)),
                        models.CompanyPermission.objects.get(Q(permission_name='Permission_Feedback') & Q(company_id=createdCompany))
                    ])
                    positionEmployee.companyBenefits_id.set([employeeBenefit])
                    positionEmployee.save()
                    # endregion companyEmployee position
                
                    # region create companyEmployee (boss)
                    companyEmployeeBoss = models.CompanyEmployee.objects.create(
                        company_id = createdCompany,
                        user_id = createdCompany.boss_id,
                        companyEmployeePosition_id = positionBoss,
                        salary = 0
                    )
                    # endregion create boss

                    # region createAnnouncementGroup
                    mainAnnouncementGroup = models.CompanyAnnouncementGroup.objects.create(
                        company_id = createdCompany,
                        name= 'Main Announcement Group',
                        description='Announcement Group for all employee'
                    )
                    mainAnnouncementGroup.companyEmployee_id.set([companyEmployeeBoss])
                    mainAnnouncementGroup.save()
                    # endregion createAnnouncementGroup

                    # region create check in rule
                    checkInRule = models.companyCheckInRule.objects.create(
                        company_id = createdCompany,
                        work_time_start = datetime.strptime('2023-6-11 09:00:00', '%Y-%m-%d %H:%M:%S').time(),
                        work_time_end = datetime.strptime('2023-6-11 18:00:00', '%Y-%m-%d %H:%M:%S').time(),
                        late_tolerance = timedelta(hours=0,minutes=0)
                    )
                    # endregion checkInRule
        return Response({'message':'公司創建成功', 'data':serializer.data})
    except Exception as e:
        transaction.rollback()
        return Response({'message':'公司創建失敗，請稍後再嘗試', 'error': str(e)})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteCompanyMulti(request):
    try:
        for i in range(41, 230):
            if (i-1)%10!=0:
                deletedCompany = models.Company.objects.get(id=i)
                deleted = deletedCompany.delete()
        if(deleted[0] > 0): return Response({'message':'公司刪除成功'})
        else: return Response({'message':'公司刪除失敗，請稍後再嘗試'})
    except models.Company.DoesNotExist:
        return Response({"message":"公司不存在"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createCompanyEmployeeMulti(request):
    try:
        companyID=1 #first company id
        for i in range(1,201):
            employeeData = request.data
            if i%10==0: companyID+=1
            elif i%10!=0:
                createdCompanyEmployee  = models.CompanyEmployee.objects.create(
                    company_id = models.Company.objects.get(id=companyID),
                    user_id = models.UserAccount.objects.get(id=i),
                    companyEmployeePosition_id = models.CompanyEmployeePosition.objects.get(Q(company_id__id=companyID) & Q(position_name='Employee')),
                    salary = random.randint(30000, 60000)
                )
                serializer = serializers.CompanyEmployeeSerializer(createdCompanyEmployee, many=False)
        if(createdCompanyEmployee.id):
            return Response({"message":"員工增加成功", "data":serializer.data})
        else: return Response({"message":"員工增加失敗"})
    except (models.Company.DoesNotExist, models.UserAccount.DoesNotExist, models.CompanyEmployeePosition.DoesNotExist) as e:
        return Response({"message": "公司、使用者帳號或員工職位不存在", "error":str(e)})
    except Exception as e:
        return Response({"message": "員工增加失敗", "error": str(e)})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createCompanyEmployeeFeedbackReviewMulti(request):
    try:
        for i in range(1,201):
            if random.randint(1,10)%2==0:
                rmk = random.choice(feedback_remark_list_g)
            else: 
                rmk = random.choice(feedback_remark_list_b)

            emp = models.CompanyEmployee.objects.get(id=i)
            cmp = models.Company.objects.get(id=emp.company_id.id)
            createdCEFR = models.CompanyEmployeeFeedBackReview.objects.create(
                company_id = cmp,
                companyEmployee_id = emp,
                feedback_to = emp,
                remarks = rmk
            )
            for j in range(4):
                if random.randint(1,10)%2==0:
                    rmk = random.choice(feedback_remark_list_g)
                else: 
                    rmk = random.choice(feedback_remark_list_b)

                if (random.randint(0,10))%2==0:
                    emp = models.CompanyEmployee.objects.get(id=i)
                    cmp = models.Company.objects.get(id=emp.company_id.id)
                    createdCEFR = models.CompanyEmployeeFeedBackReview.objects.create(
                        company_id = cmp,
                        companyEmployee_id = emp,
                        feedback_to = emp,
                        remarks = rmk
                    )
        serializer = serializers.CompanyEmployeeFeedBackReviewSerializer(createdCEFR, many=False)
        return Response({'message':'員工反饋成功', 'data':serializer.data}, status=status.HTTP_200_OK)
    except (models.CompanyEmployee.DoesNotExist, models.Company.DoesNotExist) as e:
        return Response({'message':'員工反饋失敗', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'員工反饋失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def calCompanyEmployeeScore(request):
    try:
        for i in range(0, 201):
            eScore = 60
            try:
                feedbackReview = models.CompanyEmployeeFeedBackReview.objects.filter(feedback_to__id=i)
                remark_list = [remarks.remarks for remarks in feedbackReview]
                # region calculate eScore
                rmk_g = []
                rmk_b = []
                rmk_improvement = []
                for j in range(len(remark_list)):
                    # region g
                    if remark_list[j] == feedback_remark_list_g[0]:
                        eScore += score_list[0]
                        rmk_g.append(remark_list[j])
                    elif remark_list[j] == feedback_remark_list_g[1]:
                        eScore += score_list[1]
                        rmk_g.append(remark_list[j])
                    elif remark_list[j] == feedback_remark_list_g[2]:
                        eScore += score_list[2]
                        rmk_g.append(remark_list[j])
                    elif remark_list[j] == feedback_remark_list_g[3]:
                        eScore += score_list[3]
                        rmk_g.append(remark_list[j])
                    elif remark_list[j] == feedback_remark_list_g[4]:
                        eScore += score_list[4]
                        rmk_g.append(remark_list[j])
                    elif remark_list[j] == feedback_remark_list_g[5]:
                        eScore += score_list[5]
                        rmk_g.append(remark_list[j])
                    elif remark_list[j] == feedback_remark_list_g[6]:
                        eScore += score_list[6]
                        rmk_g.append(remark_list[j])
                    elif remark_list[j] == feedback_remark_list_g[7]:
                        eScore += score_list[7]
                        rmk_g.append(remark_list[j])
                    elif remark_list[j] == feedback_remark_list_g[8]:
                        eScore += score_list[8]
                        rmk_g.append(remark_list[j])
                    elif remark_list[j] == feedback_remark_list_g[9]:
                        eScore += score_list[9]
                        rmk_g.append(remark_list[j])
                    elif remark_list[j] == feedback_remark_list_g[10]:
                        eScore += score_list[10]
                        rmk_g.append(remark_list[j])
                    elif remark_list[j] == feedback_remark_list_g[11]:
                        eScore += score_list[11]
                        rmk_g.append(remark_list[j])
                    elif remark_list[j] == feedback_remark_list_g[12]:
                        eScore += score_list[12]
                        rmk_g.append(remark_list[j])
                    elif remark_list[j] == feedback_remark_list_g[13]:
                        eScore += score_list[13]
                        rmk_g.append(remark_list[j])
                    elif remark_list[j] == feedback_remark_list_g[14]:
                        eScore += score_list[14]
                        rmk_g.append(remark_list[j])
                    elif remark_list[j] == feedback_remark_list_g[15]:
                        eScore += score_list[15]
                        rmk_g.append(remark_list[j])
                    elif remark_list[j] == feedback_remark_list_g[16]:
                        eScore += score_list[16]
                        rmk_g.append(remark_list[j])
                    elif remark_list[j] == feedback_remark_list_g[17]:
                        eScore += score_list[17]
                        rmk_g.append(remark_list[j])
                    elif remark_list[j] == feedback_remark_list_g[18]:
                        eScore += score_list[18]
                        rmk_g.append(remark_list[j])
                    elif remark_list[j] == feedback_remark_list_g[19]:
                        eScore += score_list[19]
                        rmk_g.append(remark_list[j])
                    # endregion g
                    # region b
                    if remark_list[j] == feedback_remark_list_b[0]:
                        eScore -= score_list[0]
                        rmk_b.append(remark_list[j])
                        
                    if remark_list[j] == feedback_remark_list_b[1]:
                        eScore -= score_list[1]
                        rmk_b.append(remark_list[j])
                        
                    if remark_list[j] == feedback_remark_list_b[2]:
                        eScore -= score_list[2]
                        rmk_b.append(remark_list[j])
                        
                    if remark_list[j] == feedback_remark_list_b[3]:
                        eScore -= score_list[3]
                        rmk_b.append(remark_list[j])
                        
                    if remark_list[j] == feedback_remark_list_b[4]:
                        eScore -= score_list[4]
                        rmk_b.append(remark_list[j])
                        
                    if remark_list[j] == feedback_remark_list_b[5]:
                        eScore -= score_list[5]
                        rmk_b.append(remark_list[j])
                        
                    if remark_list[j] == feedback_remark_list_b[6]:
                        eScore -= score_list[6]
                        rmk_b.append(remark_list[j])
                        
                    if remark_list[j] == feedback_remark_list_b[7]:
                        eScore -= score_list[7]
                        rmk_b.append(remark_list[j])
                        
                    if remark_list[j] == feedback_remark_list_b[8]:
                        eScore -= score_list[8]
                        rmk_b.append(remark_list[j])
                        
                    if remark_list[j] == feedback_remark_list_b[9]:
                        eScore -= score_list[9]
                        rmk_b.append(remark_list[j])
                        
                    if remark_list[j] == feedback_remark_list_b[10]:
                        eScore -= score_list[10]
                        rmk_b.append(remark_list[j])
                        
                    if remark_list[j] == feedback_remark_list_b[11]:
                        eScore -= score_list[11]
                        rmk_b.append(remark_list[j])
                        
                    if remark_list[j] == feedback_remark_list_b[12]:
                        eScore -= score_list[12]
                        rmk_b.append(remark_list[j])
                        
                    if remark_list[j] == feedback_remark_list_b[13]:
                        eScore -= score_list[13]
                        rmk_b.append(remark_list[j])
                        
                    if remark_list[j] == feedback_remark_list_b[14]:
                        eScore -= score_list[14]
                        rmk_b.append(remark_list[j])
                        
                    if remark_list[j] == feedback_remark_list_b[15]:
                        eScore -= score_list[15]
                        rmk_b.append(remark_list[j])
                        
                    if remark_list[j] == feedback_remark_list_b[16]:
                        eScore -= score_list[16]
                        rmk_b.append(remark_list[j])
                        
                    if remark_list[j] == feedback_remark_list_b[17]:
                        eScore -= score_list[17]
                        rmk_b.append(remark_list[j])
                        
                    if remark_list[j] == feedback_remark_list_b[18]:
                        eScore -= score_list[18]
                        rmk_b.append(remark_list[j])
                        
                    if remark_list[j] == feedback_remark_list_b[19]:
                        eScore -= score_list[19]
                        rmk_b.append(remark_list[j])
                        
                    # endregion b
                if feedback_remark_list_b[0] in remark_list: rmk_improvement.append(feedback_improvement[0])
                if feedback_remark_list_b[1] in remark_list: rmk_improvement.append(feedback_improvement[1])
                if feedback_remark_list_b[2] in remark_list: rmk_improvement.append(feedback_improvement[2])
                if feedback_remark_list_b[3] in remark_list: rmk_improvement.append(feedback_improvement[3])
                if feedback_remark_list_b[4] in remark_list: rmk_improvement.append(feedback_improvement[4])
                if feedback_remark_list_b[5] in remark_list: rmk_improvement.append(feedback_improvement[5])
                if feedback_remark_list_b[6] in remark_list: rmk_improvement.append(feedback_improvement[6])
                if feedback_remark_list_b[7] in remark_list: rmk_improvement.append(feedback_improvement[7])
                if feedback_remark_list_b[8] in remark_list: rmk_improvement.append(feedback_improvement[8])
                if feedback_remark_list_b[9] in remark_list: rmk_improvement.append(feedback_improvement[9])
                if feedback_remark_list_b[10] in remark_list: rmk_improvement.append(feedback_improvement[10])
                if feedback_remark_list_b[11] in remark_list: rmk_improvement.append(feedback_improvement[11])
                if feedback_remark_list_b[12] in remark_list: rmk_improvement.append(feedback_improvement[12])
                if feedback_remark_list_b[13] in remark_list: rmk_improvement.append(feedback_improvement[13])
                if feedback_remark_list_b[14] in remark_list: rmk_improvement.append(feedback_improvement[14])
                if feedback_remark_list_b[15] in remark_list: rmk_improvement.append(feedback_improvement[15])
                if feedback_remark_list_b[16] in remark_list: rmk_improvement.append(feedback_improvement[16])
                if feedback_remark_list_b[17] in remark_list: rmk_improvement.append(feedback_improvement[17])
                if feedback_remark_list_b[18] in remark_list: rmk_improvement.append(feedback_improvement[18])
                if feedback_remark_list_b[19] in remark_list: rmk_improvement.append(feedback_improvement[19])
                rmk_g = f'{rmk_g}'
                rmk_b = f'{rmk_b}'
                rmk_improvement = f'{rmk_improvement}'

                # endregion calculate eScore
                eScore = format(eScore, ".2f")
                emp = models.CompanyEmployee.objects.get(id=i)
                cmp = models.Company.objects.get(id=emp.company_id.id)
                createdCEE = models.CompanyEmployeeEvaluate.objects.create(
                    company_id = cmp,
                    companyEmployee_id = emp,
                    score = eScore,
                    remark = f'g:{rmk_g},b:{rmk_b}',
                    improvement = f'{rmk_improvement}'
                )
            except Exception as e:
                print(f'error: {str(e)}')
                pass
        # serializer = serializers.CompanyEmployeeFeedBackReviewSerializer(createdCEE, many=False)
        # return Response({'message':'員工反饋成功', 'data':serializer.data}, status=status.HTTP_200_OK)
    except (models.CompanyEmployee.DoesNotExist, models.Company.DoesNotExist) as e:
        return Response({'message':'員工反饋失敗', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'員工反饋失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def getCompanyEmployeeEvaluate2(request, pk):
    cee = models.CompanyEmployeeEvaluate.objects.get(id=pk)
    serializer = serializers.CompanyEmployeeEvaluateSerializer(cee, many=False)
    dd = serializer.data
    dd['remark'] = {
        'g':eval(dd['remark'].split(',b:')[0].split('g:')[1]),
        'b':eval(dd['remark'].split(',b:')[1])
    }
    dd['improvement'] = eval(dd['improvement'])
    return Response({"data":dd})

@api_view(['GET'])
@permission_classes([AllowAny])
def getCompanyEmployeeEvaluateAll(request):
    cee = models.CompanyEmployeeEvaluate.objects.all()
    serializer = serializers.CompanyEmployeeEvaluateSerializer(cee, many=True)
    data = serializer.data
    for dd in data:
        dd['remark'] = {
            'g':eval(dd['remark'].split(',b:')[0].split('g:')[1]),
            'b':eval(dd['remark'].split(',b:')[1])
        }
        dd['improvement'] = eval(dd['improvement'])
    return Response({"data":data})

@api_view(['DELETE'])
@permission_classes([AllowAny])
def deleteAllCompanyEmployeeEvaluate(request):
    delete = models.CompanyEmployeeEvaluate.objects.all().delete()
    if delete[0] > 0:
        return Response({'message':''})
    
@api_view(['GET'])
@permission_classes([AllowAny])
def getAllCompanyEmployeeFeedbackReview(request):
    try:
        cerf = models.CompanyEmployeeFeedBackReview.objects.all()
        serializer = serializers.CompanyEmployeeFeedBackReviewSerializer(cerf, many=True)
        return Response({'message':'員工反饋獲取成功', 'data':serializer.data}, status=status.HTTP_200_OK)
    except models.CompanyEmployeeFeedBackReview.DoesNotExist as e:
        return Response({'message':'員工反饋獲取失敗', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'員工反饋獲取失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def getCompanyEmployeeFeedbackReview(request, pk):
    try:
        cerf = models.CompanyEmployeeFeedBackReview.objects.filter(feedback_to=pk)
        serializer = serializers.CompanyEmployeeFeedBackReviewSerializer(cerf, many=True)
        return Response({'message':'員工反饋獲取成功', 'data':serializer.data}, status=status.HTTP_200_OK)
    except models.CompanyEmployeeFeedBackReview.DoesNotExist as e:
        return Response({'message':'員工反饋獲取失敗', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'員工反饋獲取失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

nlp = spacy.load('en_core_web_sm')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recommendations(request):
    job_id = request.GET.get('job_id')

    if not job_id:
        return JsonResponse({'error': 'Missing job_id parameter'}, status=400)

    try:
        job = CompanyRecruitment.objects.get(pk=job_id)
    except CompanyRecruitment.DoesNotExist:
        return JsonResponse({'error': 'Job not found'}, status=404)

    job_requirements = job.requirement
    applicationRecord = UserApplicationRecord.objects.filter(companyRecruitment_id__id=job_id)

    candidates = []
    for record in applicationRecord:
        candidates.append(record.userResume_id)
    
    # 使用 spaCy 进行文本预处理和计算相似度
    job_doc = nlp(job_requirements)
    candidate_docs = [nlp(c.summary + ' ' + c.experience + ' ' + c.education + ' ' + c.skills) for c in candidates]

    tfidf_vectorizer = TfidfVectorizer()
    tfidf_matrix = tfidf_vectorizer.fit_transform([job_doc.text] + [doc.text for doc in candidate_docs])
    tfidf_similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()

    # 排序相似度
    similar_candidates = [
        {
            'resume_id': candidate.id,
            'similarity_score': sim_score,
            'resume_text': candidate.summary + ' ' + candidate.experience + ' ' + candidate.education + ' ' + candidate.skills
        }
        for candidate, sim_score in zip(candidates, tfidf_similarities)
    ]

    similar_candidates.sort(key=lambda x: x['similarity_score'], reverse=True)

    return JsonResponse({'job_requirements': job_requirements, 'candidates': similar_candidates})


def compute_cost(x, y, w, b):
  y_pred = (x * w).sum(axis=1) + b
  cost = ((y - y_pred)**2).mean()
  return cost

def compute_gradient(x, y, w, b):
  y_pred = (x*w).sum(axis=1) + b
  b_gradient = (y_pred - y).mean()
  w_gradient = np.zeros(x.shape[1])
  for i in  range(x.shape[1]):
    w_gradient[i] = (x[:, i] * (y_pred-y)).mean()
  return w_gradient, b_gradient

def gradient_descent(x, y, w_init, b_init, learning_rate, cost_function, gradient_function, run_iter, p_iter=1000):

  c_hist = []
  w_hist = []
  b_hist = []

  w = w_init
  b = b_init
  for i in range(run_iter+1):
    w_gradient, b_gradient = gradient_function(x, y, w, b)

    w = w - w_gradient * learning_rate
    b = b - b_gradient * learning_rate
    cost = cost_function(x, y, w, b)

    w_hist.append(w)
    b_hist.append(b)
    c_hist.append(cost)

    if i%p_iter == 0:
      # print(f"{i:4}")
      # print(f"{i:4}: Cost : {cost: .2f}, w: {w}, b: {b:.2f}, w_gradient: {w_gradient}, b_gradient: {b_gradient: 2.3f}")
      print(f"{i:4}: Cost : {cost: .2f}, b: {b:.2f}, b_gradient: {b_gradient: 2.3f}")
  return w, b, w_hist, b_hist, c_hist

@api_view(['GET'])
@permission_classes([AllowAny])
def calGradients(request):
    try:
        cerf = models.CompanyEmployeeFeedBackReview.objects.all()
        serializer = serializers.CompanyEmployeeFeedBackReviewSerializer(cerf, many=True)
        data_ori = serializer.data
        for item in data_ori:
            item['companyEmployee_id'] = item['companyEmployee_id']['id']
            item['feedback_to'] = item['feedback_to']['id']

        data = pd.DataFrame(data_ori)
        pd.set_option('display.max_columns', None)
        pd.set_option('display.expand_frame_repr', False)

        oneHotEncoder = OneHotEncoder()
        oneHotEncoder.fit(data[['remarks']])
        remarks_encoder = oneHotEncoder.transform(data[['remarks']]).toarray()
        remark_list = data['remarks']
        remark_list = remark_list.unique()
        remark_list.sort()
        data[remark_list] = remarks_encoder

        final_data = data.groupby('feedback_to')[remark_list].sum()
        

        cee = models.CompanyEmployeeEvaluate.objects.all()
        serializer = serializers.CompanyEmployeeEvaluateSerializer(cee, many=True)
        ceeData = serializer.data

        if ceeData == []:
            return Response({'message':'companyEmployeeEvaluate is empty'})
        
        for dd in ceeData:
            dd['remark'] = {
                'g':eval(dd['remark'].split(',b:')[0].split('g:')[1]),
                'b':eval(dd['remark'].split(',b:')[1])
            }
            dd['improvement'] = eval(dd['improvement'])
            

        score_ori = ceeData
        score_ori = pd.DataFrame(score_ori)
        final_score = score_ori[['companyEmployee_id', 'score']]
        data_final = final_data.merge(final_score, left_on='feedback_to', right_on='companyEmployee_id', how='inner')
        y=data_final['score']
        x=data_final[remark_list]

        x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=87)

        x_train = x_train.to_numpy()
        x_test = x_test.to_numpy()

        w = np.array([1]*len(remark_list))
        b = 0
        y_pred = (x_train * w).sum(axis=1)

        # ((y_train - y_pred) ** 2).mean()

        # w = np.array([1]*len(remark_list))
        # b=0
        # compute_cost(x_train, y_train, w, b)

        y_pred = (x_train*w).sum(axis=1) + b
        b_gradient = (y_pred - y_train).mean()
        b_gradient
        w_gradient = np.zeros(x_train.shape[1])

        for i in range(x_train.shape[1]):
            w_gradient[i] = (x_train[:, i]* (y_pred-y_train)).mean()

        # w_gradient, b_gradient

        # w = np.array([1]*len(remark_list))
        # b=0
        # learning_rate = 0.001

        w_init=np.array([0]*len(remark_list))
        b_init=0
        learning_rate = 0.01
        run_iter = 10000
        w_final, b_final, w_hist, b_hist, c_hist = gradient_descent(x_train, y_train, w_init, b_init, learning_rate, compute_cost, compute_gradient, run_iter, p_iter=1000)

        # y_pred = (w_final * x_test).sum(axis=1) + b_final
        # pred = pd.DataFrame({
        #     "y_pred": y_pred,
        #     "y_test": y_test
        # })

        print(w_gradient)
        gradient_instance = models.GradientData(w_gradient=w_final.tolist(), b_gradient=b_final)
        gradient_instance.save()

        return Response({'message':'員工反饋獲取成功', 'data':{'w_final': w_final, 'b_final':b_final}}, status=status.HTTP_200_OK)
    except models.CompanyEmployeeFeedBackReview.DoesNotExist as e:
        return Response({'message':'員工反饋獲取失敗', 'error':str(e)}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'message':'員工反饋獲取失敗', 'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def calEmployeeScore(request, pk):
    try:
        feedback_value_list = ['不尊重多樣性和缺乏包容性', '不積極尋求改進和創新', '不遵守公司政策和程序', '主動學習和成長', '充分滿足客戶需求',
       '創新和提出改進建議', '創造公司利潤', '勤奮工作', '善於溝通和協作', '尊重公司機密和保密政策',
       '尊重多樣性和包容性', '導致公司損失', '工作效率不足', '忽略客戶需求和反饋', '忽略專業發展和學習',
       '承擔錯誤和負責任', '拖延或敷衍工作', '提前完成工作任務', '提升業績', '損害公司財產', '未能按時完成工作任務',
       '未達工作目標', '消極態度', '準時達成工作目標', '無私地捐獻資源給公司', '積極態度', '積極解決問題',
       '細心處理工作', '經常出現錯誤或粗心大意', '經常與同事發生衝突或矛盾', '缺乏團隊合作精神', '缺乏有效溝通和團隊協作',
       '良好的團隊合作精神', '負責任處理工作', '辱罵同事', '逃避責任或找借口', '違反公司的機密和保密政策', '關心同事',
       '頻繁發生問題', '高效率完成工作']
        
        gradient = models.GradientData.objects.order_by('-id').first()
        serializer = serializers.GradientDataSerializer(gradient, many=False)

        print(serializer.data)
        w_gradient = serializer.data['w_gradient']
        b_gradient = serializer.data['b_gradient']

        cerf = models.CompanyEmployeeFeedBackReview.objects.filter(feedback_to=pk)
        serializer = serializers.CompanyEmployeeFeedBackReviewSerializer(cerf, many=True)

        data_real = serializer.data
        for item in data_real:
            item['companyEmployee_id'] = item['companyEmployee_id']['id']
            item['feedback_to'] = item['feedback_to']['id']

        for fv in feedback_value_list:
            row = {'id': 1245, 'companyEmployee_id': data_real[0]['companyEmployee_id'], 'feedback_to': data_real[0]['feedback_to'], 'remarks': data_real[0]['remarks'], 'create_at': data_real[0]['create_at'], 'company_id': data_real[0]['company_id']}
            row['remarks'] = fv
            data_real.append(row)

        data_real = pd.DataFrame(data_real)

        oneHotEncoder = OneHotEncoder()
        oneHotEncoder.fit(data_real[['remarks']])
        remarks_encoder = oneHotEncoder.transform(data_real[['remarks']]).toarray()
        remark_list = data_real['remarks']

        remark_list = remark_list.unique()
        remark_list.sort()
        remark_list

        data_real[remark_list] = remarks_encoder

        data_real = data_real.groupby('feedback_to')[remark_list].sum()
        data_real[remark_list] = data_real[remark_list]-1

        x=data_real[remark_list]
        x = x.to_numpy()

        score = (w_gradient * x).sum(axis=1) + b_gradient
        score[0]
        print(score[0])
        
        return Response({'data': score[0]})
    except models.GradientData.DoesNotExist as e:
        return Response({'message':'分數計算失敗', 'error': str(e)})
    except Exception as e:
        return Response({'message':'分數計算失敗', 'error':str(e)}) 