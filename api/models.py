from django.contrib.auth.models import AbstractUser, Group, Permission, User
from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import make_password, check_password



#clase tarea
class Tarea(models.Model):
    nombre = models.TextField(unique=True)
    estado = models.BooleanField(default=False)
    def __str__(self):
        return self.nombre