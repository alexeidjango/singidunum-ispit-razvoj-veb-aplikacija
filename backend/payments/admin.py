from django.contrib import admin

from .models import PaymentOrder, SavedRecipient


@admin.register(SavedRecipient)
class SavedRecipientAdmin(admin.ModelAdmin):
    list_display = ("recipient_full_name", "bank_account", "user", "created_at")
    search_fields = ("recipient_full_name", "bank_account")
    list_filter = ("created_at",)
    raw_id_fields = ("user",)


@admin.register(PaymentOrder)
class PaymentOrderAdmin(admin.ModelAdmin):
    list_display = ("recipient_full_name", "amount", "currency", "user", "created_at")
    search_fields = ("recipient_full_name", "sender_name", "bank_account")
    list_filter = ("currency", "created_at")
    raw_id_fields = ("user",)
