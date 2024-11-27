from django.db import models
from users.models import CustomUser
from listings.models import Listing

# Create your models here.
class RentalApplication(models.Model):
  
  users = models.ManyToManyField(CustomUser, related_name='user_applications', blank=True)
  listing = models.ForeignKey(Listing, on_delete=models.CASCADE)
  created_at = models.DateTimeField(auto_now_add=True, null=True)
  full = models.BooleanField(default=False)

  def __str__(self):
    return self.listing.address