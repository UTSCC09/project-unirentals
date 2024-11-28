from django.db import models
from users.models import CustomUser
from schools.models import School
from django.utils.crypto import get_random_string
import os, uuid

# Constant for where the default profile picture is kept
DEFAULT_PICTURE_PATH = 'profile_pics/default_profile.png'

# Helper function to randomly generate a filename
def generate_unique_filename(instance, filename):
    # Get file extension
    ext = filename.split('.')[-1]
    
    # Generate a unique name for the file (UUID and random string)
    unique_filename = f"{get_random_string(8)}_{uuid.uuid4().hex[:8]}.{ext}"
    
    # Define the directory structure in the bucket
    return os.path.join('profile_pics/', unique_filename)

# Create your models here.
class userProfile(models.Model):
  
  user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, null=True)
  school = models.ForeignKey(School, on_delete=models.CASCADE, null=True)

  first_name = models.CharField(max_length=30, blank=True, null=True)
  last_name = models.CharField(max_length=30, blank=True, null=True)

  age = models.PositiveIntegerField(blank=True, null=True)
  pronouns = models.CharField(max_length=20, blank=True, null=True)

  bio = models.TextField(blank=True, null=True)

  smokes = models.BooleanField(default=False)
  pets = models.BooleanField(default=False)
  drinks = models.BooleanField(default=False)

  profile_pic = models.ImageField(null=True, blank=True, upload_to=generate_unique_filename, default=DEFAULT_PICTURE_PATH)
  created_at = models.DateTimeField(auto_now_add=True, null=True)

  def __str__(self):
    return self.user.email
  
  def save(self, *args, **kwargs):
    # Check if the instance already exists in the database
    if self.pk:
      # Get the current profile object from the database
      old_profile = userProfile.objects.get(pk=self.pk)

      # If the profile_pic has changed and the old file exists, delete it
      if old_profile.profile_pic != self.profile_pic and old_profile.profile_pic and old_profile.profile_pic.name != DEFAULT_PICTURE_PATH:
        # Delete the old profile picture from Google Cloud Storage
        old_profile.profile_pic.delete(save=False)

    # Call the parent class's save method to save the object to the database
    super().save(*args, **kwargs)