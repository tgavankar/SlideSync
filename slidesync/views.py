from django.http import HttpResponse
from django.shortcuts import render

def index(request):
    return render(request, 'slidesync/landing.html')

def about(request):
    return render(request, 'slidesync/about.html')