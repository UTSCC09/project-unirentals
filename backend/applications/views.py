from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import RentalApplication
from listings.models import Listing
from .serializers import ApplicationSerializer
from django.core.paginator import Paginator, EmptyPage

# Create your views here.
@csrf_exempt
def applicationView(request, lid): #/api/listings/<id>/applications/?page=int&full=Bool

  #A constant value for the pagination count
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
    


  # If a non GET/POST method is attempted, return 405 status
  return JsonResponse({"errors": "Method not allowed."}, status=405)
    
# @csrf_exempt
# def applicationSpecificView(request, lid, rid): #/api/listings/<id>/applications/<id>/