from decimal import Decimal
from typing import Optional

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
    recipient: Optional[SavedRecipient] = None,
    recipient_full_name: Optional[str] = None,
    recipient_address: Optional[str] = None,
    bank_account: Optional[str] = None,
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
    payment_order: Optional[PaymentOrder] = None,
    recipient_full_name: Optional[str] = None,
    recipient_address: Optional[str] = None,
    bank_account: Optional[str] = None,
    sender_name: Optional[str] = None,
    sender_address: Optional[str] = None,
    amount: Optional[Decimal] = None,
    currency: Optional[str] = None,
    reference_model: Optional[str] = None,
    reference_number: Optional[str] = None,
    payment_purpose: Optional[str] = None,
    payment_code: Optional[str] = None,
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
    if payment_purpose is not None:
        payment_order.payment_purpose = payment_purpose
    if payment_code is not None:
        payment_order.payment_code = payment_code
    payment_order.full_clean()
    payment_order.save()
    return payment_order
