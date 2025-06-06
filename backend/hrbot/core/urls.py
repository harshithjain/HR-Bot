from rest_framework import routers
from django.urls import path
from .views import DocumentViewSet, QuestionViewSet, FeedbackViewSet, AskView

router = routers.DefaultRouter()
router.register(r'documents', DocumentViewSet, basename='document')
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'feedback', FeedbackViewSet, basename='feedback')

urlpatterns = router.urls + [
    path('ask/', AskView.as_view(), name='ask'),
] 