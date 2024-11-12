from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import forms
from users.models import CustomUser

# Create your views here.
@csrf_exempt
def userProfileInformation(request, email):
  try:
    profile = CustomUser.objects.get(email=email)

    if (profile):
      print(profile)
      return JsonResponse({"message": "Profile found."}, status=200)
    
  except CustomUser.DoesNotExist:
    return JsonResponse({"message": "Profile does not exist."}, status=404)
  
  
  
  