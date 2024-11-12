from django.http import JsonResponse
from . import forms
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.contrib.auth import authenticate, login, logout

# Create your views here.

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
          return JsonResponse({"message": "User signed in successfully."}, status=200)
      else:
          # Default response if no error matched
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