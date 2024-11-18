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

    return JsonResponse(serializer.data, status=200)
  
  return JsonResponse({"errors": "Method not allowed."}, status=405)


