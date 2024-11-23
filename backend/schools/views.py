from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import School
from .serializers import SchoolSerializer
from listings.models import Listing
from listings.serializers import ListingSerializer

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
    
    # Attempt to find a school with a matching sid
    try:
      school = School.objects.get(id=sid)
      listings = Listing.objects.filter(school=school)
      serializer = ListingSerializer(listings, many=True)

      # Return listings for the school with the given sid
      return JsonResponse({'listings': serializer.data}, status=200)
    
    # If no school is found matching the sid, return 404 status
    except School.DoesNotExist:
      return JsonResponse({"errors": "School with given ID does not exist."}, status=404)
  
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