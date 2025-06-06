from typing import Dict, List, Tuple
from document_processor import DocumentProcessor

class QAService:
    def __init__(self):
        self.document_processor = DocumentProcessor()

    def answer_question(self, question: str) -> Tuple[str, List[Dict], float]:
        """
        Answer a question based on the available documents
        
        Returns:
            Tuple containing:
            - Answer text
            - List of source documents
            - Confidence score
        """
        # Search for relevant documents
        relevant_docs = self.document_processor.search_similar_documents(question)
        
        if not relevant_docs:
            return "I couldn't find any relevant information to answer your question.", [], 0.0
        
        # Calculate confidence score based on the best match
        confidence_score = relevant_docs[0]['score']
        
        # Generate answer from the most relevant document
        answer = self._generate_answer(question, relevant_docs[0]['text'])
        
        return answer, relevant_docs, confidence_score

    def _generate_answer(self, question: str, context: str) -> str:
        """
        Generate an answer based on the question and context
        This is a simple implementation that returns the most relevant context
        In a production environment, you might want to use a more sophisticated
        approach with a language model
        """
        # For now, we'll return the most relevant context
        # In a production environment, you might want to:
        # 1. Use a language model to generate a more natural answer
        # 2. Combine information from multiple relevant documents
        # 3. Add citations and references
        return context

    def get_answer_with_sources(self, question: str) -> Dict:
        """
        Get an answer with source documents and confidence score
        """
        answer, sources, confidence = self.answer_question(question)
        
        return {
            'answer': answer,
            'sources': [
                {
                    'text': source['text'],
                    'metadata': source['metadata'],
                    'relevance_score': source['score']
                }
                for source in sources
            ],
            'confidence_score': confidence
        } 