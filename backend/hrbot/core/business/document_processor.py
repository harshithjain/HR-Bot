import os
from typing import List, Dict
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
import openai
from django.conf import settings

class DocumentProcessor:
    def __init__(self):
        if not os.getenv("OPENAI_API_KEY"):
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        openai.api_key = os.getenv("OPENAI_API_KEY")
        self.index_path = "faiss_index"
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-ada-002",
            openai_api_key=os.getenv("OPENAI_API_KEY")
        )
        self.vectorstore = None
        # Try to load existing FAISS index
        if os.path.exists(self.index_path):
            try:
                self.vectorstore = FAISS.load_local(self.index_path, self.embeddings)
                print(f"[DocumentProcessor] Loaded FAISS index from {self.index_path}")
            except Exception as e:
                print(f"[DocumentProcessor] Failed to load FAISS index: {e}")
                self.vectorstore = None

    def process_document(self, content: str, metadata: Dict) -> str:
        print("[DocumentProcessor] Processing document for vectorization...")
        text_splitter = RecursiveCharacterTextSplitter(
            separators=['\n\n', '\n', '.', ','],
            chunk_size=1000
        )
        docs = text_splitter.create_documents([content])
        print(f"[DocumentProcessor] Number of chunks created: {len(docs)}")
        if not docs:
            print("[DocumentProcessor] No chunks to vectorize.")
            return "No chunks to process."
        # Add metadata to each chunk
        for doc in docs:
            doc.metadata = metadata
        if self.vectorstore is None:
            self.vectorstore = FAISS.from_documents(docs, self.embeddings)
            print("[DocumentProcessor] Created new FAISS index.")
        else:
            self.vectorstore.add_documents(docs)
            print("[DocumentProcessor] Added documents to existing FAISS index.")
        self.vectorstore.save_local(self.index_path)
        print(f"[DocumentProcessor] Saved FAISS index to {self.index_path}")
        return f"Processed {len(docs)} chunks from document"

    def search_similar_documents(self, query: str, limit: int = 5) -> List[Dict]:
        print(f"[DocumentProcessor] Searching for: {query}")
        if self.vectorstore is None:
            print("[DocumentProcessor] No FAISS index loaded.")
            return []
        results = self.vectorstore.similarity_search(query, k=limit)
        print(f"[DocumentProcessor] Number of results returned: {len(results)}")
        return [
            {
                'text': doc.page_content,
                'metadata': doc.metadata,
                'score': 1.0  # LangChain does not return a score by default
            }
            for doc in results
        ]

document_processor_instance = DocumentProcessor() 