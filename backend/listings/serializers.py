from rest_framework import serializers
from .models import Listing, ListingImage

class ListingSerializer(serializers.ModelSerializer):
    school = serializers.CharField(source='school.name', read_only=True)
    class Meta:
        model = Listing
        fields = '__all__'

class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = '__all__'