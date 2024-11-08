from django.shortcuts import render, redirect
from .models import Player, Game

import random


def home(request):
    if request.method == 'POST':
        player_count = int(request.POST['player_count'])
        players = [{'id': i, 'name': ''} for i in range(player_count)]
        return render(request, 'game_setup.html', {'players': players})
    return render(request, 'home.html')


def landing(request):
    if request.method == 'POST':
        return redirect('home')
    return render(request, 'welcome.html')


amount = 0
winnernames = []


def game(request):
    global amount
    if request.method == 'POST':
        players_data = request.POST.getlist('player_data')
        bet_cards = request.POST.getlist('bet_card')
        bet_type = request.POST.getlist('bet_type')
        bet_amount = request.POST.getlist('bet_amount')

        amount = 0
        for i in bet_amount:
            amount += int(i)

        players = []
        print(players_data)
        for name, bet_card, bet_type, bet_amount in zip(players_data, bet_cards, bet_type, bet_amount):
            player = Player.objects.create(
                name=name, bet_card=bet_card, bet_type=bet_type, bet_amount=bet_amount)
            players.append(player)

        cards = [f"{rank} of {suit}" for suit in [
            'Hearts', 'Diamonds', 'Clubs', 'Spades'] for rank in range(1, 14)]
        random.shuffle(cards)
        in_pile, out_pile = cards[::2], cards[1::2]

        game = Game()
        game.dealer_cards = {'in': in_pile, 'out': out_pile}
        game.save()
        game.players.set(players)
        game.save()
        return redirect('result', game_id=game.id)


def result(request, game_id):
    global winnernames
    global amount
    winnernames = []
    game = Game.objects.get(id=game_id)
    winner = None
    for player in game.players.all():
        if player.bet_card in game.dealer_cards[player.bet_type]:
            winnernames.append(player.name)
            winner = player.name
            # game.winner += player.name
            # break
    game.winner = winnernames
    if not winner:
        game.winner = "Dealer"
    if (len(winnernames) != 0):
        amount = amount/len(winnernames)

    game.save()
    return render(request, 'results.html', {'game': game, 'winner': game.winner, 'amount': amount})
