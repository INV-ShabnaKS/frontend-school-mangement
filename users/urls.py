from django.urls import path
#from .views import RegisterView
from .views import LoginView
from .views import LogoutView
<<<<<<< HEAD
from .views import RequestPasswordResetEmail
from .views import PasswordResetConfirmView
=======
>>>>>>> 52dd3ed4 (first commit)


urlpatterns = [
    #path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('logout/', LogoutView.as_view(), name='logout'),
<<<<<<< HEAD
    path('forgot-password', RequestPasswordResetEmail.as_view(), name='request-reset-email'),
    path('reset-password/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password-reset-confirm'),
    ]
=======
]
>>>>>>> 52dd3ed4 (first commit)
