from django.db import models
from users.models import CustomUser

# Create your models here.
class Listing(models.Model):
  owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
  #university = models.CharField(max_length=100, blank=True, null=True)

  price = models.PositiveIntegerField(null=True)
  
  address = models.CharField(max_length=300, null=True)

  bedrooms = models.PositiveIntegerField(null=True)
  bathrooms = models.PositiveIntegerField(null=True)
  kitchen = models.PositiveIntegerField(null=True)
  
  description = models.TextField(blank=True, null=True)

  pets = models.BooleanField(default=False)
  smokes = models.BooleanField(default=False)
  drinks = models.BooleanField(default=False)

  created_at = models.DateTimeField(auto_now_add=True, null=True)

  def __str__(self):
    return self.location

