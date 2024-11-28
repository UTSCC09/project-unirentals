from django.urls import path
from . import views

urlpatterns = [
  path('api/getcsrf/', views.csrfView, name="get-csrf"),
  path('api/register/', views.registerView, name="register"),
  path('api/login/', views.loginView, name="login"),
  path('api/logout/', views.logoutView, name="logout"),
]