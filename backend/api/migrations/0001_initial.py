# Generated by Django 4.2 on 2023-11-07 13:41

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField()),
                ('email', models.CharField()),
                ('phone', models.CharField(max_length=20)),
                ('address', models.CharField()),
                ('company_desc', models.TextField()),
                ('company_benefits', models.TextField()),
                ('logo', models.TextField(blank=True, default='', null=True)),
                ('industry', models.TextField(default='-')),
                ('employeeCount', models.PositiveIntegerField(blank=True, default=1, null=True)),
                ('website', models.CharField(blank=True, default='-', null=True)),
                ('contact', models.CharField(blank=True, default='-', null=True)),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='CompanyBenefits',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('benefit_name', models.TextField()),
                ('benefit_desc', models.TextField()),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company')),
            ],
        ),
        migrations.CreateModel(
            name='CompanyDepartment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('department_name', models.CharField()),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company')),
            ],
        ),
        migrations.CreateModel(
            name='CompanyEmployee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('salary', models.DecimalField(decimal_places=2, max_digits=10)),
                ('skills', models.JSONField(blank=True, null=True)),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('end_date', models.DateTimeField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='CompanyEmployeePosition',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('position_name', models.CharField()),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('companyBenefits_id', models.ManyToManyField(blank=True, to='api.companybenefits')),
                ('companyDepartment_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companydepartment')),
            ],
        ),
        migrations.CreateModel(
            name='CompanyRecruitment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField()),
                ('description', models.TextField()),
                ('requirement', models.TextField()),
                ('min_salary', models.DecimalField(decimal_places=2, max_digits=10)),
                ('max_salary', models.DecimalField(decimal_places=2, max_digits=10)),
                ('responsibilities', models.BooleanField()),
                ('location', models.TextField()),
                ('start_at', models.DateTimeField()),
                ('offered_at', models.DateTimeField()),
                ('close_at', models.DateTimeField()),
                ('employee_need', models.PositiveIntegerField()),
                ('job_category', models.TextField()),
                ('job_nature', models.TextField()),
                ('buiness_trip', models.BooleanField()),
                ('working_hour', models.TextField()),
                ('leaving_system', models.TextField()),
                ('companyEmployeePosition', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companyemployeeposition')),
            ],
        ),
        migrations.CreateModel(
            name='Education',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('school_name', models.CharField()),
                ('department_name', models.CharField()),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('educational_qualifications', models.CharField(choices=[('PhD', 'PhD'), ('Master', 'Master'), ('Degree', 'Degree'), ('Diploma', 'Diploma'), ('High School', 'High School'), ('Higher vocational education', 'Higher vocational education'), ('Junior high school (inclusive) and below', 'Junior high school (inclusive) and below')], default='Degree')),
                ('school_status', models.CharField(choices=[('graduated', 'graduated'), ('studying', 'studying'), ('drop out of school', 'drop out of school')], default='graduated')),
            ],
        ),
        migrations.CreateModel(
            name='GradientData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('w_gradient', models.JSONField()),
                ('b_gradient', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='RecommendOptions',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('option_name', models.CharField()),
                ('type', models.CharField()),
                ('create_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='UserAccount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('type', models.CharField(default='Employee')),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('name', models.CharField(max_length=255)),
                ('gender', models.CharField(max_length=10)),
                ('birthday', models.DateField()),
                ('address', models.CharField(max_length=255)),
                ('phone', models.CharField(max_length=20)),
                ('avatar_url', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_accounts', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_accounts', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='UserApplicationRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Accept', 'Accept'), ('Reject', 'Reject'), ('Interviewing', 'Interviewing'), ('Offering', 'Offering'), ('Withdrawn', 'Withdrawn')])),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('companyRecruitment_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companyrecruitment')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.useraccount')),
            ],
        ),
        migrations.CreateModel(
            name='WorkingExperience',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('we_company_name', models.CharField()),
                ('position', models.CharField()),
                ('job_nature', models.CharField()),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('still_employed', models.BooleanField()),
                ('working_desc', models.TextField()),
                ('we_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.useraccount')),
            ],
        ),
        migrations.CreateModel(
            name='UserResume',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=15)),
                ('summary', models.TextField()),
                ('skills', models.JSONField(blank=True, null=True)),
                ('prefer_work', models.JSONField(blank=True, null=True)),
                ('language', models.JSONField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('education', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='ur_edu', to='api.education')),
                ('experience', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='ur_we', to='api.workingexperience')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.useraccount')),
            ],
        ),
        migrations.CreateModel(
            name='UserOfferRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('expected_salary', models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True)),
                ('provided_salary', models.DecimalField(decimal_places=2, max_digits=10)),
                ('contract_duration', models.TimeField()),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField(blank=True, null=True)),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('userApplicationRecord_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.userapplicationrecord')),
            ],
        ),
        migrations.AddField(
            model_name='userapplicationrecord',
            name='userResume_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.userresume'),
        ),
        migrations.CreateModel(
            name='TaskForce',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('goals', models.TextField()),
                ('deadline', models.DateField(blank=True, null=True)),
                ('status', models.CharField(choices=[('Planning', '策劃中'), ('In Progress', '進行中'), ('Completed', '已完成')], default='Planning', max_length=50)),
                ('priority', models.CharField(choices=[('Low', '低'), ('Medium', '中'), ('High', '高'), ('Emergency', '緊急')], default='Medium', max_length=50)),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company')),
                ('leader', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.companyemployee')),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('task_name', models.CharField(max_length=255)),
                ('task_description', models.TextField()),
                ('status', models.CharField(choices=[('Pending', '待處理'), ('In Progress', '進行中'), ('Completed', '已完成')], max_length=50)),
                ('due_date', models.DateField()),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('assignee', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.companyemployee')),
                ('task_force', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.taskforce')),
            ],
        ),
        migrations.AddField(
            model_name='education',
            name='edu_user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.useraccount'),
        ),
        migrations.CreateModel(
            name='CustomOutstandingToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.CharField(db_index=True, max_length=255, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='outstanding_tokens', to='api.useraccount')),
            ],
        ),
        migrations.CreateModel(
            name='CompanyTraining',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField()),
                ('description', models.TextField()),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company')),
                ('trainer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companyemployee')),
            ],
        ),
        migrations.CreateModel(
            name='CompanyPromotionRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('remarks', models.TextField()),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('companyEmployee_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companyemployee')),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company')),
                ('new_position', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='new_position', to='api.companyemployeeposition')),
                ('previous_position', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='previous_position', to='api.companyemployeeposition')),
            ],
        ),
        migrations.CreateModel(
            name='CompanyPermission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('permission_name', models.CharField()),
                ('permission_desc', models.TextField(blank=True)),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company')),
            ],
        ),
        migrations.CreateModel(
            name='CompanyImages',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.TextField()),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comapny_images', to='api.company')),
            ],
        ),
        migrations.CreateModel(
            name='CompanyEmployeeTraining',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('training_result', models.CharField()),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('companyEmployee_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companyemployee')),
                ('companyTraining_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companytraining')),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company')),
            ],
        ),
        migrations.AddField(
            model_name='companyemployeeposition',
            name='companyPermission_id',
            field=models.ManyToManyField(blank=True, to='api.companypermission'),
        ),
        migrations.AddField(
            model_name='companyemployeeposition',
            name='company_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company'),
        ),
        migrations.CreateModel(
            name='CompanyEmployeePerformanceReview',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('remarks', models.TextField()),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('companyEmployee_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companyemployee')),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company')),
            ],
        ),
        migrations.CreateModel(
            name='CompanyEmployeeLeaveRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reason', models.TextField(blank=True, null=True)),
                ('type', models.CharField(choices=[('Annual Leave', 'Annual Leave'), ('Sick Leave', 'Sick Leave'), ('Personal Leave', 'Personal Leave'), ('Maternity Leave', 'Maternity Leave'), ('Paternity Leave', 'Paternity Leave')])),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Accept', 'Accept'), ('Reject', 'Reject'), ('Cancel', 'Cancel')])),
                ('leave_start', models.DateTimeField()),
                ('leave_end', models.DateTimeField()),
                ('comment', models.TextField(blank=True, null=True)),
                ('apply_at', models.DateTimeField(auto_now_add=True)),
                ('approve_at', models.DateTimeField(blank=True, null=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('companyEmployee_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companyemployee')),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company')),
            ],
        ),
        migrations.CreateModel(
            name='CompanyEmployeeFeedBackReview',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('remarks', models.TextField()),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('companyEmployee_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='feebback_from', to='api.companyemployee')),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company')),
                ('feedback_to', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='feerback_to', to='api.companyemployee')),
            ],
        ),
        migrations.CreateModel(
            name='CompanyEmployeeEvaluate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.FloatField(validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)])),
                ('remark', models.TextField(blank=True, null=True)),
                ('improvement', models.TextField(blank=True, null=True)),
                ('date', models.DateField(auto_now_add=True)),
                ('companyEmployee_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companyemployee')),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company')),
            ],
        ),
        migrations.AddField(
            model_name='companyemployee',
            name='companyEmployeePosition_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companyemployeeposition'),
        ),
        migrations.AddField(
            model_name='companyemployee',
            name='company_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company'),
        ),
        migrations.AddField(
            model_name='companyemployee',
            name='user_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.useraccount'),
        ),
        migrations.CreateModel(
            name='companyCheckInRule',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('work_time_start', models.TimeField()),
                ('work_time_end', models.TimeField()),
                ('late_tolerance', models.DurationField()),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company')),
            ],
        ),
        migrations.CreateModel(
            name='CompanyCheckIn',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('type', models.CharField(default='Check In')),
                ('companyEmployee_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companyemployee')),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company')),
            ],
        ),
        migrations.CreateModel(
            name='CompanyAnnouncementGroup',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField()),
                ('description', models.TextField(blank=True, null=True)),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('companyEmployee_id', models.ManyToManyField(blank=True, to='api.companyemployee')),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company')),
            ],
        ),
        migrations.CreateModel(
            name='CompanyAnnouncement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField()),
                ('content', models.TextField()),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('expire_at', models.DateTimeField(blank=True, null=True)),
                ('companyEmployee_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companyemployee')),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company')),
                ('group', models.ManyToManyField(blank=True, to='api.companyannouncementgroup')),
            ],
        ),
        migrations.AddField(
            model_name='company',
            name='boss_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='boss', to='api.useraccount'),
        ),
    ]
