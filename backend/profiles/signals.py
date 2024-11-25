from django.db.models.signals import post_save
from users.models import CustomUser
from .models import userProfile

def make_profile(sender, instance, created, **kwargs):
  if created:
    userProfile.objects.create(
      user=instance
    )


post_save.connect(make_profile, sender=CustomUser)