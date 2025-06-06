import os
from typing import List, Dict
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.http import models
from office365.runtime.auth.client_credential import ClientCredential
from office365.sharepoint.client_context import ClientContext

class DocumentProcessor:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.qdrant_client = QdrantClient(url=os.getenv('QDRANT_URL'))
        self.collection_name = os.getenv('QDRANT_COLLECTION_NAME', 'hr_documents')
        self._setup_collection()

    def _setup_collection(self):
        """Initialize Qdrant collection if it doesn't exist"""
        collections = self.qdrant_client.get_collections().collections
        collection_names = [collection.name for collection in collections]
        
        if self.collection_name not in collection_names:
            self.qdrant_client.create_collection(
                collection_name=self.collection_name,
                vectors_config=models.VectorParams(
                    size=384,  # Size of the vectors from all-MiniLM-L6-v2
                    distance=models.Distance.COSINE
                )
            )

    def process_document(self, content: str, metadata: Dict) -> str:
        """Process a document and store it in the vector database"""
        # Split content into chunks
        chunks = self._split_into_chunks(content)
        
        # Generate embeddings for each chunk
        embeddings = self.model.encode(chunks)
        
        # Store in Qdrant
        points = []
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            point = models.PointStruct(
                id=f"{metadata['id']}_{i}",
                vector=embedding.tolist(),
                payload={
                    "text": chunk,
                    "metadata": metadata
                }
            )
            points.append(point)
        
        self.qdrant_client.upsert(
            collection_name=self.collection_name,
            points=points
        )
        
        return f"Processed {len(chunks)} chunks from document"

    def _split_into_chunks(self, text: str, chunk_size: int = 500) -> List[str]:
        """Split text into overlapping chunks"""
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - 100):
            chunk = ' '.join(words[i:i + chunk_size])
            chunks.append(chunk)
            
        return chunks

    def search_similar_documents(self, query: str, limit: int = 5) -> List[Dict]:
        """Search for similar documents using semantic search"""
        query_vector = self.model.encode(query)
        
        search_result = self.qdrant_client.search(
            collection_name=self.collection_name,
            query_vector=query_vector.tolist(),
            limit=limit
        )
        
        results = []
        for hit in search_result:
            results.append({
                'text': hit.payload['text'],
                'metadata': hit.payload['metadata'],
                'score': hit.score
            })
            
        return results 