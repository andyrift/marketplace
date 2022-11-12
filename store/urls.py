from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='store-home'),
    path('profile', views.profile, name='store-profile'),
    path('help', views.help, name='store-help'),
    path('messages', views.dialogues, name='store-messages'),
    path('favorites', views.favorites, name='store-favorites')
]