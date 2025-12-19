from django.apps import AppConfig


class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'
    def ready(self):
        # Import advanced admin customizations when the app is ready
        try:
            from . import advanced_admin  # noqa: F401 - import for side effects (registers admin)
        except Exception:
            # Fallback: don't crash app if advanced_admin has issues during import
            pass
