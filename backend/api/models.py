from django.db import models

# Create your models here.

#Diff between auto_now and auto_now_add
#auto_now_add : 只執行一次
#auto_now : 每次都會執行


class Employee(models.Model):
    body = models.TextField(null=True,blank=True)
    updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.body[0:50]

class Boss(models.Model):
    body = models.TextField(null=True,blank=True)
    updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.body[0:50]
    
class Admin(models.Model):
    body = models.TextField(null=True,blank=True)
    updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.body[0:50]