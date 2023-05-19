import json

from django.contrib.auth import get_user_model
from django.contrib.auth.models import (AbstractBaseUser, BaseUserManager,
                                        Group, Permission, PermissionsMixin)
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.models import TokenUser
from rest_framework_simplejwt.serializers import (PasswordField,
                                                  TokenObtainPairSerializer,
                                                  TokenRefreshSerializer)
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import BlacklistMixin, RefreshToken, Token

from .models import UserAccount


class CustomTokenUserManager(models.Manager):
    def get_by_natural_key(self, email):
        return self.get(email=email)

class CustomOutstandingToken(models.Model):
    """
    A model to hold outstanding tokens.
    """
    user = models.ForeignKey(
        UserAccount,
        on_delete=models.CASCADE,
        related_name='outstanding_tokens',
    )
    token = models.CharField(max_length=255, db_index=True, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

class CustomTokenUser(TokenUser):
    """
    A model that is compatible with Simple JWT, but uses our custom User model.
    """
    objects = CustomTokenUserManager()

    def __init__(self, user):
        self.id = user.id
        self.email = user.email

    @classmethod
    def from_user(cls, user):
        return cls(user)

    class Meta:
        proxy = True

    def natural_key(self):
        return (self.email,)

    def refresh_token(self, lifetime=None):
        """
        Generate a new refresh token for the user.
        """

        CustomOutstandingToken.objects.filter(user=self).delete()

        token = CustomRefreshToken.for_user(self)

        return token

    def revoke_token(self, token: Token):
        """
        Revoke the given refresh or access token.
        """
        CustomOutstandingToken.objects.filter(
            user=self,
            token=str(token),
        ).delete()

    def to_json(self):
        return json.dumps({
            'id': self.id,
        })
class CustomRefreshToken(RefreshToken):

    @classmethod
    def for_user(cls, user):
        token_user = CustomTokenUser.from_user(user)
        token = cls()

        CustomOutstandingToken.objects.create(
            user=user,
            token=str(token),
            created_at=token.current_time,

        )

        try:
            token["user"] = token_user.to_json()
            token["user_id"] = getattr(user, "id")
            token["orig_iat"] = int(timezone.now().timestamp())
        except KeyError as e:
            raise InvalidToken(_("Token contained no recognizable payload"))

        return token
    
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    username_field = 'email'

    def validate(self, attrs):

        data = {}

        # 使用你的UserAccount模型进行验证
        user = UserAccount.objects.filter(email=attrs.get('email')).first()

        if user is None and not user.check_password(attrs.get('password')):
            raise serializers.ValidationError(
                '錯誤密碼或賬戶'
            )

        # 使用你的CustomTokenUser模型进行token生成
        refresh = CustomTokenUser.refresh_token(self = user)

        data['access'] = str(refresh.access_token)
        data['refresh'] = str(refresh)
        data['user_id'] = user.pk

        return data