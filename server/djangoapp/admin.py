from django.contrib import admin
from .models import CarMake, CarModel

# CarModelInline class allows CarModel to be edited on the same page as CarMake
class CarModelInline(admin.TabularInline):
    model = CarModel
    extra = 1  # Number of empty CarModel instances to display by default

# CarMakeAdmin class with CarModelInline, to show related CarModels inline
class CarMakeAdmin(admin.ModelAdmin):
    inlines = [CarModelInline]  # Show CarModel inline when editing CarMake
    list_display = ('name', 'description')  # Customize the list view
    search_fields = ['name']  # Add a search bar for the CarMake name

# CarModelAdmin class to customize how CarModel objects are displayed in the admin
class CarModelAdmin(admin.ModelAdmin):
    list_display = ('name', 'car_make', 'type', 'year')  # Updated to remove 'dealer_id' if it doesn't exist in the model
    list_filter = ['type', 'year']  # Add filters to the CarModel list view
    search_fields = ['name']  # Add a search bar for the CarModel name

# Register models with the Django admin site
admin.site.register(CarMake, CarMakeAdmin)
admin.site.register(CarModel, CarModelAdmin)
