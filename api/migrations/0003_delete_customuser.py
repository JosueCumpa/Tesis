# Generated by Django 4.2.6 on 2023-10-24 22:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_customuser'),
    ]

    operations = [
        migrations.DeleteModel(
            name='CustomUser',
        ),
    ]
