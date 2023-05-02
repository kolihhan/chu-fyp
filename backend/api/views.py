from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from .serializers import UserSerializer, MyTokenObtainPairSerializer
from .models import CustomOutstandingToken, CustomTokenUser , UserAccount
# from django.http import JsonResponse


#JSONResponse
#如果 many=True 参数告诉Serializers，employee 字段中可能有多个員工，需要对它们进行序列化。
#如果 many=False，则说明 object 字段只包含一个Query，而不是多个Query。
# @api_view(['GET'])
# def getAllEmployee(request):

#     param = request.GET.get('id') #Fetching request params
#     employee = Employee.objects.all()  #Get all object from Employee
#     employee = Employee.objects.get(id = id)  #Get single id from Employee
#     serializer = EmployeeSerializer(employee,many=True) #Many 如果有多個資料就是True

#     return Response(serializer.data) #Serializer 是一個Object,需要呼叫.data拿到資料

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response("賬號建立成功", status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MyTokenObtainPairView(TokenObtainPairView):
    http_method_names = ['post']
    permission_classes = [AllowAny]
    serializer_class = MyTokenObtainPairSerializer


    
