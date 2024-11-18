from django.urls import path
from . import views

urlpatterns = [
  path('api/listings/', views.listingGenericView, name="listings"),
  #path('api/listings/<int:id>/', views., name="listings-specific"),
]