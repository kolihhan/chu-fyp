from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Employee
from .serializers import EmployeeSerializers
# from django.http import JsonResponse

# Return your views here.
@api_view(['GET'])
def getHome(request):
    return Response("Hello World")


@api_view(['GET'])
def getAllEmployee(request):

    param = request.GET.get('id') #Fetching request params

    employee = Employee.objects.all()  #Get all object from Employee
    serializer = EmployeeSerializers(employee,many=True)

    return Response(serializer.data) #Serializer 是一個Object,需要呼叫.data拿到資料


@api_view(['GET'])
def getSingleEmployee(request,id):
    
    employee = Employee.objects.get(id = id)  #Get single id from Employee
    serializer = EmployeeSerializers(employee,many=True)

    return Response(serializer.data) #Serializer 是一個Object,需要呼叫.data拿到資料



#如果 many=True 参数告诉Serializers，employee 字段中可能有多个員工，需要对它们进行序列化。
#如果 many=False，则说明 object 字段只包含一个Query，而不是多个Query。