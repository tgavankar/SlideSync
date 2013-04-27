from django.http import HttpResponse
from django.shortcuts import render

from socketio import socketio_manage

from presos.sockets import PresentNamespace

def index(request):
    return render(request, 'slidesync/landing.html')

def about(request):
    return render(request, 'slidesync/about.html')

def socketio(request):
    socketio_manage(request.environ, {'/present': PresentNamespace,}, request=request)
    return HttpResponse()