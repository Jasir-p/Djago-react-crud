from django.shortcuts import render
from django.shortcuts import render
from .models import Users
from rest_framework import generics
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated 
from rest_framework import status
# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = Users.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        print("?hoiiii")
        print("Request data:", request.data)  
        response = super().create(request, *args, **kwargs)
        print("Response data:", response.data)  # Log the response data after serialization
        return response

class ViewProfile(generics.RetrieveAPIView):
    queryset = Users.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]  
    def get_object(self):
        print(self.request.user.username)
        return self.request.user
    

    def get(self, request, *args, **kwargs):
        user = self.get_object()  
        serializer = self.get_serializer(user)  
        return Response(serializer.data) 

class Edituser(APIView):
    permission_classes = [IsAuthenticated]  
    def put(self,request,*args, **kwargs):
        user=self.request.user

        serializer = UserSerializer(user, data=self.request.data, partial=True)
        print(self.request.data)

        if serializer.is_valid():
            serializer.save()

            return Response({
               
                'message': 'User updated successfully',
                'username': serializer.instance.username,  
                'email': serializer.instance.email,       
               
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
