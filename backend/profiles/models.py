from django.db import models
from users.models import CustomUser

# Create your models here.
class userProfile(models.Model):
  
  user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, null=True, blank=True)

  first_name = models.CharField(max_length=30, blank=True, null=True)
  last_name = models.CharField(max_length=30, blank=True, null=True)

  age = models.PositiveIntegerField(blank=True, null=True)
  pronouns = models.CharField(max_length=20, blank=True, null=True)
  school = models.CharField(max_length=100, blank=True, null=True)

  bio = models.TextField(blank=True, null=True)

  smokes = models.BooleanField(default=False)
  pets = models.BooleanField(default=False)
  drinks = models.BooleanField(default=False)

  def __str__(self):
    return self.user.email