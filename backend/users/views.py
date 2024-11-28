from django.http import JsonResponse
from . import forms
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout
import json
from google.oauth2 import id_token
from google.auth.transport import requests
from .models import CustomUser


CLIENT_ID = "202435428933-3lre5ob5rajcfimt8q4r64c9n2a1t7cl.apps.googleusercontent.com"

# keep this here
@ensure_csrf_cookie
def get_csrf(request):
    return JsonResponse({"csrfToken": request.META.get("CSRF_COOKIE")})

@csrf_exempt
def registerUser(request):
  form = forms.CustomUserCreationForm()

  if request.method == "POST":
    form = forms.CustomUserCreationForm(request.POST)
    if form.is_valid():
      form.save()
      return JsonResponse(
                {"message": "User created successfully."},
                status=201
            )
    else:
      errors = form.errors.as_data()
      for error in errors['email']:
                if error.code == 'email_in_use':
                    return JsonResponse({"error": "This email is already in use."}, status=409)
      
      return JsonResponse({"errors": form.errors}, status=400)
  
  return JsonResponse(
                {"errors": "Method not allowed."},
                status=405
            )
@csrf_exempt
def loginUser(request):
  
  if request.method == 'POST':
      email = request.POST['email']
      password = request.POST['password']

      user = authenticate(request, email=email, password=password)
     
      if user is not None:
          login(request, user)
          return JsonResponse({"message": "User signed in successfully."}, status=200)
      else:
          return JsonResponse({"error": "The user was unable to be authenticated"}, status=400)
      
  return JsonResponse(
                {"errors": "Method not allowed."},
                status=405
            )
@csrf_exempt
def logoutUser(request):
  
  if request.method == 'GET':
      logout(request)
      return JsonResponse(
                {"message": "User signed out successfully."},
                status=200
            )

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