from __future__ import annotations

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from users import applogic
from users.models import User

from .serializers import MeSerializer, PasswordChangeSerializer, RegistrationSerializer


class RegistrationView(generics.CreateAPIView):
    serializer_class = RegistrationSerializer
    permission_classes = (AllowAny,)

    def perform_create(self, serializer: RegistrationSerializer) -> None:
        serializer.instance = applogic.register_user(**serializer.validated_data)


class MeView(generics.RetrieveUpdateAPIView):
    serializer_class = MeSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ["get", "patch", "head", "options"]

    def get_object(self) -> User:
        return self.request.user

    def perform_update(self, serializer: MeSerializer) -> None:
        serializer.instance = applogic.update_user_profile(
            user=self.request.user,
            **serializer.validated_data,
        )


class PasswordChangeView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request: Request) -> Response:
        serializer = PasswordChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        applogic.change_user_password(user=request.user, **serializer.validated_data)
        return Response(status=status.HTTP_204_NO_CONTENT)
