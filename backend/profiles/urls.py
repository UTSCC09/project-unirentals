from django.urls import path
from . import views

urlpatterns = [
  path('api/profiles/', views.selfProfileInformation, name="self-profile"),
  path('api/profiles/picture/', views.selfProfilePicture, name="self-image"),
  path('api/profiles/<int:id>/', views.userProfileInformation, name="user-profile"),
  path('api/profiles/<int:id>/picture/', views.userProfilePicture, name="user-image"),
]