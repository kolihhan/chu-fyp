import json

from django.contrib.auth import get_user_model
from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager,
                                        Group, Permission, PermissionsMixin)
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.models import TokenUser
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import BlacklistMixin, RefreshToken, Token

# Create your models here.

#Diff between auto_now and auto_now_add
#auto_now_add : 只執行一次
#auto_now : 每次都會執行

# 用戶資料模型
class UserAccountManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
class UserAccount(AbstractBaseUser, PermissionsMixin):

    groups = models.ManyToManyField(
        Group,
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name='user_accounts' # add this
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name='user_accounts' # add this
    )

    type = models.CharField(default="Employee")
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10)
    birthday = models.DateField()
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    avatar_url = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

    def get_full_name(self):
        return self.name

# 用戶履歷模型
class UserResume(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    title = models.CharField(max_length=15)
    summary = models.TextField()
    experience = models.OneToOneField('WorkingExperience', blank=True, null=True, on_delete=models.SET_NULL, related_name="ur_we")
    education = models.OneToOneField('Education', blank=True, null=True, on_delete=models.SET_NULL, related_name="ur_edu")
    skills = models.JSONField(blank=True, null=True)
    prefer_work = models.JSONField(blank=True, null=True)
    language = models.JSONField(blank=True, null=True)
    # experience = models.TextField()
    # education = models.TextField()
    # skills = models.TextField()
    # prefer_work = models.TextField(default="High Salary")
    # language = models.TextField(default="Chinese")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


# 用戶面試申請模型
class UserApplicationRecord(models.Model):
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    userResume_id = models.ForeignKey(UserResume, on_delete=models.CASCADE)
    companyRecruitment_id = models.ForeignKey('CompanyRecruitment', on_delete=models.CASCADE)
    status = models.CharField(choices=[
        ("Pending", "Pending"),             # 受理中
        ("Accept", "Accept"),               # 被接受
        ("Reject","Reject"),                # 被拒絕
        ("Interviewing","Interviewing"),    # 面試中 
        ("Offering", "Offering"),           # 給Offer
        ("Withdrawn","Withdrawn")           # user自己撤回
    ])
    create_at = models.DateTimeField(auto_now_add=True)

    
# 用戶面試成功模型
class UserOfferRecord(models.Model):
    userApplicationRecord_id = models.ForeignKey(UserApplicationRecord, on_delete=models.CASCADE)
    expected_salary = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    provided_salary = models.DecimalField(max_digits=10, decimal_places=2)
    contract_duration = models.TimeField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(blank=True, null=True)
    create_at = models.DateTimeField(auto_now_add=True)

    
# 公司模型
class Company(models.Model):
    name = models.CharField()
    boss_id = models.ForeignKey('UserAccount', on_delete=models.CASCADE, related_name='boss')
    email = models.CharField()
    phone = models.CharField(max_length=20)
    address = models.CharField()
    company_desc = models.TextField()
    company_benefits = models.TextField()
    logo = models.TextField(default="", null=True, blank=True)
    industry = models.TextField(default="-")
    employeeCount = models.PositiveIntegerField(default=1, null=True, blank=True)
    website = models.CharField(default="-", null=True, blank=True)
    contact = models.CharField(default="-", null=True, blank=True)
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name

class CompanyImages(models.Model):
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='comapny_images')
    image = models.TextField()
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.image

# 公司員工資料模型
class CompanyEmployee(models.Model):
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    user_id = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    companyEmployeePosition_id = models.ForeignKey('CompanyEmployeePosition', on_delete=models.CASCADE)
    salary = models.DecimalField(max_digits=10, decimal_places=2)
    skills = models.JSONField(blank=True, null=True)
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    end_date = models.DateTimeField(null=True, blank=True)
    def __str__(self):
        return str(self.user_id)

# 公司職位模型
class CompanyEmployeePosition(models.Model):
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    position_name = models.CharField()
    companyDepartment_id = models.ForeignKey('CompanyDepartment', on_delete=models.CASCADE)
    companyPermission_id = models.ManyToManyField('CompanyPermission', blank=True)
    companyBenefits_id = models.ManyToManyField('CompanyBenefits', blank=True)
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.id}"

# 公司部門模型
class CompanyDepartment(models.Model):
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    department_name = models.CharField()
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.id}"

# 公司權限模型
class CompanyPermission(models.Model):
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    permission_name = models.CharField()
    permission_desc = models.TextField(blank=True, null=False)
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.id}"

# 公司招聘模型
class CompanyRecruitment(models.Model):
    companyEmployeePosition = models.ForeignKey('CompanyEmployeePosition', on_delete=models.CASCADE)
    title = models.CharField()
    description = models.TextField()
    requirement = models.TextField()
    min_salary = models.DecimalField(max_digits=10, decimal_places=2)
    max_salary = models.DecimalField(max_digits=10, decimal_places=2)
    responsibilities = models.BooleanField()
    location = models.TextField()
    start_at = models.DateTimeField()       # 開始工作的日期
    offered_at = models.DateTimeField() 
    close_at = models.DateTimeField()       # 過時就不顯示在應聘者
    employee_need = models.PositiveIntegerField()
    job_category = models.TextField()       # 職務類別（服務人員/開發人員/門市店員）
    job_nature = models.TextField()         # 工作性質（全職/parttime）
    buiness_trip = models.BooleanField()    # 出差
    working_hour = models.TextField()       # 上班時段
    leaving_system = models.TextField()     # 休假制度
    def __str__(self):
        return f"{self.id}"

# 公司福利模型
class CompanyBenefits(models.Model):
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    benefit_name = models.TextField()
    benefit_desc = models.TextField()
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.id}"
    
# 公司員工升遷記錄模型
class CompanyPromotionRecord(models.Model):
    companyEmployee_id = models.ForeignKey(CompanyEmployee, on_delete=models.CASCADE)
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    previous_position = models.ForeignKey(CompanyEmployeePosition, on_delete=models.CASCADE, blank=True, null=True, related_name='previous_position')
    new_position = models.ForeignKey(CompanyEmployeePosition, on_delete=models.CASCADE, blank=True, null=True, related_name='new_position')
    description = models.TextField()
    remarks = models.TextField()
    create_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.id}"

# 公司員工表現模型
class CompanyEmployeePerformanceReview(models.Model):
    companyEmployee_id = models.ForeignKey(CompanyEmployee, on_delete=models.CASCADE)
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    description = models.TextField()
    remarks = models.TextField()
    create_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.id}"

# 公司培訓模型
class CompanyTraining(models.Model):
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    title = models.TextField()
    description = models.TextField()
    trainer = models.ForeignKey(CompanyEmployee, on_delete=models.CASCADE)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    create_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.id}"

# 公司員工培訓模型
class CompanyEmployeeTraining(models.Model):
    companyEmployee_id = models.ForeignKey(CompanyEmployee, on_delete=models.CASCADE)
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    companyTraining_id = models.ForeignKey(CompanyTraining, on_delete=models.CASCADE)
    training_result = models.CharField()
    create_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.id}"

# 公司員工回饋模型
class CompanyEmployeeFeedBackReview(models.Model):
    companyEmployee_id = models.ForeignKey(CompanyEmployee, on_delete=models.CASCADE, related_name='feebback_from')
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    feedback_to = models.ForeignKey(CompanyEmployee, on_delete=models.CASCADE, related_name='feerback_to')  
    remarks = models.TextField()
    create_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.id}"

# 公司打卡模型
class CompanyCheckIn(models.Model):
    companyEmployee_id = models.ForeignKey(CompanyEmployee, on_delete=models.CASCADE)
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    create_at = models.DateTimeField(auto_now_add=True)
    type = models.CharField(default="Check In")
    def __str__(self):
        return str(self.user_id)

# 公司打卡規則模型
class companyCheckInRule(models.Model):
    company_id = models.ForeignKey('Company', on_delete=models.CASCADE)
    work_time_start = models.TimeField()
    work_time_end = models.TimeField()
    late_tolerance = models.DurationField() # 可容許的遲到範圍 # exp: 9點上班，9點半到不算遲到 # HH:MM:SS
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return str(self.company_id)

# 公司公告群組模型
class CompanyAnnouncementGroup(models.Model):
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    companyEmployee_id = models.ManyToManyField(CompanyEmployee, blank=True)
    name = models.CharField()
    description = models.TextField(blank=True, null=True)
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return str(self.name)

# 公司公告模型
class CompanyAnnouncement(models.Model):
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    companyEmployee_id = models.ForeignKey(CompanyEmployee, on_delete=models.CASCADE)
    title = models.CharField()
    content = models.TextField()
    group = models.ManyToManyField(CompanyAnnouncementGroup, blank=True)
    create_at = models.DateTimeField(auto_now_add=True)
    update_at = models.DateTimeField(auto_now=True)
    expire_at = models.DateTimeField(blank=True, null=True)
    def __str__(self):
        return str(self.company_id)

class CompanyEmployeeEvaluate(models.Model):
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    companyEmployee_id = models.ForeignKey(CompanyEmployee, on_delete=models.CASCADE)
    score = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    remark = models.TextField(null=True, blank=True)
    improvement = models.TextField(null=True, blank=True)
    date = models.DateField(auto_now_add=True)

class CompanyEmployeeLeaveRecord(models.Model):
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    companyEmployee_id = models.ForeignKey(CompanyEmployee, on_delete=models.CASCADE)
    reason = models.TextField(null=True, blank=True)
    type = models.CharField(choices=[
        ("Annual Leave", "Annual Leave"),
        ("Sick Leave", "Sick Leave"),
        ("Personal Leave", "Personal Leave"),
        ("Maternity Leave", "Maternity Leave"),
        ("Paternity Leave", "Paternity Leave"),
    ])
    status = models.CharField(choices=[
        ("Pending", "Pending"),
        ("Accept", "Accept"),
        ("Reject","Reject"),
        ("Cancel","Cancel"),
    ])
    leave_start = models.DateTimeField()
    leave_end = models.DateTimeField()
    comment = models.TextField(null=True, blank=True)
    apply_at = models.DateTimeField(auto_now_add=True)
    approve_at = models.DateTimeField(null=True, blank=True)
    update_at = models.DateTimeField(auto_now=True)

class GradientData(models.Model):
    w_gradient = models.JSONField()
    b_gradient = models.FloatField()

class RecommendOptions(models.Model): # recommend option when fill into skills, prefered work, language, ...
    # user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    option_name = models.CharField()
    type = models.CharField()
    create_at = models.DateTimeField(auto_now=True)

class WorkingExperience(models.Model):
    we_user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    we_company_name = models.CharField()
    position = models.CharField()
    job_nature = models.CharField() #全職/兼職
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    still_employed = models.BooleanField()
    working_desc = models.TextField()

class Education(models.Model):
    edu_user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    school_name = models.CharField()
    department_name = models.CharField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    educational_qualifications = models.CharField(choices=[
        ("PhD", "PhD"),
        ("Master", "Master"),
        ("Degree", "Degree"),
        ("Diploma", "Diploma"),
        ("High School", "High School"),
        ("Higher vocational education", "Higher vocational education"),
        ("Junior high school (inclusive) and below", "Junior high school (inclusive) and below")
    ], default="Degree")
    school_status = models.CharField(default="graduated", choices=[
        ("graduated", "graduated"),
        ("studying", "studying"),
        ("drop out of school", "drop out of school")
    ])

class TaskForce(models.Model):
    company_id = models.ForeignKey(Company, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField()
    created_date = models.DateTimeField(auto_now_add=True)
    leader = models.ForeignKey(CompanyEmployee, on_delete=models.SET_NULL, null=True)  # 添加負責人字段，關聯到用戶模型，負責人可以為空
    goals = models.TextField()  # 添加目標字段，用於記錄Task Force的目標或使命
    deadline = models.DateField(null=True, blank=True)  # 添加截止日期字段，可以為空
    status = models.CharField(
        max_length=50,
        choices=[
            ("Planning", "策劃中"),
            ("In Progress", "進行中"),
            ("Completed", "已完成")
        ],
        default="Planning"  # 添加狀態字段，並指定默認狀態為"策劃中"
    )
    priority = models.CharField(
        max_length=50,
        choices=[
            ("Low", "低"),
            ("Medium", "中"),
            ("High", "高"),
            ("Emergency", "緊急")  # 添加"Emergency"選項
        ],
        default="Medium"
    )

    def __str__(self):
        return self.name


class Task(models.Model):
    task_force = models.ForeignKey(TaskForce, on_delete=models.CASCADE)
    task_name = models.CharField(max_length=255)
    task_description = models.TextField()
    assignee = models.ForeignKey(CompanyEmployee, on_delete=models.SET_NULL, null=True)  # 關聯到用戶模型，負責人可以為空
    status = models.CharField(max_length=50, choices=[("Pending", "待處理"), ("In Progress", "進行中"), ("Completed", "已完成")])
    due_date = models.DateField()
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.task_name
