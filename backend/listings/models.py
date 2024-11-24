from django.db import models
from users.models import CustomUser
from schools.models import School

# Create your models here.
class Listing(models.Model):
  owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
  school = models.ForeignKey(School, on_delete=models.CASCADE, null=True)

  price = models.PositiveIntegerField(null=True)
  
  address = models.CharField(max_length=300, null=True)
  longitude = models.FloatField(null=True)
  latitude = models.FloatField(null=True)
  distance = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)

  HOUSING_TYPE_CHOICES = [
          ('Apartment', 'Apartment'),
          ('House', 'House'),
          ('Studio', 'Studio'),
          ('Basement', 'Basement'),
          ('Room', 'Room'),
      ]

  type = models.CharField(max_length=10, choices=HOUSING_TYPE_CHOICES, null=True)

  bedrooms = models.PositiveIntegerField(null=True)
  bathrooms = models.PositiveIntegerField(null=True)
  kitchens = models.PositiveIntegerField(null=True)
  
  description = models.TextField(blank=True, null=True)

  pets = models.BooleanField(default=False)
  smokes = models.BooleanField(default=False)
  drinks = models.BooleanField(default=False)

  created_at = models.DateTimeField(auto_now_add=True, null=True)

  def __str__(self):
    return self.address