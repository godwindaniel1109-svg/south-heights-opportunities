"""Add notify_sound to Profile"""
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_notification'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='notify_sound',
            field=models.BooleanField(default=True),
        ),
    ]
