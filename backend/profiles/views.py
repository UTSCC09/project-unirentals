from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import forms
from users.models import CustomUser
from .models import userProfile, DEFAULT_PICTURE_PATH
from .serializers import ProfileSerializer
from schools.models import School
from django.utils.datastructures import MultiValueDictKeyError

# Create your views here.
@csrf_exempt
def selfProfileView(request):
  
  # Attempt to find profile matching user sending request
  try:
    profile = userProfile.objects.get(user=request.user)

    # Check that user is authenticated
    if request.user.is_authenticated:
      
      # On GET - Return information about current users profile
      if request.method == 'GET':
        user_info = ProfileSerializer(profile)
        user_info._data = {**user_info.data, 'school': profile.school.name}
        return JsonResponse(user_info.data, status=200)
      
      # On POST - Update profile information for given user
      if request.method == 'POST':

        # Attempt to find school matching value submitted in form
        try:
          if request.POST['school'] == '':
            school = None
          else:
            school = School.objects.get(name=request.POST['school'])

          form = forms.ProfileForm(request.POST, request.FILES, instance=profile)

          # Check that the form fields submitted are valid
          if form.is_valid():

            # Set the appropriate school
            form.instance.school = school
            
            # Check that there is an image uploaded, otherwise set the profile_pic to the default
            if not request.FILES.get('profile_pic'): 
              form.instance.profile_pic = DEFAULT_PICTURE_PATH
            
            form.save()

            # If everything works okay, save the form and return 200 status
            return JsonResponse({"message": "Profile updated."}, status=200)
          
          # If something is wrong with the form, return 400 status
          return JsonResponse({"errors": form.errors}, status=400)

        # If the given school does not exist, return 404 status
        except School.DoesNotExist:
          return JsonResponse({"errors": "School does not exist."}, status=404)
      
        # If the form is submitted without a school field, return 400 status
        except MultiValueDictKeyError:
          return JsonResponse({"errors": "Form is missing school field."}, status=400)
      
      # If not a GET/POST request, return 405 status
      return JsonResponse({"errors": "Method not allowed."}, status=405)

    # If user is not signed in, return 401 status
    return JsonResponse({"errors": "User must be signed in to perform this action."}, status=401)

  # If no profile exists for the user, return a 404 status
  except userProfile.DoesNotExist:
    return JsonResponse({"errors": "Profile does not exist."}, status=404)

# ------------------------------------------------------------------------------------------ #

@csrf_exempt
def selfPictureView(request):

  # Attempt to find a profile matching the requesting user
  try:
    profile = userProfile.objects.get(user=request.user)

    # On GET - Return the URL for the profile photo associated with the given user
    if request.method == 'GET':
      
      # If the user has a profile picture, return the URL
      if profile.profile_pic:
        return JsonResponse({"url": profile.profile_pic.url}, status=200)
      
      # If the user has no profile picture, return a 404 status
      return JsonResponse({"errors": "User has no profile picture."}, status=404)
    
    # If a non GET method is used, return a 405 status
    return JsonResponse({"errors": "Method not allowed."}, status=405)
    
  # If no profile exists matching the current user, return a 404 status
  except CustomUser.DoesNotExist:
    return JsonResponse({"errors": "Profile does not exist."}, status=404)

# ------------------------------------------------------------------------------------------ #

@csrf_exempt
def userProfileView(request, id):

  # Attempt to find a profile matching that of the given id
  try:
    targetUser = CustomUser.objects.get(id=id)
    profile = userProfile.objects.get(user=targetUser)

    # On GET - Return information about the users profile
    if request.method == 'GET':
      user_info = ProfileSerializer(profile)
      return JsonResponse(user_info.data, status=200)
    
    # On POST - Update the given profile with the submitted form data
    if request.method == 'POST':

      # Check that the user is authenticated
      if request.user.is_authenticated:

        # Check that the user is modifying their own form (A little redundant given other endpoints)
        if request.user == targetUser:

          # Attempt to find a school matching the name submitted in the form
          try:
            if request.POST['school'] == '':
              school = None
            else:
              school = School.objects.get(name=request.POST['school'])

            form = forms.ProfileForm(request.POST, request.FILES, instance=profile)

            # Check that the values submitted are valid for the DB
            if form.is_valid():
              form.instance.school = school
              form.save()

              # If everything checks out, save the form and return 200 status
              return JsonResponse({"message": "Profile updated."}, status=200)
            
            # If there are errors with the form, return 400 status
            return JsonResponse({"errors": form.errors}, status=400)

          # If the given school does not exist in the DB, return 404 status
          except School.DoesNotExist:
            return JsonResponse({"errors": "School does not exist."}, status=404)
        
          # If the submitted form is missing a school field, return 400 status
          except MultiValueDictKeyError:
            return JsonResponse({"errors": "Form is missing school field."}, status=400)
        
        # If the user is attempting to modify someone elses profile, return 403 status
        return JsonResponse({"errors": "Cannot modify another users profile."}, status=403)
      
      # If the user is not signed in, return 401 status
      return JsonResponse({"errors": "User must be signed in to perform this action."}, status=401)
    
    # If the user is attempting to make a non GET/POST request, return 405 status
    return JsonResponse({"errors": "Method not allowed."}, status=405)
    
  # If no profile matching the given id exists, return 404 status
  except CustomUser.DoesNotExist:
    return JsonResponse({"errors": "Profile does not exist."}, status=404)
  
# ------------------------------------------------------------------------------------------ #

@csrf_exempt
def userPictureView(request, id):

  # Attempt to find a profile matching the given id
  try:
    targetUser = CustomUser.objects.get(id=id)
    profile = userProfile.objects.get(user=targetUser)

    # On GET - Return the URL for the profile photo associated with the given user
    if request.method == 'GET':

      # If the user has a profile picture, return the URL
      if profile.profile_pic:
        return JsonResponse({"url": profile.profile_pic.url}, status=200)
      
      # If the user has no profile picture, return a 404 status
      return JsonResponse({"errors": "User has no profile picture."}, status=405)
    
    # If a non GET method is used, return a 405 status
    return JsonResponse({"errors": "Method not allowed."}, status=405)
    
  # If no profile exists matching the given user, return a 404 status
  except CustomUser.DoesNotExist:
    return JsonResponse({"errors": "Profile does not exist."}, status=404)
  
# ------------------------------------------------------------------------------------------ #
  