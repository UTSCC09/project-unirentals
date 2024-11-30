from django.test import TestCase
from listings.views import validateAddress


# Example Usage
address = "1265 Military Trail"
result = validateAddress(address)

if result:
    print(f"Validated Address: {result['display_name']}")
    print(f"Coordinates: {result['lat']}, {result['lon']}")
else:
    print("Address not found.")