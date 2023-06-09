# Generated by Django 4.2 on 2023-07-01 12:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_companyemployeeleaverecord'),
    ]

    operations = [
        migrations.AddField(
            model_name='userresume',
            name='title',
            field=models.CharField(default='Test', max_length=15),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='userapplicationrecord',
            name='status',
            field=models.CharField(choices=[('Pending', 'Pending'), ('Accept', 'Accept'), ('Reject', 'Reject'), ('Interviewing', 'Interviewing'), ('Offering', 'Offering'), ('Withdrawn', 'Withdrawn')]),
        ),
    ]
