from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import RentalApplication
from listings.models import Listing
from .serializers import ApplicationSerializer
from django.core.paginator import Paginator, EmptyPage

# A constant value for the pagination count
APPLICATION_PAGINATION_COUNT = 5

# Create your views here.
@csrf_exempt
def applicationView(request, lid):

  # On GET: return paginated (full/open) listings 
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
    
    # FULL - Tells us if we send all applications, or just those with space

    full = request.GET.get('full', 'false').lower()
    
    if full not in ['true', 'false', '1', '0', 'yes', 'no']:
      return JsonResponse({'errors': "Invalid value for 'full'. Use 'true' or 'false'."}, status=400)
      
    full = full in ['true', '1', 'yes']

    # ------------------------ #

    # Attempt to find a listing matching the given id
    try:
      listing = Listing.objects.get(id=lid)
      applications = RentalApplication.objects.filter(listing=listing)
    
      # If we are allowing for full listings we show everything
      if not full:
        applications = applications.filter(full=False)

      paginator = Paginator(ApplicationSerializer(applications, many=True).data, APPLICATION_PAGINATION_COUNT)

      # Attempt to get the page for which we are queried, if we are queried out of our range, we return the last page
      try:
        page_obj = paginator.page(page)
      except EmptyPage:
        page_obj = paginator.page(paginator.num_pages)

      return JsonResponse({'applications': list(page_obj.object_list), 'lastpage': page >= paginator.num_pages})
    
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
    
    # Check that the user is signed in
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

  if request.method == 'DELETE':
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
    
    # Check that the user is signed in
    if request.user.is_authenticated:
      user = request.user

      # Check if the user is part of this application
      if user in application.users.all():
        
        # The user is associated with this application, so we can remove the relationship and return a 200 status
        application.users.remove(user)
        return JsonResponse({"message": "User successfully removed from application."}, status=200) 
      
      # If the user is not a part of this application, they cannot delete themselves from it
      return JsonResponse({"errors": "User is not a member of this application."}, status=403) 

    # If a user is not signed in they are unable to apply to the listing
    return JsonResponse({"errors": "User must be logged in for this action."}, status=401) 

  # If a non GET/POST/DELETE method is attempted, return 405 status
  return JsonResponse({"errors": "Method not allowed."}, status=405)

# ------------------------------------------------------------------------------------------ #

@csrf_exempt
def applicationSelfView(request, lid):

  # On GET: Return informaton about the application the user is assocaited with
  if request.method == 'GET':
    
    # Attempt to find the listing with the given id
    try:
      listing = Listing.objects.get(id=lid)

    # If listing with given ID not found, return 404 status
    except Listing.DoesNotExist:
      return JsonResponse({"errors": "Listing with given ID does not exist."}, status=404)
    
    # Check if the user is signed in
    if request.user.is_authenticated:

      user = request.user

      # Check that the user has an application for this listing
      try:
        application = user.user_applications.get(listing=listing)

      # If no such application exists, then we return a 404 status
      except RentalApplication.DoesNotExist:
        return JsonResponse({"errors": "User does not have an application to this listing"}, status=404) 
      
      # Serialize the listing and return
      serializer = ApplicationSerializer(application)
      return JsonResponse(serializer.data, status=200) 

    # If a user is not signed in they are unable to apply to the listing
    return JsonResponse({"errors": "User must be logged in for this action."}, status=401) 

  if request.method == 'DELETE':
    
    # Attempt to find the listing with the given id
    try:
      listing = Listing.objects.get(id=lid)

    # If listing with given ID not found, return 404 status
    except Listing.DoesNotExist:
      return JsonResponse({"errors": "Listing with given ID does not exist."}, status=404)
    
    # Check if the user is signed in
    if request.user.is_authenticated:

      user = request.user

      # Check that the user has an application for this listing
      try:
        application = user.user_applications.get(listing=listing)

      # If no such application exists, then we return a 404 status
      except RentalApplication.DoesNotExist:
        return JsonResponse({"errors": "User does not have an application to this listing."}, status=404) 
      
      # Serialize the listing and return
      application.users.remove(user)
      return JsonResponse({"message": "Application withdrawn successfully."}, status=200) 

    # If a user is not signed in they are unable to apply to the listing
    return JsonResponse({"errors": "User must be logged in for this action."}, status=401) 

  # If a non GET/DELETE method is attempted, return 405 status
  return JsonResponse({"errors": "Method not allowed."}, status=405)