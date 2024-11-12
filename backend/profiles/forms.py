from django.forms import ModelForm
from django import forms
from .models import userProfile

class profileForm(ModelForm):
  class Meta:
    model = userProfile
    fields = '__all__'
    exclude = ['user']