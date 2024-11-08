

from django.urls import path
from . import views

urlpatterns = [
    path('', views.landing, name='landing'),
    path('home/', views.home, name='home'),
    path('game/', views.game, name='game'),
    path('result/<int:game_id>', views.result, name='result'),
]
