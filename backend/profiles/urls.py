from django.urls import path
from . import views

urlpatterns = [
  path('api/profiles/<str:email>/', views.userProfileInformation, name="user-profile"),
  path('api/profiles/<str:email>/picture/', views.userProfilePicture, name="user-image"),
]