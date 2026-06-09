from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import exceptions
from rest_framework.views import exception_handler as drf_exception_handler


def exception_handler(exc, context):
    if isinstance(exc, DjangoValidationError):
        if hasattr(exc, "message_dict"):
            detail = exc.message_dict
        else:
            detail = exc.messages
        exc = exceptions.ValidationError(detail)
    return drf_exception_handler(exc, context)
