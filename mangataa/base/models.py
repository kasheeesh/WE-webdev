from django.db import models


class Player(models.Model):
    name = models.CharField(max_length=100)
    bet_card = models.CharField(max_length=20)  # e.g., "2 of Hearts"
    bet_type = models.CharField(max_length=3, choices=[
                                ('in', 'In'), ('out', 'Out')])
    bet_amount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name


class Game(models.Model):
    players = models.ManyToManyField(Player)
    dealer_cards = models.JSONField()  # Stores the shuffled cards dealt
    winner = models.CharField(max_length=100, blank=True, null=True)

# Create your models here.
