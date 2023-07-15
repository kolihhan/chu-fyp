from django.contrib.auth.backends import BaseBackend
from .models import UserAccount
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.utils.translation import gettext_lazy as _

from rest_framework_simplejwt.exceptions import AuthenticationFailed, InvalidToken, TokenError

class CustomJWTAuthentication(JWTAuthentication):

    def get_user(self, validated_token):

        try:
            user_id = validated_token['user_id']
        except KeyError:
            raise InvalidToken(_("Token contained no recognizable user identification"))

        try:
            user_account = UserAccount.objects.get(id=user_id)
        except UserAccount.DoesNotExist:
            raise AuthenticationFailed(_("User not found"), code="user_not_found")
        
        
        if not user_account.is_active:
            raise AuthenticationFailed(_("User is inactive"), code="user_inactive")

        return user_account

