# Generated by Django 4.2 on 2023-05-21 02:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_application_feedback_performance_promotionhistory_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='CompanyAnnouncement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField()),
                ('content', models.TextField()),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('expire_at', models.DateTimeField(blank=True, null=True)),
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
            ],
        ),
        migrations.CreateModel(
            name='CompanyBenefits',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField()),
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
            ],
        ),
        migrations.CreateModel(
            name='CompanyDepartment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('department', models.CharField()),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('update_at', models.DateTimeField(auto_now=True)),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company')),
            ],
        ),
        migrations.CreateModel(
            name='CompanyEmployeeFeedBackReview',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('remarks', models.TextField()),
                ('create_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='CompanyEmployeePerformanceReview',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('remarks', models.TextField()),
                ('create_at', models.DateTimeField(auto_now_add=True)),
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
            name='CompanyEmployeeTraining',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('training_result', models.CharField()),
                ('create_at', models.DateTimeField(auto_now_add=True)),
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
            name='CompanyPromotionRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('remarks', models.TextField()),
                ('create_at', models.DateTimeField(auto_now_add=True)),
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
            name='CompanyTraining',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField()),
                ('description', models.TextField()),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company')),
            ],
        ),
        migrations.CreateModel(
            name='UserApplicationRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Accept', 'Accept'), ('Reject', 'Reject'), ('Interviewing', 'Interviewing'), ('Withdrawn', 'Withdrawn')])),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('companyRecruitment_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companyrecruitment')),
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
        migrations.RemoveField(
            model_name='announcementgroup',
            name='company_id',
        ),
        migrations.RemoveField(
            model_name='announcementgroup',
            name='user_id',
        ),
        migrations.RemoveField(
            model_name='application',
            name='recruitment',
        ),
        migrations.RemoveField(
            model_name='application',
            name='resume',
        ),
        migrations.RemoveField(
            model_name='application',
            name='user',
        ),
        migrations.RemoveField(
            model_name='checkin',
            name='company_id',
        ),
        migrations.RemoveField(
            model_name='checkin',
            name='user_id',
        ),
        migrations.RemoveField(
            model_name='feedback',
            name='company',
        ),
        migrations.RemoveField(
            model_name='feedback',
            name='feedback_to',
        ),
        migrations.RemoveField(
            model_name='feedback',
            name='user',
        ),
        migrations.RemoveField(
            model_name='performance',
            name='company',
        ),
        migrations.RemoveField(
            model_name='performance',
            name='user',
        ),
        migrations.RemoveField(
            model_name='promotionhistory',
            name='company',
        ),
        migrations.RemoveField(
            model_name='promotionhistory',
            name='user',
        ),
        migrations.RemoveField(
            model_name='recruitment',
            name='company',
        ),
        migrations.RemoveField(
            model_name='userpermission',
            name='company_id',
        ),
        migrations.RemoveField(
            model_name='userpermission',
            name='permission_id',
        ),
        migrations.RemoveField(
            model_name='userpermission',
            name='user_id',
        ),
        migrations.RemoveField(
            model_name='companyemployee',
            name='position',
        ),
        migrations.RemoveField(
            model_name='companyemployee',
            name='role',
        ),
        migrations.RemoveField(
            model_name='userresume',
            name='email',
        ),
        migrations.RemoveField(
            model_name='userresume',
            name='name',
        ),
        migrations.RemoveField(
            model_name='userresume',
            name='phone_number',
        ),
        migrations.AddField(
            model_name='companyemployee',
            name='salary',
            field=models.DecimalField(decimal_places=2, default=1, max_digits=10),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name='Announcement',
        ),
        migrations.DeleteModel(
            name='AnnouncementGroup',
        ),
        migrations.DeleteModel(
            name='Application',
        ),
        migrations.DeleteModel(
            name='checkIn',
        ),
        migrations.DeleteModel(
            name='Feedback',
        ),
        migrations.DeleteModel(
            name='Performance',
        ),
        migrations.DeleteModel(
            name='Permission',
        ),
        migrations.DeleteModel(
            name='PromotionHistory',
        ),
        migrations.DeleteModel(
            name='Recruitment',
        ),
        migrations.DeleteModel(
            name='UserPermission',
        ),
        migrations.AddField(
            model_name='userapplicationrecord',
            name='userResume_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.userresume'),
        ),
        migrations.AddField(
            model_name='companytraining',
            name='trainer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companyemployee'),
        ),
        migrations.AddField(
            model_name='companypromotionrecord',
            name='companyEmployee_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companyemployee'),
        ),
        migrations.AddField(
            model_name='companypromotionrecord',
            name='company_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company'),
        ),
        migrations.AddField(
            model_name='companypromotionrecord',
            name='new_position',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='new_position', to='api.companyemployeeposition'),
        ),
        migrations.AddField(
            model_name='companypromotionrecord',
            name='previous_position',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='previous_position', to='api.companyemployeeposition'),
        ),
        migrations.AddField(
            model_name='companyemployeetraining',
            name='companyEmployee_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companyemployee'),
        ),
        migrations.AddField(
            model_name='companyemployeetraining',
            name='companyTraining_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companytraining'),
        ),
        migrations.AddField(
            model_name='companyemployeetraining',
            name='company_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company'),
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
        migrations.AddField(
            model_name='companyemployeeperformancereview',
            name='companyEmployee_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companyemployee'),
        ),
        migrations.AddField(
            model_name='companyemployeeperformancereview',
            name='company_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company'),
        ),
        migrations.AddField(
            model_name='companyemployeefeedbackreview',
            name='companyEmployee_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='feebback_from', to='api.companyemployee'),
        ),
        migrations.AddField(
            model_name='companyemployeefeedbackreview',
            name='company_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company'),
        ),
        migrations.AddField(
            model_name='companyemployeefeedbackreview',
            name='feedback_to',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='feerback_to', to='api.companyemployee'),
        ),
        migrations.AddField(
            model_name='companycheckin',
            name='companyEmployee_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companyemployee'),
        ),
        migrations.AddField(
            model_name='companycheckin',
            name='company_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company'),
        ),
        migrations.AddField(
            model_name='companyannouncementgroup',
            name='companyEmployee_id',
            field=models.ManyToManyField(blank=True, to='api.companyemployee'),
        ),
        migrations.AddField(
            model_name='companyannouncementgroup',
            name='company_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company'),
        ),
        migrations.AddField(
            model_name='companyannouncement',
            name='companyEmployee_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companyemployee'),
        ),
        migrations.AddField(
            model_name='companyannouncement',
            name='company_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company'),
        ),
        migrations.AddField(
            model_name='companyannouncement',
            name='group',
            field=models.ManyToManyField(blank=True, to='api.companyannouncementgroup'),
        ),
        migrations.AddField(
            model_name='companyemployee',
            name='companyEmployeePosition_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.companyemployeeposition'),
            preserve_default=False,
        ),
    ]
