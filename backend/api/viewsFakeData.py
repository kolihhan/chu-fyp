from django.contrib.auth.models import User
from . import models, serializers
from faker import Faker
import random
import datetime
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.utils import timezone

fake = Faker('zh_TW')  # 使用中文假資料

jobs = {
     "軟體工程師": {
        "Description": "負責開發高質量的軟體，參與軟體設計和編碼，解決技術問題和優化現有系統。",
        "Requirement": "計算機科學或相關學位，熟悉Python、Java或C++，具備敏捷開發經驗。"
    },
    "數據分析師": {
        "Description": "分析大量數據以提供業務洞察，建立和擴展數據模型，並解釋數據趨勢。",
        "Requirement": "數學、統計學或相關學位，精通SQL、R或Python，具備數據可視化和報告經驗。"
    },
    "UI/UX設計師": {
        "Description": "負責設計使用者友好的產品界面，理解用戶需求並創造令人愉悅的用戶體驗。",
        "Requirement": "視覺設計或相關學位，熟悉設計工具如Sketch或Adobe XD，具備原型設計技能。"
    },
    "行銷經理": {
        "Description": "設計和執行市場營銷策略，管理市場推廣活動，監督市場部門運營和團隊管理。",
        "Requirement": "市場營銷、商業管理或相關學位，具有市場分析和領導管理經驗，良好的溝通技巧。"
    },
    "產品經理": {
        "Description": "負責產品規劃和開發，收集用戶需求，協調開發團隊以實現產品目標。",
        "Requirement": "產品管理、商業或相關學位，了解敏捷開發流程，具備產品策略和分析能力。"
    },
    "系統架構師": {
        "Description": "設計複雜系統架構，解決技術問題，確保系統的穩定性和擴展性。",
        "Requirement": "計算機科學或相關學位，熟悉雲端技術和大型系統設計，具有解決方案設計經驗。"
    },
    "網頁開發工程師": {
        "Description": "開發並維護高品質的網頁應用，負責前端開發和網站性能優化。",
        "Requirement": "軟體工程或相關學位，精通HTML、CSS和JavaScript，熟悉React或Vue框架。"
    },
    "前端工程師": {
        "Description": "負責開發和維護用戶界面，協作設計師和後端工程師以實現前端功能。",
        "Requirement": "軟體工程或相關學位，熟悉JavaScript、jQuery和前端框架，良好的團隊合作能力。"
    },
    "後端工程師": {
        "Description": "負責後端系統設計和開發，優化數據庫性能和API設計。",
        "Requirement": "軟體工程或相關學位，熟悉Python、Node.js或Java，具備數據庫和系統設計經驗。"
    },
    "項目經理": {
        "Description": "管理項目進度和預算，協調各部門合作，解決項目執行中的問題。",
        "Requirement": "項目管理、商業或相關學位，具有項目管理和團隊管理技能。"
    },
    "數據工程師": {
        "Description": "設計和構建數據管道，處理和轉換大量數據，確保數據的準確性和可用性。",
        "Requirement": "計算機科學、數學或相關學位，熟悉ETL流程、大數據工具和數據庫技術。"
    },
    "軟體測試工程師": {
        "Description": "負責軟體測試計劃和執行，發現和解決軟體缺陷，提高產品質量。",
        "Requirement": "軟體工程、資訊技術或相關學位，熟悉測試工具和自動化測試，具備測試規劃能力。"
    },
    "人工智慧工程師": {
        "Description": "設計和開發人工智慧解決方案，應用機器學習和深度學習技術解決問題。",
        "Requirement": "計算機科學、人工智慧或相關學位，精通Python和機器學習框架，有相關項目經驗。"
    },
    "商業分析師": {
        "Description": "分析業務需求，提供解決方案，轉化數據為業務洞察和策略。",
        "Requirement": "商業管理、數學或相關學位，具有數據分析和業務理解能力，良好的溝通技巧。"
    },
    "電子商務經理": {
        "Description": "管理電子商務平台，促進線上銷售，制定營銷策略和產品推廣計劃。",
        "Requirement": "電子商務、市場營銷或相關學位，具有電商運營經驗和數據分析能力。"
    },
    "品牌經理": {
        "Description": "管理和推廣品牌形象，制定品牌策略，開展品牌推廣活動。",
        "Requirement": "市場營銷、品牌管理或相關學位，具有品牌管理和市場策略規劃經驗。"
    },
    "客戶關係主管": {
        "Description": "管理客戶關係團隊，提供卓越的客戶服務，維護客戶關係並開發新客戶。",
        "Requirement": "商業管理、市場營銷或相關學位，有客戶服務和管理經驗。"
    },
    "運營經理": {
        "Description": "負責日常運營，管理團隊和資源，優化運營流程以實現業務目標。",
        "Requirement": "商業管理、運營管理或相關學位，具有運營管理和領導能力。"
    },
    "安全工程師": {
        "Description": "負責網絡和系統安全，檢測和防範安全威脅，制定安全策略和方案。",
        "Requirement": "資訊安全、計算機科學或相關學位，熟悉安全技術和漏洞分析，具備安全認證者優先。"
    },
    "大數據分析師": {
        "Description": "分析和解釋大數據，提供業務洞察，開發大數據解決方案。",
        "Requirement": "統計學、數學或相關學位，精通大數據工具和技術，具備數據挖掘和建模能力。"
    },
    "資訊技術經理": {
        "Description": "負責管理資訊技術團隊，規劃和執行IT策略，確保IT運營和安全。",
        "Requirement": "資訊技術管理、計算機科學或相關學位，具有領導技能和IT專業知識。"
    },
    "專案經理": {
        "Description": "負責專案規劃和執行，管理預算和資源，確保專案按時交付和高質量。",
        "Requirement": "專案管理、商業管理或相關學位，具備專案管理和溝通協調能力。"
    },
    "互聯網產品經理": {
        "Description": "負責互聯網產品策略和開發，與團隊合作實現產品目標。",
        "Requirement": "產品管理、市場營銷或相關學位，了解互聯網產品和用戶體驗設計。"
    },
    "數據庫管理員": {
        "Description": "管理數據庫系統，維護和優化數據庫性能和安全。",
        "Requirement": "數據庫管理、計算機科學或相關學位，具有數據庫管理和備份恢復經驗。"
    },
    "機器學習工程師": {
        "Description": "設計和實現機器學習模型，進行模型訓練和優化。",
        "Requirement": "機器學習、計算機科學或相關學位，精通機器學習算法和Python編程。"
    },
    "資訊安全專家": {
        "Description": "負責監測和保護信息系統的安全，進行風險評估和安全漏洞修復。",
        "Requirement": "資訊安全、計算機科學或相關學位，具有安全威脅分析和安全策略制定經驗。"
    },
    "軟體設計師": {
        "Description": "設計軟體架構，開發和測試軟體解決方案，解決複雜的技術問題。",
        "Requirement": "軟體工程、計算機科學或相關學位，具備軟體設計和編碼能力。"
    },
    "系統分析師": {
        "Description": "分析和評估企業系統需求，設計和實施信息系統解決方案。",
        "Requirement": "資訊管理、系統分析或相關學位，具有系統分析和需求收集能力。"
    },
    "網絡工程師": {
        "Description": "設計和維護企業網絡架構，解決網絡問題和改進性能。",
        "Requirement": "網絡工程、計算機科學或相關學位，精通網絡協議和設備配置。"
    }
}

summaries = {
    "軟體工程師": "我是一位具有軟體開發經驗的專業人士，擁有解決技術問題和編碼的能力。我的專業背景使我能夠參與軟體設計和開發高質量的軟體產品。對Python、Java或C++有豐富的編程經驗。",
    "數據分析師": "我是一位數據分析師，擅長分析大量數據並提供業務洞察。我的專業知識使我能夠建立和擴展數據模型，並利用SQL、R或Python解釋數據趨勢。",
    "UI/UX設計師": "作為UI/UX設計師，我注重創造使用者友好的產品界面。我具有視覺設計背景，能夠理解用戶需求並實現令人愉悅的用戶體驗。",
    "行銷經理": "作為行銷經理，我負責設計和執行市場營銷策略，管理市場推廣活動，監督市場部門運營和團隊管理。",
    "產品經理": "我是產品經理，負責產品規劃和開發，收集用戶需求，協調開發團隊以實現產品目標。",
    "系統架構師": "作為系統架構師，我負責設計複雜系統架構，解決技術問題，確保系統的穩定性和擴展性。",
    "網頁開發工程師": "我是網頁開發工程師，開發並維護高品質的網頁應用，負責前端開發和網站性能優化。",
    "前端工程師": "作為前端工程師，我負責開發和維護用戶界面，協作設計師和後端工程師以實現前端功能。",
    "後端工程師": "我是後端工程師，負責後端系統設計和開發，優化數據庫性能和API設計。",
    "項目經理": "作為項目經理，我管理項目進度和預算，協調各部門合作，解決項目執行中的問題。",
    "數據工程師": "我是數據工程師，負責設計和構建數據管道，處理和轉換大量數據，確保數據的準確性和可用性。",
    "軟體測試工程師": "作為軟體測試工程師，我負責軟體測試計劃和執行，發現和解決軟體缺陷，提高產品質量。",
    "人工智慧工程師": "我是人工智慧工程師，設計和開發人工智慧解決方案，應用機器學習和深度學習技術解決問題。",
    "商業分析師": "作為商業分析師，我分析業務需求，提供解決方案，轉化數據為業務洞察和策略。",
    "電子商務經理": "我是電子商務經理，管理電子商務平台，促進線上銷售，制定營銷策略和產品推廣計劃。",
    "品牌經理": "作為品牌經理，我管理和推廣品牌形象，制定品牌策略，開展品牌推廣活動。",
    "客戶關係主管": "作為客戶關係主管，我管理客戶關係團隊，提供卓越的客戶服務，維護客戶關係並開發新客戶。",
    "運營經理": "作為運營經理，我負責日常運營，管理團隊和資源，優化運營流程以實現業務目標。",
    "安全工程師": "作為安全工程師，我負責網絡和系統安全，檢測和防範安全威脅，制定安全策略和方案。",
    "大數據分析師": "我是大數據分析師，分析和解釋大數據，提供業務洞察，開發大數據解決方案。",
    "資訊技術經理": "作為資訊技術經理，我負責管理資訊技術團隊，規劃和執行IT策略，確保IT運營和安全。",
    "專案經理": "作為專案經理，我負責專案規劃和執行，管理預算和資源，確保專案按時交付和高質量。",
    "互聯網產品經理": "我是互聯網產品經理，負責互聯網產品策略和開發，與團隊合作實現產品目標。",
    "數據庫管理員": "作為數據庫管理員，我負責管理數據庫系統，維護和優化數據庫性能和安全。",
    "機器學習工程師": "我是機器學習工程師，設計和實現機器學習模型，進行模型訓練和優化。",
    "資訊安全專家": "作為資訊安全專家，我負責監測和保護信息系統的安全，進行風險評估和安全漏洞修復。",
    "軟體設計師": "作為軟體設計師，我設計軟體架構，開發和測試軟體解決方案，解決複雜的技術問題。",
    "系統分析師": "作為系統分析師，我分析和評估企業系統需求，設計和實施信息系統解決方案。",
    "網絡工程師": "作為網絡工程師，我設計和維護企業網絡架構，解決網絡問題和改進性能。",
    "電子商務專員": "我是電子商務專員，管理電子商務平台日常運營，協調相關部門完成銷售目標。"
}

majors = [
    "Computer Science",
    "Data Science",
    "Software Engineering",
    "Information Technology",
    "Business Analytics",
    # Add more majors as needed
]

# List of possible skills
possible_skills = {
    "軟體工程師": [
        "Programming Languages (e.g., Python, Java, C++)",
        "Software Development Lifecycle",
        "Algorithms and Data Structures",
        "Problem Solving",
        "Version Control (e.g., Git)"
    ],
    "數據分析師": [
        "Data Analysis and Visualization Tools (e.g., Python/R, Tableau, Power BI)",
        "SQL and Database Management",
        "Statistical Analysis",
        "Data Cleaning and Preprocessing",
        "Critical Thinking"
    ],
    "UI/UX設計師": [
        "User Interface (UI) Design Principles",
        "User Experience (UX) Design Principles",
        "Prototyping Tools (e.g., Adobe XD, Sketch, Figma)",
        "Interaction Design",
        "User Research Methods"
    ],
    "行銷經理": [
        "Digital Marketing Strategies",
        "Market Research and Analysis",
        "Content Creation and Copywriting",
        "SEO and SEM Knowledge",
        "Marketing Analytics"
    ],
    "產品經理": [
        "Product Development Lifecycle",
        "Market Analysis and User Research",
        "Project Management Skills",
        "Stakeholder Management",
        "Roadmapping and Prioritization"
    ],
    "系統架構師": [
        "System Design and Architecture",
        "Cloud Computing Platforms (e.g., AWS, Azure)",
        "Networking and Infrastructure Knowledge",
        "Security Best Practices",
        "Scalability and Performance Optimization"
    ],
    "網頁開發工程師": [
        "HTML, CSS, JavaScript",
        "Frontend Frameworks (e.g., React, Angular, Vue.js)",
        "Backend Technologies (e.g., Node.js, Django, Ruby on Rails)",
        "RESTful APIs",
        "Web Development Best Practices"
    ]
    # Add more as needed
}

start_at_days = 30
offered_at_days = 10
close_at_days = 7

def generate_random_date(start_range, end_range):
    start_datetime = timezone.make_aware(fake.date_time_between(start_date=start_range, end_date=end_range))
    return start_datetime

# Example usage:
start_date_min = timezone.now() - datetime.timedelta(days=5 * 365)
start_date_max = timezone.now() - datetime.timedelta(days=365)
end_date_max = timezone.now()


def generate_recruitment_data():
    companyList = models.Company.objects.all()
    companyRandom = []

    for company in companyList:
        companyPositionList = models.CompanyEmployeePosition.objects.filter(
            company_id=company
        ).exclude(position_name='Boss')

        if companyPositionList.exists():
            chosen_position = random.choice(companyPositionList)
            companyRandom.append(chosen_position)

    for title, details in jobs.items():

        recruitment = models.CompanyRecruitment.objects.create(
            companyEmployeePosition = random.choice(companyPositionList),
            title=title,
            description=details["Description"],
            requirement=details["Requirement"],
            min_salary=round(random.uniform(30000.00, 80000.00), 2),
            max_salary=round(random.uniform(80000.00, 150000.00), 2),
            responsibilities=fake.boolean(chance_of_getting_true=30),
            location=fake.city(),
            start_at = timezone.now() + datetime.timedelta(days=start_at_days), 
            offered_at = timezone.now() + datetime.timedelta(days=start_at_days+offered_at_days), 
            close_at = timezone.now() + datetime.timedelta(days=start_at_days+offered_at_days+close_at_days), 
            employee_need=fake.random_int(min=1, max=5),
            job_category=fake.random_element(["開發人員", "數據分析", "設計師", "行銷"]),
            job_nature=fake.random_element(["全職", "兼職"]),
            buiness_trip=fake.boolean(),
            working_hour=fake.random_element(["9AM - 5PM", "10AM - 6PM", "Flexible"]),
            leaving_system=fake.random_element(["帶薪休假（PTO）", "彈性工作時間", "固定工時制度"])
        )
        print(f"Hi { title}")

num_skills_per_user = 5  # Change this number to fit your requirement
def generate_skills(position,num_skills):
    return random.sample(possible_skills[position], num_skills)

def generate_user_resumes(num_resumes = 100):
    for i in range(num_resumes):
        
        registerData = {
              "email": f"recruiterPerson{i}@gmail.com",
              "password": f"recruiterPerson{i}@gmail.com",
              "name": fake.name(),
              "gender": fake.random_element(["Male", "Female"]),
              "birthday": fake.date_of_birth(minimum_age=18, maximum_age=40),  # 創建18到70歲之間的假生日
              "address": "-",
              "phone": "-",
              "avatar_url": "",
              'type' : "Employee"
          }
        user = models.UserAccount.objects.create(**registerData)

        
        position = fake.random_element(["軟體工程師", "數據分析師", "UI/UX設計師", "行銷經理"])  # 隨機職位
        summary = summaries.get(position, "簡介未提供")  # 得到職位對應的簡介或使用預設值
        
        experience_data = {
            "we_company_name": fake.company(),
            "position": position,
            "job_nature": fake.random_element(["全職", "兼職"]),
            "start_date": generate_random_date(start_date_min, start_date_max),
            "end_date": generate_random_date(start_date_max, end_date_max),
            "still_employed": fake.boolean(),
            "working_desc": fake.text()
        }
        education_data = {
            "school_name": '中華大學',
            "department_name": fake.random_element(majors),  # 從 majors 中隨機選擇系所名稱
            "start_date": generate_random_date(start_date_min, start_date_max),
            "end_date": generate_random_date(start_date_max, end_date_max),
            "educational_qualifications": fake.random_element([
                "PhD", "Master", "Degree", "Diploma", "High School", "Higher vocational education"]),
            "school_status": fake.random_element(["graduated", "studying", "drop out of school"])
        }
        
        # Generate skills for the user
        user_skills = generate_skills(position,num_skills_per_user)


        working_experience = models.WorkingExperience.objects.create(
            we_user=user,
            **experience_data
        )
        education = models.Education.objects.create(
            edu_user=user,
            **education_data
        )
        
        getUser = models.UserResume.objects.create(
            user=user,
            title=position,
            summary=summary,
            experience=working_experience,
            education=education,
            skills=user_skills  # Assign generated skills here
        )

        apply_for_recruitment(getUser)


def apply_for_recruitment(user_resume):
    if user_resume:
        company_recruitments = models.CompanyRecruitment.objects.all()

        for i in range(5):  # Applying for 5 recruitments as an example
            recruitment = random.choice(company_recruitments)
            status = random.choice(['Pending', 'Accept', 'Reject', 'Interviewing', 'Offering', 'Withdrawn'])
            application = models.UserApplicationRecord.objects.create(
                user=user_resume.user,
                userResume_id=user_resume,
                companyRecruitment_id=recruitment,
                status=status
            )
            print(f"Application created: {application}")
    else:
        print("No user resume found for the user.")


@api_view(['POST'])
@permission_classes([AllowAny])
def createUserAndRecruitement(request):
    try:
        generate_recruitment_data()
        generate_user_resumes()
        return Response("Account Resume CompanyRecruitment Done", status=status.HTTP_201_CREATED)
    except Exception as e:
        # Log or handle the exception
        return Response(f"Error: {e}", status=status.HTTP_400_BAD_REQUEST)