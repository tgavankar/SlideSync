from django.contrib.auth.models import User
from django.db import models

import datetime

class Presentation(models.Model):
    title = models.CharField(max_length=200)
    created = models.DateTimeField(editable=False)
    modified = models.DateTimeField(editable=False)
    creator = models.ForeignKey(User, editable=False)
    pdf = models.FileField(upload_to='pdf', name='pdf')

    def __unicode__(self):
        return "%s (%s) - %s" % (self.title, self.modified, self.creator)

    def save(self, *args, **kwargs):
        if not self.pk:
            # insert
            self.created = datetime.datetime.now()
        self.modified = datetime.datetime.now()
            
        super(Presentation, self).save(*args, **kwargs)

class Thumbnail(models.Model):
    presentation = models.ForeignKey(Presentation)
    image = models.ImageField(upload_to='thumbnails')