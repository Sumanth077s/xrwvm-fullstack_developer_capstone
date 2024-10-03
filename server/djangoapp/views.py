# views.py
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import logout, login, authenticate
import logging
import json
from django.views.decorators.csrf import csrf_exempt
from .models import CarMake, CarModel, Dealership, Review  # Ensure these models are defined in models.py
from .populate import initiate

# Get an instance of a logger
logger = logging.getLogger(__name__)

# User authentication views
@csrf_exempt
def login_user(request):
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    user = authenticate(username=username, password=password)
    response_data = {"userName": username}

    if user is not None:
        login(request, user)
        response_data["status"] = "Authenticated"
    else:
        response_data["status"] = "Authentication Failed"
    
    return JsonResponse(response_data)

def logout_request(request):
    logout(request)
    return JsonResponse({"userName": ""})

@csrf_exempt
def registration(request):
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    first_name = data['firstName']
    last_name = data['lastName']
    email = data['email']

    if User.objects.filter(username=username).exists():
        return JsonResponse({"userName": username, "error": "Already Registered"})

    user = User.objects.create_user(username=username, first_name=first_name, last_name=last_name, password=password, email=email)
    login(request, user)
    return JsonResponse({"userName": username, "status": "Authenticated"})

# New views for dealerships and reviews
def get_dealerships(request):
    dealerships = Dealership.objects.all()
    return JsonResponse({"dealerships": list(dealerships.values())})

def get_dealer_reviews(request, dealer_id):
    reviews = Review.objects.filter(dealership_id=dealer_id)
    return JsonResponse({"reviews": list(reviews.values())})

def get_dealer_details(request, dealer_id):
    dealer = get_object_or_404(Dealership, id=dealer_id)
    return JsonResponse({"dealer": dealer})

@csrf_exempt
def add_review(request):
    if request.method == "POST":
        if not request.user.is_authenticated:
            return JsonResponse({"status": "error", "message": "User not authenticated"}, status=401)

        data = json.loads(request.body)
        dealer_id = data.get('dealer_id')
        review_text = data.get('review_text')

        if not dealer_id or not review_text:
            return JsonResponse({"status": "error", "message": "Missing dealer_id or review_text"}, status=400)

        # Create and save the review
        review = Review(dealership_id=dealer_id, user=request.user, review_text=review_text)
        review.save()

        return JsonResponse({"status": "success", "review": review_text})

    return JsonResponse({"status": "error", "message": "Invalid request method"}, status=405)
