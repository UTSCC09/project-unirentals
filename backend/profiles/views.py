from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import forms
from users.models import CustomUser
from .models import userProfile
from .serializers import ProfileSerializer

# Create your views here.
@csrf_exempt
def userProfileInformation(request, email):
  try:
    targetUser = CustomUser.objects.get(email=email)
    profile = userProfile.objects.get(user=targetUser)

    if request.method == 'GET':
      user_info = ProfileSerializer(profile)
      return JsonResponse(user_info.data, status=200)
    
    if request.method == 'POST':
      print(request.user)
      print(targetUser)
      if request.user == targetUser:
        form = forms.profileForm(request.POST, request.FILES, instance=profile)
        
        if form.is_valid():
          form.save()
          return JsonResponse({"message": "Profile updated."}, status=200)
        
        else:
          return JsonResponse({"errors": form.errors}, status=400)
      
      return JsonResponse({"error": "Cannot modify another users profile."}, status=403)
      
    
    return JsonResponse({"error": "Method not allowed."}, status=405)
    
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
  
  
  