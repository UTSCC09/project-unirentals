from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import forms
from users.models import CustomUser
from .models import userProfile
from .serializers import ProfileSerializer

# Create your views here.
@csrf_exempt
def selfProfileInformation(request):
  try:
    profile = userProfile.objects.get(user=request.user)

    if request.user.is_authenticated:
      
      if request.method == 'GET':
        user_info = ProfileSerializer(profile)
        return JsonResponse(user_info.data, status=200)
      
      if request.method == 'POST':
        form = forms.profileForm(request.POST, request.FILES, instance=profile)
          
        if form.is_valid():
          form.save()
          return JsonResponse({"message": "Profile updated."}, status=200)
        
        return JsonResponse({"errors": form.errors}, status=400)
      
      return JsonResponse({"errors": "Method not allowed."}, status=405)

    return JsonResponse({"errors": "User must be signed in to perform this action."}, status=401)

  except userProfile.DoesNotExist:
    return JsonResponse({"errors": "Profile does not exist."}, status=404)


@csrf_exempt
def selfProfilePicture(request):
  try:
    profile = userProfile.objects.get(user=request.user)

    if request.method == 'GET':
      
      if profile.profile_pic:
        return JsonResponse({"url": profile.profile_pic.url}, status=200)
      
      return JsonResponse({"errors": "User has no profile picture."}, status=405)
    
    return JsonResponse({"errors": "Method not allowed."}, status=405)
    
  except CustomUser.DoesNotExist:
    return JsonResponse({"errors": "Profile does not exist."}, status=404)

@csrf_exempt
def userProfileInformation(request, id):
  try:
    targetUser = CustomUser.objects.get(id=id)
    profile = userProfile.objects.get(user=targetUser)

    if request.method == 'GET':
      user_info = ProfileSerializer(profile)
      return JsonResponse(user_info.data, status=200)
    
    if request.method == 'POST':
      if request.user.is_authenticated:

        if request.user == targetUser:
          form = forms.profileForm(request.POST, request.FILES, instance=profile)
          
          if form.is_valid():
            form.save()
            return JsonResponse({"message": "Profile updated."}, status=200)
          
          else:
            return JsonResponse({"errors": form.errors}, status=400)
        
        return JsonResponse({"errors": "Cannot modify another users profile."}, status=403)
      
      return JsonResponse({"errors": "User must be signed in to perform this action."}, status=401)
    
    return JsonResponse({"errors": "Method not allowed."}, status=405)
    
  except CustomUser.DoesNotExist:
    return JsonResponse({"errors": "Profile does not exist."}, status=404)
  
@csrf_exempt
def userProfilePicture(request, id):
  try:
    targetUser = CustomUser.objects.get(id=id)
    profile = userProfile.objects.get(user=targetUser)

    if request.method == 'GET':
      if profile.profile_pic:
        return JsonResponse({"url": profile.profile_pic.url}, status=200)
      
      return JsonResponse({"errors": "User has no profile picture."}, status=405)
    
    return JsonResponse({"errors": "Method not allowed."}, status=405)
    
  except CustomUser.DoesNotExist:
    return JsonResponse({"errors": "Profile does not exist."}, status=404)
  
  
  