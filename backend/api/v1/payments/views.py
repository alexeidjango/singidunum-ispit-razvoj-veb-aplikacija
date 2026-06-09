from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.db.models import QuerySet

from payments import applogic
from payments.models import PaymentOrder, SavedRecipient

from .serializers import PaymentOrderSerializer, SavedRecipientSerializer


class SavedRecipientViewSet(viewsets.ModelViewSet):
    serializer_class = SavedRecipientSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> QuerySet[SavedRecipient]:
        return applogic.list_all_saved_recipient_objects(user=self.request.user)

    def perform_create(self, serializer: SavedRecipientSerializer) -> None:
        serializer.instance = applogic.create_or_update_saved_recipient_object(
            user=self.request.user,
            **serializer.validated_data,
        )

    def perform_update(self, serializer: SavedRecipientSerializer) -> None:
        serializer.instance = applogic.create_or_update_saved_recipient_object(
            user=self.request.user,
            recipient=serializer.instance,
            **serializer.validated_data,
        )


class PaymentOrderViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentOrderSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self) -> QuerySet[PaymentOrder]:
        return applogic.list_all_payment_order_objects(user=self.request.user)

    def perform_create(self, serializer: PaymentOrderSerializer) -> None:
        serializer.instance = applogic.create_or_update_payment_order_object(
            user=self.request.user,
            **serializer.validated_data,
        )

    def perform_update(self, serializer: PaymentOrderSerializer) -> None:
        serializer.instance = applogic.create_or_update_payment_order_object(
            user=self.request.user,
            payment_order=serializer.instance,
            **serializer.validated_data,
        )
