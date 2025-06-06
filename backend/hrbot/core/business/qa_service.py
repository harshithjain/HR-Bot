from typing import Dict, List, Tuple
from .document_processor import document_processor_instance
import openai
import os

class QAService:
    def __init__(self):
        self.document_processor = document_processor_instance
        openai.api_key = os.getenv("OPENAI_API_KEY")

    def answer_question(self, question: str) -> Tuple[str, List[Dict], float]:
        print(f"from core layer");
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
        
        # Concatenate all retrieved chunks as context
        context = "\n\n".join([doc['text'] for doc in relevant_docs])
        
        # Generate answer using OpenAI LLM with strict context prompt
        answer = self._generate_answer_llm(question, context)
        
        return answer, relevant_docs, confidence_score

    def _generate_answer_llm(self, question: str, context: str) -> str:
        """
        Generate an answer using OpenAI LLM with the provided context and question.
        The LLM is instructed to answer ONLY using the context. If the answer is not present, it should say 'I don't know.'
        """
        prompt = (
            "Use ONLY the following context to answer the question. "
            "If the answer is not present, say 'I don't know.'\n\n"
            f"Context:\n{context}\n\nQuestion: {question}\nAnswer:"
        )
        try:
            # openai>=1.0.0 API
            client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=256,
                temperature=0.2,
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"[QAService] OpenAI API error: {e}")
            return "Sorry, I couldn't generate an answer due to an internal error."

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