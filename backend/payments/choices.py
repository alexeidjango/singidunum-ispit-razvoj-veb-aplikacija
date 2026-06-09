from django.db import models


class Currency(models.TextChoices):
    RSD = "RSD", "RSD"
    EUR = "EUR", "EUR"
    USD = "USD", "USD"
