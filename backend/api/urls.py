from django.urls import path
from .  import views

# Routes
urlpatterns = [
    path('',views.getHome, name="home"),
    path('employees',views.getAllEmployee, name="employees"),
    path('employee/<str:id>',views.getSingleEmployee, name="employee")

]