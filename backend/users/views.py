from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.forms import inlineformset_factory
from . import forms
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout

# Create your views here.

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
      
      # Default response if no error matched
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
          return JsonResponse({"error": "The user was logged in successfully"}, status=200)
      else:
          # Default response if no error matched
          return JsonResponse({"error": "The user was unable to be authenticated"}, status=400)
      
  return JsonResponse(
                {"errors": "Method not allowed."},
                status=405
            )