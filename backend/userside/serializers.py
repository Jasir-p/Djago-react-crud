from .models import Users
from rest_framework import serializers

from rest_framework import serializers
from .models import Users  # Adjust the import as necessary

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Users
        fields = ["id", "username", "password", "email", 'is_active', "profile_picture"]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": True},
            "is_active": {"required": False}  #
        }

    def get_profile_pic(self, obj):
        return obj.profile_picture.url if obj.profile_picture else None
    def create(self, validated_data):
        print("Validated data for user creation:", validated_data)  
        
        user = Users(
            username=validated_data['username'],
            email=validated_data['email'],
            profile_picture=validated_data.get('profile_picture', None)
        )
        user.set_password(validated_data['password']) 
        user.save()
        return user

    def update(self, instance, validated_data):
        print("haaaaah")
        print("Validated data for user update:", validated_data)  
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.is_active = validated_data.get('is_active', instance.is_active)


       
        if 'profile_picture' in validated_data:
            print("haii55")
            instance.profile_picture = validated_data['profile_picture']

        
        instance.save()
        return instance
