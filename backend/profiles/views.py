from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import forms
from users.models import CustomUser
from .models import userProfile

# Create your views here.
@csrf_exempt
def userProfileInformation(request, email):
  try:
    targetUser = CustomUser.objects.get(email=email)
    profile = userProfile.objects.get(user=targetUser)

    if request.method == 'GET':
      print(profile)
      return JsonResponse({"message": "Profile found."}, status=200)
    
    if request.method == 'PATCH':
      print(profile)
      return JsonResponse({"message": "Profile found."}, status=200)
    
  except CustomUser.DoesNotExist:
    return JsonResponse({"message": "Profile does not exist."}, status=404)
  
@csrf_exempt
def userProfilePicture(request, email):
  try:
    targetUser = CustomUser.objects.get(email=email)
    profile = userProfile.objects.get(user=targetUser)

    if request.method == 'GET':
      print(profile.profile_pic.url)
      return JsonResponse({"url": profile.profile_pic.url}, status=200)
    
    return JsonResponse({"errors": "Method not allowed."}, status=405)
    
  except CustomUser.DoesNotExist:
    return JsonResponse({"message": "Profile does not exist."}, status=404)
  
  
  