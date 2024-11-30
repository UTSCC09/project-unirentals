from django.urls import path
from . import views

urlpatterns = [
  path('api/listings/', views.listingView, name="listings"),
  path('api/listings/<int:id>/', views.listingSpecificView, name="listings-specific"),
]