from django.shortcuts import render, HttpResponse
from rest_framework import viewsets
from .models import User
from .serializers import UserSerializer

# Create your views here.

# -- Registration/Login Views -- #
def registerView(request): 
    return "Hello World"

def signInView(request): 
    return "Hello World"

def signOutView(request): 
    return "Hello World"

# class UserViewSet(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

#     def get()