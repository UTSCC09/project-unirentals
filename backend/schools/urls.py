from django.urls import path
from . import views

urlpatterns = [
  path('api/schools/', views.schoolView, name="schools"),
  path('api/schools/<int:id>/', views.specificSchoolView, name="specific-schools"),
]