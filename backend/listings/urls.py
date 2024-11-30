from django.urls import path
from . import views

urlpatterns = [
  path('api/listings/', views.listingView, name="listings"),
  path('api/listings/<int:id>/', views.listingSpecificView, name="listings-specific"),
  path('api/listings/<int:lid>/images/', views.listingImageView, name="listings-image"),
  path('api/listings/<int:lid>/images/<int:iid>/', views.listingSpecificImageView, name="listings-image-specific"),
  path('api/validate-address/', views.validateAddress, name="validate-address"),
]