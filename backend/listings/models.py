from django.db import models
from users.models import CustomUser
from schools.models import School
from geopy.distance import geodesic
from django.core.validators import MinValueValidator

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

  bedrooms = models.PositiveIntegerField(null=True, validators=[MinValueValidator(1)])
  bathrooms = models.PositiveIntegerField(null=True)
  kitchens = models.PositiveIntegerField(null=True)
  
  description = models.TextField(blank=True, null=True)

  pets = models.BooleanField(default=False)
  smokes = models.BooleanField(default=False)
  drinks = models.BooleanField(default=False)

  created_at = models.DateTimeField(auto_now_add=True, null=True)

  def __str__(self):
    return self.address
  
  def save(self, *args, **kwargs):
    # Calculate the distance to campus based on the given coordinates
    coords1 = (self.latitude, self.longitude)
    coords2 = (self.school.latitude, self.school.longitude)
    self.distance = round(geodesic(coords1, coords2).kilometers, 2)
    
    super().save(*args, **kwargs)

class ListingImage(models.Model):
  listing = models.ForeignKey(Listing, related_name='images', on_delete=models.CASCADE)
  image = models.ImageField(upload_to='listing_images/')
  uploaded_at = models.DateTimeField(auto_now_add=True)