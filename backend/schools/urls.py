from django.urls import path
from . import views

urlpatterns = [
  path('api/schools/', views.schoolView, name="schools"),
  path('api/schools/<int:sid>/', views.specificSchoolView, name="specific-schools"),
  path('api/schools/<int:sid>/listings/', views.schoolListingView, name="schools-listings"),
  path('api/schools/<int:sid>/listings/<int:lid>/', views.specificSchoolListingView, name="specific-schools-listings"),
]