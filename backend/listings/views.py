from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import forms
from .models import Listing, ListingImage
from .serializers import ListingSerializer
from schools.models import School
from django.utils.datastructures import MultiValueDictKeyError

# Create your views here.
@csrf_exempt
def listingView(request):

  # On GET: return all listings
  if request.method == 'GET':
    listings = Listing.objects.all()
    serializer = ListingSerializer(listings, many=True)

    return JsonResponse({"listings": serializer.data}, status=200)
  
  # On POST: create a new listing
  if request.method == 'POST':
    
    # Check that user is authenticated
    if request.user.is_authenticated:

      # Attempt to find a school matching the given one
      try:
        form = forms.ListingForm(request.POST)
        school = School.objects.get(name=request.POST['school'])

        # Check that information passed to form is valid
        if form.is_valid():

          # Set owner of listing to be user sending req
          form.instance.owner = request.user 
          form.instance.school = school
          listing = form.save()

          # Create the images associated with the listing
          for file in request.FILES.getlist('images'):
            ListingImage.objects.create(image=file, listing=listing)

          # Return a successful response
          return JsonResponse({"message": "Listing created successfully"}, status=200)

        # If form is not valid, return 400 status
        else:
          return JsonResponse({"errors": form.errors}, status=400)

      # If given school does not exist, return 404 status
      except School.DoesNotExist:
        return JsonResponse({"errors": "School does not exist."}, status=404)
      
      # If form is submitted without a school field, return 400 status
      except MultiValueDictKeyError:
        return JsonResponse({"errors": "Form is missing school field."}, status=400)
    
    # If user is not authenticated, return 401 status
    else: 
      return JsonResponse({"errors": "User must be logged in for this action."}, status=401) 
    
  # If a non GET/POST method is attempted, return 405 status
  return JsonResponse({"errors": "Method not allowed."}, status=405)

# ------------------------------------------------------------------------------------------ #

@csrf_exempt
def listingSpecificView(request, id): #/api/listings/id/

  # Attempt to find a listing matching the given id
  try:
    listing = Listing.objects.get(id=id)

    # On GET - Return information about the specific listing
    if request.method == 'GET':
      listing_info = ListingSerializer(listing)
      return JsonResponse(listing_info.data, status=200)
    
    # On POST - Update the listing with the given id
    if request.method == 'POST':

      # Check that the user is authenticated
      if request.user.is_authenticated:

        # Check that the user is modifying one of their own listings
        if request.user == listing.owner:

          # Attempt to find a school matching the 
          try:
            school = School.objects.get(name=request.POST['school'])
            form = forms.ListingForm(request.POST, instance=listing)
          
            if form.is_valid():
              form.instance.school = school
              form.save()

              # If everything worked properly, return 200 status
              return JsonResponse({"message": "Listing updated successfully."}, status=200)

            # If form is not valid, return 400 status 
            return JsonResponse({"errors": form.errors}, status=400)

          # If given school does not exist, return 404 status
          except School.DoesNotExist:
            return JsonResponse({"errors": "School does not exist."}, status=404)
          
          # If form is submitted without a school field, return 400 status
          except MultiValueDictKeyError:
            return JsonResponse({"errors": "Form is missing school field."}, status=400)

        # If user does not match owner of listing, return 403 status
        else:
          return JsonResponse({"errors": "Cannot modify listing owned by another user."}, status=403)
        
      # If user is not signed in, return 401 status
      else:
        return JsonResponse({"errors": "User must be logged in for this action."}, status=401)
      
    # If a non GET/POST method is attempted, return 405 status
    return JsonResponse({"errors": "Method not allowed."}, status=405)
  
  # If listing with given ID not found, return 404 status
  except Listing.DoesNotExist:
    return JsonResponse({"errors": "Listing with given ID does not exist."}, status=404)

# ------------------------------------------------------------------------------------------ #

#def listingGetImageView(request, lid): # /api/listings/id/images/
 
# ------------------------------------------------------------------------------------------ #

#def listingModifyImageView(request, lid, iid): # /api/listings/id/images/id/
  