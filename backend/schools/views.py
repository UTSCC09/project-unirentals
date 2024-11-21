from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import School
from .serializers import SchoolSerializer

# Create your views here.
def schoolView(request):
  if request.method == 'GET':
    schools = School.objects.all()
    serializer = SchoolSerializer(schools, many=True)

    return JsonResponse({"schools": serializer.data}, status=200)
  
  return JsonResponse({"errors": "Method not allowed."}, status=405)

def specificSchoolView(request, id):
  if request.method == 'GET':
    try:
      school = School.objects.get(id=id)
      serializer = SchoolSerializer(school)

      return JsonResponse(serializer.data, status=200)
    
    except School.DoesNotExist:
      return JsonResponse({"errors": "School with given ID does not exist."}, status=404)
  
  return JsonResponse({"errors": "Method not allowed."}, status=405)