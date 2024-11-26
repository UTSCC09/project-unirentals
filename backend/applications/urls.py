#/api/listings/<id>/applications/?page=int&full=Bool

from django.urls import path
from . import views

urlpatterns = [
  path('api/listings/<int:lid>/applications/', views.applicationView, name="applications"),
]