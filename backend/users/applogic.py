from __future__ import annotations

from django.core.exceptions import ValidationError
from django.db import transaction
from django.db.models import QuerySet

from .models import User


def get_user_object(user_id: int) -> User:
    return User.objects.get(pk=user_id)


def list_all_user_objects() -> QuerySet[User]:
    return User.objects.all()


@transaction.atomic
def create_or_update_user_object(
    *,
    user: User | None = None,
    email: str | None = None,
    full_name: str | None = None,
    address: str | None = None,
    password: str | None = None,
) -> User:
    user = user or User()
    if email is not None:
        user.email = email
    if full_name is not None:
        user.full_name = full_name
    if address is not None:
        user.address = address
    if password is not None:
        user.set_password(password)
    user.full_clean()
    user.save()
    return user


def register_user(*, email: str, password: str, full_name: str, address: str) -> User:
    return create_or_update_user_object(
        email=email,
        password=password,
        full_name=full_name,
        address=address,
    )


@transaction.atomic
def change_user_password(*, user: User, old_password: str, new_password: str) -> User:
    if not user.check_password(old_password):
        raise ValidationError({"old_password": "Wrong password."})
    user.set_password(new_password)
    user.full_clean()
    user.save()
    return user


def update_user_profile(
    *,
    user: User,
    full_name: str | None = None,
    address: str | None = None,
) -> User:
    return create_or_update_user_object(
        user=user,
        full_name=full_name,
        address=address,
    )
