# Generated by Django 4.2 on 2023-05-12 13:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_rename_companyid_announcementgroup_company_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company',
            name='admin_id',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='admin', to='api.useraccount'),
        ),
    ]
