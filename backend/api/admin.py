from django.contrib import admin

# Register your models here.

from .models import Employee

#Show ur api models in admin page
admin.site.register(Employee)