from django.http import JsonResponse
from . import forms
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout
from django.utils.datastructures import MultiValueDictKeyError

# Create your views here.

# keep this here
@ensure_csrf_cookie
def csrfView(request):

  # On any type of request to the endpoint, return the CSRF cookie  
  return JsonResponse({"csrfToken": request.META.get("CSRF_COOKIE")})

# ------------------------------------------------------------------------------------------ #

@csrf_exempt
def registerView(request):
  form = forms.CustomUserCreationForm()

  # On POST - Create a new user with the given information
  if request.method == "POST":
    form = forms.CustomUserCreationForm(request.POST)
    
    # Check the validity of the given form data
    if form.is_valid():
      form.save()

      # If the form is valid, submit and create the new user
      return JsonResponse({"message": "User created successfully."}, status=201)
    
    # If there is an error with the form, return a 409 error in the case of a conflicting email, and 400 error otherwise
    else:
      errors = form.errors.as_data()
      for error in errors['email']:
                if error.code == 'email_in_use':
                    return JsonResponse({"errors": "This email is already in use."}, status=409)
      
      # If no error is matched, return 400 status
      return JsonResponse({"errors": form.errors}, status=400)
  
  # If non POST request, return 405 status
  return JsonResponse({"errors": "Method not allowed."}, status=405)

# ------------------------------------------------------------------------------------------ #

@csrf_exempt
def loginView(request):
  
  # On POST - Attempt to login a user with given credentials
  if request.method == 'POST':
    
    # Attempt to parse form data for relevant information
    try:
      email = request.POST['email']
      password = request.POST['password']

      # Authenticate user, checking that it exists in backend
      user = authenticate(request, email=email, password=password)
    
      if user is not None:
        # Log in the user, setting the necessary cookies, returning 200 status
        login(request, user)
        return JsonResponse({"message": "User signed in successfully."}, status=200)
      
      # If the credentials don't match a profile, return 400 status
      return JsonResponse({"errors": "The user was unable to be authenticated"}, status=400)
      
    # If the form is submitted with missing fields, return 400 status
    except MultiValueDictKeyError:
      return JsonResponse({"errors": "Form is missing username or password."}, status=400)
    
  # If a non POST request is sent, return 405 status
  return JsonResponse({"errors": "Method not allowed."}, status=405)

# ------------------------------------------------------------------------------------------ #

@csrf_exempt
def logoutView(request):
  
  # On GET - Sign out user
  if request.method == 'GET':
      logout(request)
      return JsonResponse({"message": "User signed out successfully."}, status=200)

  # If method is non GET - return 405 status
  return JsonResponse({"errors": "Method not allowed."}, status=405)