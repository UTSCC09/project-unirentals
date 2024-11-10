from django.urls import path
from . import views

urlpatterns = [
  path('api/register/', views.registerUser, name="register"),
  path('api/login/', views.loginUser, name="login"),
]