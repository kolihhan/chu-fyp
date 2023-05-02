from django.contrib import admin

# Register your models here.

from .models import UserAccount, CustomOutstandingToken

#Show ur api models in super user page
admin.site.register(UserAccount)
admin.site.register(CustomOutstandingToken)