from django.http import JsonResponse
from . import forms
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout
import json
from google.oauth2 import id_token
from google.auth.transport import requests
from .models import CustomUser

from django.utils.datastructures import MultiValueDictKeyError


CLIENT_ID = "202435428933-3lre5ob5rajcfimt8q4r64c9n2a1t7cl.apps.googleusercontent.com"

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
          login(request, user)
          return JsonResponse({"message": "User signed in successfully."}, status=200)
      else:
          return JsonResponse({"error": "The user was unable to be authenticated"}, status=400)

      
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

  print("Method is" + request.METHOD)    
  return JsonResponse(
                {"errors": "Method not allowed."},
                status=405
            )

@csrf_exempt
def oauth(request):
    if request.method == "POST":
        try:
            body = json.loads(request.body)
            token = body.get('token')

            idinfo = id_token.verify_oauth2_token(token, requests.Request(), CLIENT_ID)
            email = idinfo['email']
            print(email)
            user, created = CustomUser.objects.get_or_create(email=email)
            if created:
                user.set_unusable_password() 
                user.save()

            login(request, user)

            if created:
                message = "Sign-up successful and user logged in."
            else:
                message = "Login successful."

            return JsonResponse({'message': message, 'user': {'email': email}})

        except ValueError as e:
            return JsonResponse({'error': 'Invalid token'}, status=400)

    return JsonResponse({'error': 'Invalid method'}, status=405)


