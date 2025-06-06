from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Document, Question, Feedback
from .serializers import (
    DocumentSerializer,
    QuestionSerializer,
    FeedbackSerializer
)
from .business.qa_service import QAService

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def process_sharepoint_docs(self, request):
        """Process documents from SharePoint"""
        # Implementation for SharePoint document processing
        # This would typically involve:
        # 1. Connecting to SharePoint
        # 2. Fetching documents
        # 3. Processing them through the DocumentProcessor
        return Response({"message": "Document processing initiated"})

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """Handle question submission and generate answer"""
        question_text = request.data.get('question_text')
        if not question_text:
            return Response(
                {"error": "Question text is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get answer from QA service
        qa_service = QAService()
        result = qa_service.get_answer_with_sources(question_text)

        # Create question record
        question = Question.objects.create(
            user=request.user,
            question_text=question_text,
            answer_text=result['answer'],
            confidence_score=result['confidence_score']
        )

        # Add source documents
        for source in result['sources']:
            doc = Document.objects.create(
                title=source['metadata'].get('title', 'Unknown'),
                content=source['text'],
                source_url=source['metadata'].get('url', ''),
                vector_id=source['metadata'].get('id', '')
            )
            question.source_documents.add(doc)

        serializer = self.get_serializer(question)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class FeedbackViewSet(viewsets.ModelViewSet):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """Handle feedback submission"""
        question_id = request.data.get('question_id')
        question = get_object_or_404(Question, id=question_id)

        feedback = Feedback.objects.create(
            question=question,
            user=request.user,
            is_helpful=request.data.get('is_helpful', False),
            feedback_text=request.data.get('feedback_text', '')
        )

        serializer = self.get_serializer(feedback)
        return Response(serializer.data, status=status.HTTP_201_CREATED) 