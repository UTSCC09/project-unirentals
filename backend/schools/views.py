from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import School
from .serializers import SchoolSerializer
from listings.models import Listing
from listings.serializers import ListingSerializer
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from listings.views import LISTING_PAGINATION_COUNT, MAX_VALUE

# Create your views here.
@csrf_exempt
def schoolView(request):

  # On GET - Return list of all schools and their information
  if request.method == 'GET':
    schools = School.objects.all()
    serializer = SchoolSerializer(schools, many=True)

    return JsonResponse({"schools": serializer.data}, status=200)
  
  # If non GET Method, return 405 status
  return JsonResponse({"errors": "Method not allowed."}, status=405)

# ------------------------------------------------------------------------------------------ #

@csrf_exempt
def specificSchoolView(request, sid):

  # On GET - Return information about the given school with matching sid
  if request.method == 'GET':
    
    # Attempt to find a school with a matching sid
    try:
      school = School.objects.get(id=sid)
      serializer = SchoolSerializer(school)

      # Return information about the school with the given sid
      return JsonResponse(serializer.data, status=200)
    
    # If no school is found matching the sid, return 404 status
    except School.DoesNotExist:
      return JsonResponse({"errors": "School with given ID does not exist."}, status=404)
  
  # If non GET Method, return 405 status
  return JsonResponse({"errors": "Method not allowed."}, status=405)

# ------------------------------------------------------------------------------------------ #

@csrf_exempt
def schoolListingView(request, sid):
  # On GET - Return all listings associated with the given school
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
    
    # Attempt to find a school with a matching sid
    try:
      school = School.objects.get(id=sid)

    # If no school is found matching the sid, return 404 status
    except School.DoesNotExist:
      return JsonResponse({"errors": "School with given ID does not exist."}, status=404)

    # Filter our listings by our given filters
    listings = Listing.objects.filter(price__lte=price,
                                       distance__lte=distance, 
                                       bedrooms__gte=bedrooms, 
                                       bathrooms__gte=bathrooms,
                                       kitchens__gte=kitchens,
                                       school=school)
    
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

    # If the all flag is present return all listings for the school with the given sid
    if all:
      return JsonResponse({'listings': serializer.data}, status=200)
    
    # If the flag is not active, create a paginator, and return the appropriate page.
    paginator = Paginator(serializer.data, LISTING_PAGINATION_COUNT)

    # Attempt to get the desired page
    try:
      page_obj = paginator.page(page)

    # If the given page is out of range, we just return the last page
    except EmptyPage:
      page_obj = paginator.page(paginator.num_pages)
  
    return JsonResponse({'listings': list(page_obj.object_list), 'lastpage': page >= paginator.num_pages}, status=200)

  
  # If non GET Method, return 405 status
  return JsonResponse({"errors": "Method not allowed."}, status=405)

# ------------------------------------------------------------------------------------------ #

@csrf_exempt
def specificSchoolListingView(request, sid, lid):
  # On GET - Return all listings associated with the given school
  if request.method == 'GET':
    
    # Attempt to find a school with a matching id
    try:
      school = School.objects.get(id=sid)
      listing = Listing.objects.get(school=school, id=lid)
      serializer = ListingSerializer(listing)

      # Return listing with given id for the school with the given id
      return JsonResponse({'listings': serializer.data}, status=200)
    
    # If no school is found matching the sid, return 404 status
    except School.DoesNotExist:
      return JsonResponse({"errors": "School with given ID does not exist."}, status=404)
    
    # If no school is found matching the lid, return 404 status
    except Listing.DoesNotExist:
      return JsonResponse({"errors": "Listing with given ID does not exist for school with given ID."}, status=404)
  
  # If non GET Method, return 405 status
  return JsonResponse({"errors": "Method not allowed."}, status=405)

# ------------------------------------------------------------------------------------------ #