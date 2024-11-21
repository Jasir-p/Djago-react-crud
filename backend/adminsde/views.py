

from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from userside.serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from userside.models import Users
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.contrib.auth import authenticate
from rest_framework import status
from django.middleware.csrf import get_token


class ListUser(generics.ListAPIView):
    queryset = Users.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    def get(self, request, *args, **kwargs):
        print("ListUser: Fetching users")
        querysets = self.get_queryset()
        serializer = self.get_serializer(querysets, many=True)
        return Response(serializer.data)


class UserDetailsView(generics.RetrieveAPIView):
    print("hellooooo")
    queryset = Users.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]  
    print("hellooooo")
    def get_object(self):
        print(self.request.user.username)
        return self.request.user
    

    def get(self, request, *args, **kwargs):
        user = self.get_object()  
          
        return Response({"isAdmin": user.is_superuser}) 
class AdminLogin(APIView):
    permission_classes = [AllowAny]

    @csrf_exempt  
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            if user.is_staff:
                
                refresh = RefreshToken.for_user(user)
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'message': 'Login successful'
                }, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Not authorized as admin.'}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'detail': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class AdminUserEditView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, id):
        print(f"AdminUserEditView: Editing user with ID {id}")
        try:
            user = Users.objects.get(id=id)
            print(f"AdminUserEditView: Found user {user.username}")
        except Users.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

       
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'User updated successfully',
                'username': serializer.instance.username,  
                'email': serializer.instance.email,       
                'is_active': serializer.instance.is_active  
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminUserBlockUnblockView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, user_id):
        try:
            user = Users.objects.get(id=user_id)
        except Users.DoesNotExist:
            return Response({'error': 'User not found'},
                            status=status.HTTP_404_NOT_FOUND)

        user.is_active = request.data.get('is_active', user.is_active)
        user.save()

        return Response({
            'message': 'User status updated',
            'is_active': user.is_active
        }, status=status.HTTP_200_OK)

# class AdminHome()