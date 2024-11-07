# Generated by Django 4.2.5 on 2024-11-07 15:53

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('bet_card', models.CharField(max_length=20)),
                ('bet_type', models.CharField(choices=[('in', 'In'), ('out', 'Out')], max_length=3)),
                ('bet_amount', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dealer_cards', models.JSONField()),
                ('winner', models.CharField(blank=True, max_length=100, null=True)),
                ('players', models.ManyToManyField(to='base.player')),
            ],
        ),
    ]