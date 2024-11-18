from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import forms
from users.models import CustomUser
from .models import Listing
from .serializers import ListingSerializer

# Create your views here.
@csrf_exempt
def listingGenericView(request): #/api/listings/
  if request.method == 'GET':
    listings = Listing.objects.all()
    serializer = ListingSerializer(listings, many=True)

    return JsonResponse({"listings": serializer.data}, status=200)
  
  if request.method == 'POST':
    # Check that user is authenticated
    if request.user.is_authenticated:
      form = forms.listingForm(request.POST)
      
      # Check that information passed to form is valid
      if form.is_valid():
        # Set owner of listing to be user sending req
        form.instance.owner = request.user 
        form.save()
        return JsonResponse({"message": "Listing created successfully"}, status=200)

      else:
        return JsonResponse({"errors": form.errors}, status=400)
    
    # User is not authenticated
    else: 
      return JsonResponse({"errors": "User must be logged in for this action."}, status=401) 

    
    
  return JsonResponse({"errors": "Method not allowed."}, status=405)


