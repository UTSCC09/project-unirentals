from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import forms
from users.models import CustomUser
from .models import Listing
from .serializers import ListingSerializer
from schools.models import School
from django.utils.datastructures import MultiValueDictKeyError

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

      try:
        form = forms.listingForm(request.POST)
        school = School.objects.get(name=request.POST['school'])

        # Check that information passed to form is valid
        if form.is_valid():
          # Set owner of listing to be user sending req
          form.instance.owner = request.user 
          form.instance.school = school
          form.save()
          return JsonResponse({"message": "Listing created successfully"}, status=200)

        else:
          return JsonResponse({"errors": form.errors}, status=400)

      except School.DoesNotExist:
        return JsonResponse({"errors": "School does not exist."}, status=404)
      
      except MultiValueDictKeyError:
        return JsonResponse({"errors": "Form is missing school field."}, status=400)
    
    # User is not authenticated
    else: 
      return JsonResponse({"errors": "User must be logged in for this action."}, status=401) 
    
  return JsonResponse({"errors": "Method not allowed."}, status=405)

@csrf_exempt
def listingSpecificView(request, id): #/api/listings/id/
  try:
    listing = Listing.objects.get(id=id)

    if request.method == 'GET':
      listing_info = ListingSerializer(listing)
      return JsonResponse(listing_info.data, status=200)
    
    if request.method == 'POST':
      if request.user.is_authenticated:
        if request.user == listing.owner:

          try:
            school = School.objects.get(name=request.POST['school'])
            form = forms.listingForm(request.POST, instance=listing)
          
            if form.is_valid():
              form.instance.school = school
              form.save()
              return JsonResponse({"message": "Listing updated successfully."}, status=400)
            else: 
              return JsonResponse({"errors": form.errors}, status=400)

          except School.DoesNotExist:
            return JsonResponse({"errors": "School does not exist."}, status=404)
          
          except MultiValueDictKeyError:
            return JsonResponse({"errors": "Form is missing school field."}, status=400)

        #User does not match owner of listing
        else:
          return JsonResponse({"errors": "Cannot modify listing owned by another user."}, status=403)
        
      #User is not signed in
      else:
        return JsonResponse({"errors": "User must be logged in for this action."}, status=401)
      
    #Non patch/get request
    return JsonResponse({"errors": "Method not allowed."}, status=405)
  
  #Listing with given ID not found
  except Listing.DoesNotExist:
    return JsonResponse({"errors": "Listing with given ID does not exist."}, status=404)


