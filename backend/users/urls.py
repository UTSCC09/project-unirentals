from django.urls import path
from . import views

urlpatterns = [
  path('api/getcsrf/', views.get_csrf, name="get-csrf"),
  path('api/register/', views.registerUser, name="register"),
  path('api/login/', views.loginUser, name="login"),
  path('api/logout/', views.logoutUser, name="logout"),
]