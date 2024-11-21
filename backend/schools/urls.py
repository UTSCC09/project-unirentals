from django.urls import path
from . import views

urlpatterns = [
  path('api/schools/', views.schoolView, name="schools"),
]