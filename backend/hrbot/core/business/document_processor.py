import os
from typing import List, Dict
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
from langchain.text_splitter import RecursiveCharacterTextSplitter
from office365.runtime.auth.client_credential import ClientCredential
from office365.sharepoint.client_context import ClientContext

class DocumentProcessor:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.dimension = 384  # for all-MiniLM-L6-v2
        self.index = faiss.IndexFlatL2(self.dimension)
        self.chunks = []  # Store text chunks
        self.metadata = []  # Store metadata for each chunk

    def process_document(self, content: str, metadata: Dict) -> str:
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=100
        )
        chunks = splitter.split_text(content)
        embeddings = self.model.encode(chunks)
        self.index.add(np.array(embeddings).astype('float32'))
        self.chunks.extend(chunks)
        self.metadata.extend([metadata] * len(chunks))
        return f"Processed {len(chunks)} chunks from document"

    def search_similar_documents(self, query: str, limit: int = 5) -> List[Dict]:
        if self.index.ntotal == 0 or not self.chunks:
            return []
        query_vector = self.model.encode([query]).astype('float32')
        D, I = self.index.search(query_vector, limit)
        results = []
        for idx, dist in zip(I[0], D[0]):
            if idx == -1 or idx >= len(self.chunks):
                continue
            results.append({
                'text': self.chunks[idx],
                'metadata': self.metadata[idx],
                'score': float(dist)
            })
        return results 

document_processor_instance = DocumentProcessor() 