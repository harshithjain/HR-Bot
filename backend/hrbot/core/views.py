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
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from .business.document_processor import DocumentProcessor
import os
import tempfile
from django.core.files.storage import default_storage
from django.conf import settings
import PyPDF2
from rest_framework.views import APIView

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = []

    @action(detail=False, methods=['post'])
    def process_sharepoint_docs(self, request):
        """Process documents from SharePoint"""
        # Implementation for SharePoint document processing
        # This would typically involve:
        # 1. Connecting to SharePoint
        # 2. Fetching documents
        # 3. Processing them through the DocumentProcessor
        return Response({"message": "Document processing initiated"})

    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser, FormParser])
    def upload_document(self, request):
        """Upload a PDF document, store in Postgres, and process for vector DB"""
        title = request.data.get('title')
        source_url = request.data.get('source_url', '')
        file = request.FILES.get('file')
        if not title or not file:
            return Response({"error": "Title and PDF file are required."}, status=status.HTTP_400_BAD_REQUEST)
        # Save file to media directory
        file_path = default_storage.save(f"documents/{file.name}", file)
        abs_file_path = os.path.join(settings.MEDIA_ROOT, file_path)
        # Extract text from PDF
        try:
            with open(abs_file_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                content = "\n".join(page.extract_text() or '' for page in reader.pages)
        except Exception as e:
            return Response({"error": f"Failed to extract text from PDF: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        # Save to Postgres
        doc = Document.objects.create(title=title, content=content, source_url=source_url)
        # Process for vector DB
        processor = DocumentProcessor()
        processor.process_document(content, {"id": doc.id, "title": title, "url": source_url})
        return Response({"message": "PDF uploaded and processed successfully."}, status=status.HTTP_201_CREATED)

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = []

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
    permission_classes = []

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

class AskView(APIView):
    authentication_classes = []  # Add authentication if needed
    permission_classes = []

    def post(self, request):
        question = request.data.get('question')
        if not question:
            return Response({'error': 'No question provided.'}, status=status.HTTP_400_BAD_REQUEST)
        qa_service = QAService()
        result = qa_service.get_answer_with_sources(question)
        return Response(result, status=status.HTTP_200_OK) 