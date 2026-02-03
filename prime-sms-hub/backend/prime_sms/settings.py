"""
Django settings for prime_sms project.
"""

import os
import environ
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables
env = environ.Env(
    DEBUG=(bool, True)
)
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('SECRET_KEY', default='django-insecure-your-secret-key-change-this')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG', default=True)

ALLOWED_HOSTS = env('ALLOWED_HOSTS', default='localhost,127.0.0.1').split(',')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'channels',
    'api',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'prime_sms.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, '..', 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'prime_sms.wsgi.application'
ASGI_APPLICATION = 'prime_sms.asgi.application'

# Database
# Use PostgreSQL if DATABASE_URL is set (for Vercel/production), otherwise SQLite (for local dev)
DATABASE_URL = env('DATABASE_URL', default=None)
if DATABASE_URL:
    # Parse DATABASE_URL (format: postgresql://user:password@host:port/dbname)
    import urllib.parse
    result = urllib.parse.urlparse(DATABASE_URL)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': result.path[1:],  # Remove leading '/'
            'USER': result.username,
            'PASSWORD': result.password,
            'HOST': result.hostname,
            'PORT': result.port or '5432',
        }
    }
else:
    # Fallback to SQLite for local development
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
# Use a separate folder for collected static files to avoid conflicts during development
STATIC_ROOT = os.path.join(BASE_DIR, '..', 'collected_static')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, '..', 'static'),
    # Include repo root so top-level asset folders (js, css, images) and index.html are served
    os.path.join(BASE_DIR, '..'),
]

# Media files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, '..', 'media')

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 50,
    'DEFAULT_FILTER_BACKENDS': [
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}

# Channels (WebSocket) configuration - use in-memory layer for development
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer'
    }
}

# Channels routing
# We'll add a basic websocket path for support chat consumer

# CORS Configuration
CORS_ALLOWED_ORIGINS = env('CORS_ALLOWED_ORIGINS', default='http://localhost:8000,http://127.0.0.1:8000').split(',')
CORS_ALLOW_CREDENTIALS = True

# API Keys from environment
FIREBASE_CONFIG = {
    'apiKey': env('FIREBASE_API_KEY'),
    'authDomain': env('FIREBASE_AUTH_DOMAIN'),
    'projectId': env('FIREBASE_PROJECT_ID'),
    'storageBucket': env('FIREBASE_STORAGE_BUCKET'),
    'messagingSenderId': env('FIREBASE_MESSAGING_SENDER_ID'),
    'appId': env('FIREBASE_APP_ID'),
}

PAYSTACK_PUBLIC_KEY = env('PAYSTACK_PUBLIC_KEY')
PAYSTACK_SECRET_KEY = env('PAYSTACK_SECRET_KEY')

FIVESIM_API_KEY = env('FIVESIM_API_KEY')
FIVESIM_API_URL = 'https://api.5sim.net/v1'

SENDGRID_API_KEY = env('SENDGRID_API_KEY')
SENDGRID_FROM_EMAIL = env('SENDGRID_FROM_EMAIL', default='noreply@primesmshub.com')

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN = env('TELEGRAM_BOT_TOKEN', default=None)
TELEGRAM_ADMIN_CHAT_ID = env('TELEGRAM_ADMIN_CHAT_ID', default=None)
# Optional secret for webhook validation (set in Telegram webhook 'secret_token' parameter)
TELEGRAM_WEBHOOK_SECRET = env('TELEGRAM_WEBHOOK_SECRET', default=None)

# Admin dashboard secret for non-interactive exports or automation
ADMIN_DASHBOARD_SECRET = env('ADMIN_DASHBOARD_SECRET', default='dev-secret')

# Channels (WebSocket) production configuration: prefer Redis when REDIS_URL is provided
REDIS_URL = env('REDIS_URL', default=None)
if REDIS_URL:
    CHANNEL_LAYERS = {
        'default': {
            'BACKEND': 'channels_redis.core.RedisChannelLayer',
            'CONFIG': {
                'hosts': [REDIS_URL]
            }
        }
    }

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}
