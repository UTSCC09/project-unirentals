from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import forms
from .models import Listing, ListingImage
from .serializers import ListingSerializer, ListingImageSerializer
from schools.models import School
from django.utils.datastructures import MultiValueDictKeyError
from PIL import Image
from django.core.paginator import Paginator, EmptyPage

#LISTING_PAGINATION_COUNT = X
IMAGE_PAGINATION_COUNT = 5

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

          # Check that all given images are valid
          for file in request.FILES.getlist('images'):
            try:
              Image.open(file).verify()  # Verify the file is an image
            except Exception:
              return JsonResponse({"errors": "Uploaded files must be valid image files."}, status=400)

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
def listingSpecificView(request, id): 

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

@csrf_exempt
def listingImageView(request, lid): 
  # On GET: Return a paginated list of the items
  if request.method == 'GET':

    # Attempt to find the given listing
    try: 
      listing = Listing.objects.get(id=lid)

    # If no listing is found with the given id, we return a 404 status code
    except Listing.DoesNotExist:
      return JsonResponse({"errors": "Listing with given ID does not exist."}, status=404)
    
    try:
      page = request.GET.get('page', 1)
      page = int(page)
    
    # If page is supplied with an improper value, return 404 status
    except (TypeError, ValueError): 
      return JsonResponse({"errors": "Page must be an integer."}, status=400)
    
    images = listing.images.all()
    
    paginator = Paginator(ListingImageSerializer(images, many=True).data, IMAGE_PAGINATION_COUNT)

    # Attempt to get the page for which we are queried, if we are queried out of our range, we return the last page
    try:
      page_obj = paginator.page(page)
    except EmptyPage:
      page_obj = paginator.page(paginator.num_pages)

    return JsonResponse({'images': list(page_obj.object_list)}, status=200)
  
  if request.method == 'POST':
    
    # Attempt to find the listing with the given id
    try:
      listing = Listing.objects.get(id=lid)
    
    # If listing with given ID not found, return 404 status
    except Listing.DoesNotExist:
      return JsonResponse({"errors": "Listing with given ID does not exist."}, status=404)

    # Check that the requesting user is logged in
    if request.user.is_authenticated:

      # Check that the requesting user owns this listing
      if listing.owner == request.user:

        # Check that the given image files are appropriate
        for file in request.FILES.getlist('images'):
          try:
            Image.open(file).verify()  # Verify the file is an image
          except Exception:
            return JsonResponse({"errors": "Uploaded files must be valid image files."}, status=400)

        # If the files are appropriate, we add them to the listing
        for file in request.FILES.getlist('images'):
          ListingImage.objects.create(image=file, listing=listing)

        # Return a successfull status
        return JsonResponse({"message": "Photos uploaded to listing successfully"}, status=200)

      # If a user is attempting to modify someone elses listing, return a 403 status
      return JsonResponse({"errors": "Cannot modify listing owned by another user."}, status=403)
    
    # If the user is not logged in, return a 401 status
    return JsonResponse({"errors": "User must be logged in for this action."}, status=401)
  
  # If a non GET/POST method is attempted, return 405 status
  return JsonResponse({"errors": "Method not allowed."}, status=405)

# ------------------------------------------------------------------------------------------ #

@csrf_exempt
def listingSpecificImageView(request, lid, iid): 

  # On GET: Return the information for the image with the given id
  if request.method == 'GET':

    # Attempt to find the listing and image with the given ids
    try:
      listing = Listing.objects.get(id=lid)
      image = ListingImage.objects.get(id=iid, listing=listing)

    # If the listing does not exist, return a 404 status
    except Listing.DoesNotExist:
      return JsonResponse({"errors": "Listing with given ID does not exist."}, status=404)
    
    # If the image does not exist, return a 404 status
    except ListingImage.DoesNotExist:
      return JsonResponse({"errors": "Image with given ID does not exist for the given listing."}, status=404)
    
    serializer = ListingImageSerializer(image)
    return JsonResponse(serializer.data, status=200)

  if request.method == 'DELETE':
    
    # Attempt to find the listing and image with the given ids
    try:
      listing = Listing.objects.get(id=lid)
      image = ListingImage.objects.get(id=iid, listing=listing)

    # If the listing does not exist, return a 404 status
    except Listing.DoesNotExist:
      return JsonResponse({"errors": "Listing with given ID does not exist."}, status=404)
    
    # If the image does not exist, return a 404 status
    except ListingImage.DoesNotExist:
      return JsonResponse({"errors": "Image with given ID does not exist for the given listing."}, status=404)
    
    # If the image does exist, then we delete it
    image.delete()

    # Return a successful status
    return JsonResponse({"message": "Photos removed from listing successfully"}, status=200)    

  # If a non GET/DELETE method is attempted, return 405 status
  return JsonResponse({"errors": "Method not allowed."}, status=405)
