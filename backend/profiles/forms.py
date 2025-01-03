from django.forms import ModelForm
from django import forms
from .models import userProfile

class ProfileForm(ModelForm):
  class Meta:
    model = userProfile
    fields = '__all__'
    exclude = ['user', 'school', 'created_at']