from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import forms
from .models import Listing, ListingImage
from .serializers import ListingSerializer, ListingImageSerializer
from schools.models import School
from django.utils.datastructures import MultiValueDictKeyError
from PIL import Image
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
import requests, math

LISTING_PAGINATION_COUNT = 5
IMAGE_PAGINATION_COUNT = 5
MAX_VALUE = 10**9

# Create your views here.
@csrf_exempt
def listingView(request):

  # On GET: return all listings
  if request.method == 'GET':

    # -------- PARAMS -------- # 

    # PAGE - Tells us which page to display

    try: 
      page = request.GET.get('page', 1)
      page = int(page)

    except (TypeError, ValueError): 
      return JsonResponse({"errors": "Page must be a positive integer."}, status=400)
    
    if page < 1:
      return JsonResponse({"errors": "Page must be a positive integer."}, status=400)
    
    # ALL - Tells us if we send all listings, or just a paginated subsection

    all = request.GET.get('all', 'false').lower()
    
    if all not in ['true', 'false', '1', '0', 'yes', 'no']:
      return JsonResponse({'errors': "Invalid value for 'all'. Use 'true' or 'false'."}, status=400)
    
    all = all in ['true', '1', 'yes']

    # PRICE - Gives us the maximum price for a listing

    try: 
      price = request.GET.get('price', MAX_VALUE)
      price = float(price)

    except (TypeError, ValueError): 
      return JsonResponse({"errors": "Price must be a positive number."}, status=400)
    
    if price < 0:
      return JsonResponse({"errors": "Price must be a positive number."}, status=400)

    # DISTANCE - Gives us the maximum distance for a listing

    try: 
      distance = request.GET.get('distance', MAX_VALUE)
      distance = float(distance)

    except (TypeError, ValueError): 
      return JsonResponse({"errors": "Distance must be a positive number."}, status=400)
    
    if distance < 0:
      return JsonResponse({"errors": "Distance must be a positive number."}, status=400)

    # TYPE - Gives us the type of apartment the user is looking for

    type = request.GET.get('type', None)

    # BEDROOMS - Gives us the minimum number of bedrooms

    try: 
      bedrooms = request.GET.get('bedrooms', 0)
      bedrooms = int(bedrooms)

    except (TypeError, ValueError): 
      return JsonResponse({"errors": "Bedrooms must be a positive integer."}, status=400)
    
    if bedrooms < 0:
      return JsonResponse({"errors": "Bedrooms must be a positive integer."}, status=400)

    # BATHROOMS - Gives us the minimum number of bathrooms

    try: 
      bathrooms = request.GET.get('bathrooms', 0)
      bathrooms = int(bathrooms)

    except (TypeError, ValueError): 
      return JsonResponse({"errors": "Bathrooms must be a positive integer."}, status=400)
    
    if bathrooms < 0:
      return JsonResponse({"errors": "Bathrooms must be a positive integer."}, status=400)

    # KITCHENS - Gives us the minimum number of kitchens

    try: 
      kitchens = request.GET.get('kitchens', 0)
      kitchens = int(kitchens)

    except (TypeError, ValueError): 
      return JsonResponse({"errors": "Kitchens must be a positive integer."}, status=400)
    
    if kitchens < 0:
      return JsonResponse({"errors": "Kitchens must be a positive integer."}, status=400)

    # PETS - Flag for whether to include properties with no pet tolerance

    pets = request.GET.get('pets', 'false').lower()
    
    if pets not in ['true', 'false', '1', '0', 'yes', 'no']:
      return JsonResponse({'errors': "Invalid value for 'pets'. Use 'true' or 'false'."}, status=400)
    
    pets = pets in ['true', '1', 'yes']

    # SMOKES - Flag for whether to include properties with no smoking tolerance

    smokes = request.GET.get('smokes', 'false').lower()
    
    if smokes not in ['true', 'false', '1', '0', 'yes', 'no']:
      return JsonResponse({'errors': "Invalid value for 'smokes'. Use 'true' or 'false'."}, status=400)
    
    smokes = smokes in ['true', '1', 'yes']

    # DRINKS - Flag for whether to include properties with no drinking tolerance

    drinks = request.GET.get('drinks', 'false').lower()
    
    if drinks not in ['true', 'false', '1', '0', 'yes', 'no']:
      return JsonResponse({'errors': "Invalid value for 'drinks'. Use 'true' or 'false'."}, status=400)
    
    drinks = drinks in ['true', '1', 'yes']

    # ------------------------ #

    # Filter our listings by our given filters
    listings = Listing.objects.filter(price__lte=price,
                                       distance__lte=distance, 
                                       bedrooms__gte=bedrooms, 
                                       bathrooms__gte=bathrooms,
                                       kitchens__gte=kitchens)
    
    # Filter the boolean fields + type. If someone doesn't want pets, they can still live in a pet accepting household
    if pets:
      listings = listings.filter(pets=pets)
    if smokes:
      listings = listings.filter(smokes=smokes)
    if drinks:
      listings = listings.filter(drinks=drinks)
    if type:
      listings = listings.filter(type=type)

    serializer = ListingSerializer(listings, many=True)


    # If we are sending back all listings, we just serialize and return
    if all:
      return JsonResponse({"listings": serializer.data}, status=200)
    
    # Otherwise, create a paginator with the listings
    paginator = Paginator(serializer.data, LISTING_PAGINATION_COUNT)

    # Attempt to get the desired page
    try:
      page_obj = paginator.page(page)

    # If the given page is out of range, we just return the last page
    except EmptyPage:
      page_obj = paginator.page(paginator.num_pages)

  
    return JsonResponse({'listings': list(page_obj.object_list), 'lastpage': page >= paginator.num_pages}, status=200)

  # On POST: create a new listing
  if request.method == 'POST':
    print(request.user)
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
          result = validateAddress(request.POST['address'])
          if(result == None):
            return JsonResponse({"errors": "Address not found."}, status=404)
          form.instance.latitude = result['lon']
          form.instance.longitude = result['lat']

          listing = form.save()
          print(listing)

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
        return JsonResponse({"errors": "Cannot modify listing owned by another user."}, status=403)
        
      # If user is not signed in, return 401 status
      return JsonResponse({"errors": "User must be logged in for this action."}, status=401)
      
    # On DELETE - Delete the listing with the given id
    if request.method == 'DELETE':
      
      # Check that the user is signed in
      if request.user.is_authenticated:

        # Check that the user is attempting to delete their own listing
        if listing.owner == request.user:

          # Delete the listing and return a 200 status
          listing.delete()
          return JsonResponse({'message': 'Listing deleted successfully.'}, status=200)
        
        # If user does not match owner of listing, return 403 status
        return JsonResponse({"errors": "Cannot modify listing owned by another user."}, status=403)
      
      # If user is not signed in, return 401 status
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

    # -------- PARAMS -------- # 

    # PAGE - Tells us which page to display

    try: 
      page = request.GET.get('page', 1)
      page = int(page)

    except (TypeError, ValueError): 
      return JsonResponse({"errors": "Page must be a positive integer."}, status=400)
    
    if page < 1:
      return JsonResponse({"errors": "Page must be a positive integer."}, status=400)

    # ------------------------ #

    # Attempt to find the given listing
    try: 
      listing = Listing.objects.get(id=lid)

    # If no listing is found with the given id, we return a 404 status code
    except Listing.DoesNotExist:
      return JsonResponse({"errors": "Listing with given ID does not exist."}, status=404)
    
    images = listing.images.all()
    
    paginator = Paginator(ListingImageSerializer(images, many=True).data, IMAGE_PAGINATION_COUNT)

    # Attempt to get the page for which we are queried, if we are queried out of our range, we return the last page
    try:
      page_obj = paginator.page(page)
    except EmptyPage:
      page_obj = paginator.page(paginator.num_pages)

    return JsonResponse({'images': list(page_obj.object_list), 'lastpage': page >= paginator.num_pages}, status=200)
  
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

# ------------------------------------------------------------------------------------------ #

@csrf_exempt
def validateAddress(address):
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": address,
        "format": "json",
        "addressdetails": 1 
    }
    headers= {
        "User-Agent": "unirentals (jjjchen52@gmail.com)"
    }
    response = requests.get(url, params=params, headers=headers)
    if response.status_code == 200:
        results = response.json()
        if results:
            return results[0]  # Return the first matched result
        else:
            return None  # Address not found
    else:
        response.raise_for_status()