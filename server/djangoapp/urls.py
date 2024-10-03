from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'
urlpatterns = [
    path('login/', view=views.login_user, name='login'),
    path('logout/', view=views.logout_request, name='logout'),
    path('register/', view=views.registration, name='register'),
    path('get_cars/', view=views.get_cars, name='get_cars'),  # Add this line
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
