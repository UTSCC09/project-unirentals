#/api/listings/<id>/applications/?page=int&full=Bool

from django.urls import path
from . import views

urlpatterns = [
  path('api/listings/<int:lid>/applications/', views.applicationView, name="applications"),
  path('api/listings/<int:lid>/applications/<int:rid>/', views.applicationSpecificView, name="specific-application"),
  path('api/listings/<int:lid>/applications/self/', views.applicationSelfView, name="self-application"),
]