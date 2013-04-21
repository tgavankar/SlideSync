from django import forms

from ajax_upload import widgets

from models import Presentation


class PresentationForm(forms.ModelForm):
    class Meta:
        model = Presentation