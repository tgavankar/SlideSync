from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.core.urlresolvers import reverse
from django.http import HttpResponse, HttpResponseForbidden, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404

from forms import PresentationForm
from models import Presentation


@login_required
def gallery(request):
    presos = Presentation.objects.filter(creator=request.user)
    return render(request, 'presos/gallery.html', {'presos': presos})

list = gallery

@login_required
def edit(request, preso_id):
    preso = get_object_or_404(Presentation, pk=preso_id)
    if preso.creator != request.user:
        return PermissionDenied()

@login_required
def create(request):
    if request.method == 'POST':
        preso = Presentation(creator=request.user)
        form = PresentationForm(request.POST, request.FILES, instance=preso)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse('presos:gallery'))
    else:
        form = PresentationForm()
    return render(request, 'presos/create.html', {'form': form})

@login_required
def present(request, preso_id):
    preso = get_object_or_404(Presentation, pk=preso_id)
    if preso.creator != request.user:
        return PermissionDenied()
    return render(request, 'presos/present.html', {'preso': preso})

def view(request, preso_id):
    preso = get_object_or_404(Presentation, pk=preso_id)
    return render(request, 'presos/view.html', {'preso': preso})
