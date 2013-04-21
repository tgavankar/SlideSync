from django.conf.urls import patterns, include, url
from django.http import HttpResponseRedirect

from accounts import views

urlpatterns = patterns('',
    url(r'^$', lambda x: HttpResponseRedirect('profile/')),
    url(r'^profile/', views.profile, name='profile'),
)
