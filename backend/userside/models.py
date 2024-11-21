
from django.db import models
from django.contrib.auth.models import AbstractUser

class Users(AbstractUser):
    profile_picture = models.ImageField(upload_to='images/', null=True, blank=True, max_length=100)

