from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateField()
    time = models.TimeField()
    location = models.CharField(max_length=255)
    organizer = models.ForeignKey(User, on_delete=models.CASCADE)
    ticket_price = models.DecimalField(max_digits=10, decimal_places=2)
    privacy = models.BooleanField(default=False)  # Public/Private event

    def __str__(self):
        return self.title


class Attendee(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    ticket_type = models.CharField(max_length=50)

    def __str__(self):
        return f'{self.user.username} attending {self.event.title}'


