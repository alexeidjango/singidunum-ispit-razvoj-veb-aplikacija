from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from core.models import TimeStampedModel


class User(AbstractBaseUser, PermissionsMixin, TimeStampedModel):
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    address = models.TextField()
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = BaseUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name", "address"]

    def __str__(self) -> str:
        return self.email

    def full_clean(self, *args, **kwargs) -> None:
        if self.email:
            self.email = self.email.lower()
        return super().full_clean(*args, **kwargs)
