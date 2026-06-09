from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .payments.views import PaymentOrderViewSet, SavedRecipientViewSet
from .users.views import MeView, PasswordChangeView, RegistrationView

router = DefaultRouter()
router.register("payment-orders", PaymentOrderViewSet, basename="payment-order")
router.register("saved-recipients", SavedRecipientViewSet, basename="saved-recipient")

urlpatterns = [
    path("auth/register/", RegistrationView.as_view(), name="register"),
    path("auth/login/", TokenObtainPairView.as_view(), name="login"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("auth/password-change/", PasswordChangeView.as_view(), name="password-change"),
    path("users/me/", MeView.as_view(), name="me"),
    path("", include(router.urls)),
]
