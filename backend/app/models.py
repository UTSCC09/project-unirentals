from django.db import models

# Create your models here.
class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=100, unique=True)
    password = models.CharField(max_length=100)

    def __str__(self):
        return self.email