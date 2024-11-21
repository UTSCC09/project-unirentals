from django.forms import ModelForm
from django import forms
from .models import Listing

class ListingForm(ModelForm):
  class Meta:
    model = Listing
    fields = '__all__'
    exclude = ['owner', 'school', 'created_at']