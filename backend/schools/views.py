from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import School
from .serializers import SchoolSerializer

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
def specificSchoolView(request, id):

  # On GET - Return information about the given school with matching id
  if request.method == 'GET':
    
    # Attempt to find a school with a matching id
    try:
      school = School.objects.get(id=id)
      serializer = SchoolSerializer(school)

      # Return information about the school with the given id
      return JsonResponse(serializer.data, status=200)
    
    # If no school is found matching the id, return 404 status
    except School.DoesNotExist:
      return JsonResponse({"errors": "School with given ID does not exist."}, status=404)
  
  # If non GET Method, return 405 status
  return JsonResponse({"errors": "Method not allowed."}, status=405)