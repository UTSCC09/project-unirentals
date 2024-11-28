from rest_framework import serializers
from .models import RentalApplication

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = RentalApplication
        fields = '__all__'