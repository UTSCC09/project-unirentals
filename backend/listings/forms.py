from django.forms import ModelForm
from django import forms
from .models import Listing

class profileForm(ModelForm):
  class Meta:
    model = Listing
    fields = '__all__'
    exclude = ['user']