from django.db import models
from django.contrib.auth.models import User

class Person(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    name = models.CharField(max_length=255)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='M')
    spouse_name = models.CharField(max_length=255, null=True, blank=True)
    birth_year = models.IntegerField(null=True, blank=True)
    death_year = models.IntegerField(null=True, blank=True)
    profession = models.CharField(max_length=255, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='people', null=True, blank=True)

    def __str__(self):
        return self.name
