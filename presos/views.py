from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.http import HttpResponseForbidden
from django.shortcuts import render, get_object_or_404

from models import Presentation

@login_required
def gallery(request):
    presos = Presentation.objects.filter(creator=request.user)
    return render(request, 'presos/gallery.html', {'presos': presos})

@login_required
def edit(request, preso_id):
    preso = get_object_or_404(Presentation, pk=preso_id)
    if preso.creator != request.user:
        return PermissionDenied()

@login_required
def create(request):
    pass