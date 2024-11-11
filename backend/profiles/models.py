from django.db import models
from users.models import CustomUser

# Create your models here.
class userProfile(models.Model):
  
  user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)

  first_name = models.CharField()
  last_name = models.CharField()

  age = models.PositiveIntegerField()
  pronouns = models.CharField()
  school = models.CharField()

  bio = models.TextField()

  smokes = models.BooleanField()
  pets = models.BooleanField()
  drinks = models.BooleanField()

  profilePic = models.ImageField()