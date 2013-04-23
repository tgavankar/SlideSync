from django.conf.urls import patterns, include, url
from django.http import HttpResponseRedirect

from presos import views

urlpatterns = patterns('',
    url(r'^$', lambda x: HttpResponseRedirect('gallery/')),
    url(r'^gallery/', views.gallery, name='gallery'),
    url(r'^list/', views.list, name='list'),
    url(r'^(?P<preso_id>\d+)/$', views.edit, name='edit'),
    url(r'^(?P<preso_id>\d+)/view/$', views.view, name='view'),
    url(r'^(?P<preso_id>\d+)/present/$', views.present, name='present'),
    url(r'^create/', views.create, name='create'),
)
