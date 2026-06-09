from __future__ import annotations

from decimal import Decimal

from django.db import transaction
from django.db.models import QuerySet

from users.models import User

from .models import PaymentOrder, SavedRecipient


def list_all_saved_recipient_objects(*, user: User) -> QuerySet[SavedRecipient]:
    return SavedRecipient.objects.filter(user=user)


def get_saved_recipient_object(*, user: User, recipient_id: int) -> SavedRecipient:
    return SavedRecipient.objects.get(user=user, pk=recipient_id)


@transaction.atomic
def create_or_update_saved_recipient_object(
    *,
    user: User,
    recipient: SavedRecipient | None = None,
    recipient_full_name: str | None = None,
    recipient_address: str | None = None,
    bank_account: str | None = None,
) -> SavedRecipient:
    recipient = recipient or SavedRecipient(user=user)
    if recipient_full_name is not None:
        recipient.recipient_full_name = recipient_full_name
    if recipient_address is not None:
        recipient.recipient_address = recipient_address
    if bank_account is not None:
        recipient.bank_account = bank_account
    recipient.full_clean()
    recipient.save()
    return recipient


def list_all_payment_order_objects(*, user: User) -> QuerySet[PaymentOrder]:
    return PaymentOrder.objects.filter(user=user)


def get_payment_order_object(*, user: User, payment_order_id: int) -> PaymentOrder:
    return PaymentOrder.objects.get(user=user, pk=payment_order_id)


@transaction.atomic
def create_or_update_payment_order_object(
    *,
    user: User,
    payment_order: PaymentOrder | None = None,
    recipient_full_name: str | None = None,
    recipient_address: str | None = None,
    bank_account: str | None = None,
    sender_name: str | None = None,
    sender_address: str | None = None,
    amount: Decimal | None = None,
    currency: str | None = None,
    reference_model: str | None = None,
    reference_number: str | None = None,
) -> PaymentOrder:
    payment_order = payment_order or PaymentOrder(user=user)
    if recipient_full_name is not None:
        payment_order.recipient_full_name = recipient_full_name
    if recipient_address is not None:
        payment_order.recipient_address = recipient_address
    if bank_account is not None:
        payment_order.bank_account = bank_account
    if sender_name is not None:
        payment_order.sender_name = sender_name
    if sender_address is not None:
        payment_order.sender_address = sender_address
    if amount is not None:
        payment_order.amount = amount
    if currency is not None:
        payment_order.currency = currency
    if reference_model is not None:
        payment_order.reference_model = reference_model
    if reference_number is not None:
        payment_order.reference_number = reference_number
    payment_order.full_clean()
    payment_order.save()
    return payment_order
