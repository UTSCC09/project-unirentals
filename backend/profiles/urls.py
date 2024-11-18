from django.urls import path
from . import views

urlpatterns = [
  path('api/profiles/<int:id>/', views.userProfileInformation, name="user-profile"),
  path('api/profiles/<int:id>/picture/', views.userProfilePicture, name="user-image"),
]