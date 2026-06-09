from rest_framework import serializers

from payments.models import PaymentOrder, SavedRecipient


class SavedRecipientSerializer(serializers.ModelSerializer):
    bank_account = serializers.CharField(max_length=32)

    class Meta:
        model = SavedRecipient
        fields = (
            "id",
            "recipient_full_name",
            "recipient_address",
            "bank_account",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class PaymentOrderSerializer(serializers.ModelSerializer):
    bank_account = serializers.CharField(max_length=32)

    class Meta:
        model = PaymentOrder
        fields = (
            "id",
            "recipient_full_name",
            "recipient_address",
            "bank_account",
            "sender_name",
            "sender_address",
            "amount",
            "currency",
            "reference_model",
            "reference_number",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")
