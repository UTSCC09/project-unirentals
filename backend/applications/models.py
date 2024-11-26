from django.db import models
from users.models import CustomUser
from listings.models import Listing

# Create your models here.
class RentalApplication(models.Model):
  
  users = models.ManyToManyField(CustomUser, on_delete=models.CASCADE, related_name='user_applications')
  listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='listing_applications')
  created_at = models.DateTimeField(auto_now_add=True, null=True)
  full = models.BooleanField(default=False)

  def __str__(self):
    return self.listing.address + " (id:" + self.id + ")"
  
  def save(self, *args, **kwargs):
    # Check if the number of applications matches the number of bedrooms, and set to full if so
    if self.users.count() == self.listing.bedrooms:
      self.full = True
    
    super().save(*args, **kwargs)