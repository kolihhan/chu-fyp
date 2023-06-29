# Generated by Django 4.2 on 2023-06-20 14:24

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_rename_name_companybenefits_benefit_name_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='CompanyEmployeeEvaluate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('score', models.FloatField(validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(100)])),
                ('remark', models.TextField(blank=True, null=True)),
                ('improvement', models.TextField(blank=True, null=True)),
                ('date', models.DateField()),
                ('companyEmployee_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.companyemployee')),
                ('company_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.company')),
            ],
        ),
    ]