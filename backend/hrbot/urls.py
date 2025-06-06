from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from hrbot.core.views import DocumentViewSet, QuestionViewSet, FeedbackViewSet

router = DefaultRouter()
router.register(r'documents', DocumentViewSet)
router.register(r'questions', QuestionViewSet)
router.register(r'feedback', FeedbackViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
] 