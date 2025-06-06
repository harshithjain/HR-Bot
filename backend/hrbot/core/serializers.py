from rest_framework import serializers
from .models import Document, Question, Feedback

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'title', 'content', 'source_url', 'last_updated', 'created_at']

class QuestionSerializer(serializers.ModelSerializer):
    source_documents = DocumentSerializer(many=True, read_only=True)
    user = serializers.StringRelatedField()

    class Meta:
        model = Question
        fields = [
            'id', 'user', 'question_text', 'answer_text',
            'source_documents', 'created_at', 'confidence_score'
        ]
        read_only_fields = ['answer_text', 'confidence_score']

class FeedbackSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Feedback
        fields = ['id', 'question', 'user', 'is_helpful', 'feedback_text', 'created_at']
        read_only_fields = ['user'] 