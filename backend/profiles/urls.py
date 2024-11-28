from django.urls import path
from . import views

urlpatterns = [
  path('api/profiles/', views.selfProfileView, name="self-profile"),
  path('api/profiles/picture/', views.selfPictureView, name="self-image"),
  path('api/profiles/<int:id>/', views.userProfileView, name="user-profile"),
  path('api/profiles/<int:id>/picture/', views.userProfileView, name="user-image"),
]