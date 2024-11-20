from django.forms import ModelForm
from django import forms
from .models import Listing

class listingForm(ModelForm):
  class Meta:
    model = Listing
    fields = '__all__'
    exclude = ['owner', 'created_at']