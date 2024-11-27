from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver
from .models import RentalApplication

@receiver(m2m_changed, sender=RentalApplication.users.through)
def applicationUserChange(sender, instance, action, **kwargs):

  # Check if a user is being added or removed
  if action in ['post_add', 'post_remove']:
    instance.full = instance.users.count() == instance.listing.bedrooms
    instance.save(update_fields=['full'])

  if action in ['post_remove', 'post_clear']:  # Check after users are removed or cleared
    if not instance.users.exists():  # If no users remain
      instance.delete()