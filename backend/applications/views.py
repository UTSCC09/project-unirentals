from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import RentalApplication
from listings.models import Listing
from .serializers import ApplicationSerializer
from django.core.paginator import Paginator, EmptyPage

# Create your views here.
@csrf_exempt
def applicationView(request, lid):

  # A constant value for the pagination count
  APPLICATION_PAGINATION_COUNT = 5

  # On GET: return paginated (full/open) listings 
  if request.method == 'GET':

    # Attempt to find a listing matching the given id
    try:
      listing = Listing.objects.get(id=lid)
      applications = RentalApplication.objects.filter(listing=listing)

      #Set our parameter values for pagination and display
      page = request.GET.get('page', 1)
      
      try:
        page = int(page)
      
      # If page is supplied with an improper value, return 404 status
      except (TypeError, ValueError): 
        return JsonResponse({"errors": "Page must be an integer."}, status=400)
    
      # Attempt to get the boolean value for whether or not to display full listings
      full = request.GET.get('full', 'false').lower()
      if full not in ['true', 'false', '1', '0', 'yes', 'no']:
        print(full)
        return JsonResponse({'errors': "Invalid value for 'full'. Use 'true' or 'false'."}, status=400)
      
      full = full in ['true', '1', 'yes']

      # If we are allowing for full listings we show everything
      if not full:
        applications = applications.filter(full=False)

      paginator = Paginator(ApplicationSerializer(applications, many=True).data, APPLICATION_PAGINATION_COUNT)

      # Attempt to get the page for which we are queried, if we are queried out of our range, we return the last page
      try:
        page_obj = paginator.page(page)
      except EmptyPage:
        page_obj = paginator.page(paginator.num_pages)

      return JsonResponse({'applications': list(page_obj.object_list)})
    
    # If listing with given ID not found, return 404 status
    except Listing.DoesNotExist:
      return JsonResponse({"errors": "Listing with given ID does not exist."}, status=404)
    
  if request.method == 'POST':
    
    # Attempt to find the listing with the given ID
    try:
      listing = Listing.objects.get(id=lid)

    # If listing with given ID not found, return 404 status
    except Listing.DoesNotExist:
      return JsonResponse({"errors": "Listing with given ID does not exist."}, status=404)
    
    # Check that the user is signed in
    if request.user.is_authenticated:
      user = request.user

      # Check if the user has another application with this listing
      if user.user_applications.filter(listing=listing).exists():
        return JsonResponse({"errors": "User already has an application to this listing."}, status=409)
      
      # Create a new application to the listing, with the requesting user as a user
      application = RentalApplication.objects.create(listing=listing)
      application.users.add(user)
      
      return JsonResponse({"message": "Application created successfully"}, status=200)
    
    # If the user is not signed in, they are unable to make a post
    return JsonResponse({"errors": "User must be logged in for this action."}, status=401) 

  # If a non GET/POST method is attempted, return 405 status
  return JsonResponse({"errors": "Method not allowed."}, status=405)

# ------------------------------------------------------------------------------------------ #

@csrf_exempt
def applicationSpecificView(request, lid, rid): #/api/listings/<lid>/applications/<rid>/

  # On GET: return listing details 
  if request.method == 'GET':

    # Attempt to find a listing matching the given id
    try:
      listing = Listing.objects.get(id=lid)
      application = RentalApplication.objects.get(listing=listing, id=rid)

      serializer = ApplicationSerializer(application)
      return JsonResponse(serializer.data, status=200)
    
    # If listing with given ID not found, return 404 status
    except Listing.DoesNotExist:
      return JsonResponse({"errors": "Listing with given ID does not exist."}, status=404)
    
    # If application with given ID not found, return 404 status
    except RentalApplication.DoesNotExist:
      return JsonResponse({"errors": "Application with given ID does not exist for given listing."}, status=404)
  
  # On POST: Add a user to an existing application
  if request.method == 'POST':
    
    # Attempt to find the listing and application with the given ID's
    try:
      listing = Listing.objects.get(id=lid)
      application = RentalApplication.objects.get(listing=listing, id=rid)

    # If listing with given ID not found, return 404 status
    except Listing.DoesNotExist:
      return JsonResponse({"errors": "Listing with given ID does not exist."}, status=404)
    
    # If application with given ID not found, return 404 status
    except RentalApplication.DoesNotExist:
      return JsonResponse({"errors": "Application with given ID does not exist for given listing."}, status=404)
    
    if request.user.is_authenticated:
      user = request.user

      # Check if the user has another application with this listing
      if user.user_applications.filter(listing=listing).exists():
        return JsonResponse({"errors": "User already has an application to this listing."}, status=409)
      
      # Check if the application is full, if so, we can't allow another user to join
      if application.full:
        return JsonResponse({"errors": "This application is full and no longer accepting applicants."}, status=403)
      
      # If the application is not full, then the user is able to apply
      application.users.add(user)
      return JsonResponse({"message": "Application joined successfully"}, status=200)

    # If a user is not signed in they are unable to apply to the listing
    return JsonResponse({"errors": "User must be logged in for this action."}, status=401) 

  # If a non GET/POST/DELETE method is attempted, return 405 status
  return JsonResponse({"errors": "Method not allowed."}, status=405)