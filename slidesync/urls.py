from django.conf import settings
from django.conf.urls import patterns, include, static, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'slidesync.views.index', name='index'),
    url(r'^about/', 'slidesync.views.about', name='about'),
    # url(r'^slidesync/', include('slidesync.foo.urls')),

    url(r'^%s(?P<path>.*)$' % settings.MEDIA_URL[1:], 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/', include('registration.backends.default.urls')),
    url(r'^accounts/', include('registration.auth_urls')),
    url(r'^accounts/', include('accounts.urls')),
    url(r'^presos/', include('presos.urls', namespace="presos")),
    url(r'', include('progressbarupload.urls')),
    url(r'^socket\.io', 'slidesync.views.socketio', name='socketio'),
)
