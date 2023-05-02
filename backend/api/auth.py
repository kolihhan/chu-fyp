from django.contrib.auth.backends import BaseBackend
from .models import UserAccount

class UserAccountBackend(BaseBackend):
    def authenticate(self, request, email=None, password=None, **kwargs):
        try:
            user = UserAccount.objects.get(email=email)
        except UserAccount.DoesNotExist:
            return None

        if user.check_password(password):
            return user
        else:
            return None

    def get_user(self, user_id):
        try:
            return UserAccount.objects.get(pk=user_id)
        except UserAccount.DoesNotExist:
            return None
