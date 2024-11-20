from django.db import models

# Create your models here.
class School(models.Model):
  name = models.CharField(max_length=100)

  address = models.CharField(max_length=300)
  longitude = models.FloatField()
  latitude = models.FloatField()