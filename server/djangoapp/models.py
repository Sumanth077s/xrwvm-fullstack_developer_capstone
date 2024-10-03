# Uncomment the following imports before adding the Model code

from django.db import models
from django.utils.timezone import now
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.

# CarMake model
class CarMake(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    # String representation of the CarMake object
    def __str__(self):
        return self.name

# CarModel model
class CarModel(models.Model):
    # Many-to-One relationship with CarMake
    car_make = models.ForeignKey(CarMake, on_delete=models.CASCADE)
    
    # Dealer ID (refers to a dealer, can be a relation to another model or integer)
    dealer_id = models.IntegerField()
    
    # Name of the car model
    name = models.CharField(max_length=100)
    
    # Car type with limited choices
    CAR_TYPES = [
        ('SEDAN', 'Sedan'),
        ('SUV', 'SUV'),
        ('WAGON', 'Wagon'),
        # Add more car types as needed
    ]
    type = models.CharField(max_length=10, choices=CAR_TYPES, default='SUV')
    
    # Year with validation for minimum and maximum year values
    year = models.IntegerField(
        validators=[
            MinValueValidator(2015),  # Minimum year is 2015
            MaxValueValidator(2023)   # Maximum year is 2023
        ]
    )

    # String representation of the CarModel object
    def __str__(self):
        return f"{self.car_make.name} {self.name} ({self.year})"
