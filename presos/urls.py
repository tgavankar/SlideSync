from django.conf.urls import patterns, include, url
from django.http import HttpResponseRedirect

from presos import views

urlpatterns = patterns('',
    url(r'^$', lambda x: HttpResponseRedirect('gallery/')),
    url(r'^gallery/', views.gallery, name='gallery'),
    url(r'^(?P<preso_id>\d+)/$', views.edit, name='edit'),
)
