import json
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Permission, Group
from rest_framework_simplejwt.tokens import RefreshToken, BlacklistMixin
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.models import TokenUser
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.tokens import RefreshToken, Token


# Create your models here.

#Diff between auto_now and auto_now_add
#auto_now_add : 只執行一次
#auto_now : 每次都會執行

class UserAccountManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
class CustomTokenUserManager(models.Manager):
    def get_by_natural_key(self, email):
        return self.get(email=email)
class UserAccount(AbstractBaseUser, PermissionsMixin):

    groups = models.ManyToManyField(
        Group,
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name='user_accounts' # add this
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name='user_accounts' # add this
    )

    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10)
    birthday = models.DateField()
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    avatar_url = models.URLField()
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email

    def get_full_name(self):
        return self.name
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