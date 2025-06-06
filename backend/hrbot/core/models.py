from django.db import models
from django.contrib.auth.models import User

class Document(models.Model):
    """Model to store HR documents metadata"""
    title = models.CharField(max_length=255)
    content = models.TextField()
    source_url = models.URLField()
    last_updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    vector_id = models.CharField(max_length=255, unique=True, null=True)

    class Meta:
        ordering = ['-last_updated']

    def __str__(self):
        return self.title

class Question(models.Model):
    """Model to store user questions and answers"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question_text = models.TextField()
    answer_text = models.TextField()
    source_documents = models.ManyToManyField(Document, related_name='questions')
    created_at = models.DateTimeField(auto_now_add=True)
    confidence_score = models.FloatField(default=0.0)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Q: {self.question_text[:50]}..."

class Feedback(models.Model):
    """Model to store user feedback on answers"""
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_helpful = models.BooleanField()
    feedback_text = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Feedback for Q: {self.question.question_text[:30]}..." 