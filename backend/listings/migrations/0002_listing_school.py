# Generated by Django 5.1.3 on 2024-11-21 05:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('listings', '0001_initial'),
        ('schools', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='listing',
            name='school',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='schools.school'),
        ),
    ]
