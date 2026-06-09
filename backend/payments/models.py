from __future__ import annotations

from decimal import Decimal

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models

from core.models import TimeStampedModel

from .choices import Currency
from .validators import normalize_serbian_bank_account


class RecipientDataBase(TimeStampedModel):
    recipient_full_name = models.CharField(max_length=255)
    recipient_address = models.TextField()
    bank_account = models.CharField(max_length=18)

    class Meta:
        abstract = True

    def full_clean(self, *args, **kwargs) -> None:
        if self.bank_account:
            self.bank_account = normalize_serbian_bank_account(self.bank_account)
        return super().full_clean(*args, **kwargs)


class SavedRecipient(RecipientDataBase):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saved_recipients",
    )

    def __str__(self) -> str:
        return self.recipient_full_name


class PaymentOrder(RecipientDataBase):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payment_orders",
    )
    sender_name = models.CharField(max_length=255)
    sender_address = models.TextField()
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
    )
    currency = models.CharField(max_length=3, choices=Currency.choices)
    reference_model = models.CharField(max_length=10, blank=True)
    reference_number = models.CharField(max_length=50, blank=True)

    def __str__(self) -> str:
        return f"{self.recipient_full_name} - {self.amount} {self.currency}"
