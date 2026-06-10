from decimal import Decimal

from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.db import models

from core.models import TimeStampedModel
from users.models import User

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
            try:
                self.bank_account = normalize_serbian_bank_account(self.bank_account)
            except ValidationError as e:
                raise ValidationError({"bank_account": e.messages}) from e
        return super().full_clean(*args, **kwargs)


class SavedRecipient(RecipientDataBase):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="saved_recipients"
    )

    def __str__(self) -> str:
        return self.recipient_full_name


class PaymentOrder(RecipientDataBase):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="payment_orders",
    )
    sender_name = models.CharField(max_length=255)
    sender_address = models.TextField(blank=True, default="")
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal("0.01"))],
    )
    currency = models.CharField(max_length=3, choices=Currency.choices)
    reference_model = models.CharField(max_length=10, blank=True, default="")
    reference_number = models.CharField(max_length=50, blank=True, default="")

    payment_purpose = models.CharField(max_length=255, blank=True, default="")
    payment_code = models.CharField(max_length=255, blank=True, default="")

    def __str__(self) -> str:
        return f"{self.recipient_full_name} - {self.amount} {self.currency}"
