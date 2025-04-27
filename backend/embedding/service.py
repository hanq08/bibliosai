from typing import List, Dict, Any, Optional, Union
import numpy as np
from datetime import datetime
import json
import hashlib

# In a real implementation, you would use a proper vector database like Pinecone, Chroma, etc.
# This is a simplified in-memory implementation for demonstration purposes

class EmbeddingService:
    def __init__(self):
        # In-memory storage for embeddings
        self.documents = {}
        self.embeddings = {}
        self.metadata = {}
    
    async def embed_text(self, text: str) -> List[float]:
        """
        Generate embeddings for a text string.
        
        In a real implementation, this would call an embedding model API
        like OpenAI's text-embedding-ada-002 or a local model.
        """
        # Mock embedding generation - in reality, you would call an embedding API
        # This creates a deterministic "embedding" based on the hash of the text
        text_hash = hashlib.md5(text.encode()).hexdigest()
        # Convert hash to a list of 128 float values between -1 and 1
        embedding = []
        for i in range(0, len(text_hash), 2):
            if i + 1 < len(text_hash):
                val = int(text_hash[i:i+2], 16) / 255.0 * 2 - 1
                embedding.append(val)
        
        # Pad to 128 dimensions if needed
        while len(embedding) < 128:
            embedding.append(0.0)
        
        return embedding
    
    async def process_document(
        self,
        content: str,
        metadata: Dict[str, Any],
        chunk_size: int = 1000,
        chunk_overlap: int = 200
    ) -> List[str]:
        """
        Process a document by splitting it into chunks and embedding each chunk.
        
        Args:
            content: The document content
            metadata: Metadata about the document
            chunk_size: Size of each chunk in characters
            chunk_overlap: Overlap between chunks in characters
            
        Returns:
            List of document chunk IDs
        """
        # Split document into chunks
        chunks = self._split_text(content, chunk_size, chunk_overlap)
        
        # Generate a document ID
        doc_id = hashlib.md5(f"{content[:100]}-{datetime.now().isoformat()}".encode()).hexdigest()
        
        # Process each chunk
        chunk_ids = []
        for i, chunk in enumerate(chunks):
            chunk_id = f"{doc_id}-{i}"
            
            # Generate embedding for chunk
            embedding = await self.embed_text(chunk)
            
            # Store chunk, embedding, and metadata
            self.documents[chunk_id] = chunk
            self.embeddings[chunk_id] = embedding
            
            # Add chunk-specific metadata
            chunk_metadata = metadata.copy()
            chunk_metadata.update({
                "document_id": doc_id,
                "chunk_id": chunk_id,
                "chunk_index": i,
                "total_chunks": len(chunks),
                "processed_at": datetime.now().isoformat()
            })
            self.metadata[chunk_id] = chunk_metadata
            
            chunk_ids.append(chunk_id)
        
        return chunk_ids
    
    async def search(
        self,
        query: str,
        top_k: int = 5,
        filter_criteria: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Search for documents similar to the query.
        
        Args:
            query: The search query
            top_k: Number of results to return
            filter_criteria: Optional metadata filters
            
        Returns:
            List of search results with document content and metadata
        """
        # Generate embedding for query
        query_embedding = await self.embed_text(query)
        
        # Calculate similarity scores
        scores = {}
        for chunk_id, embedding in self.embeddings.items():
            # Apply filters if provided
            if filter_criteria and not self._matches_filter(self.metadata[chunk_id], filter_criteria):
                continue
            
            # Calculate cosine similarity
            similarity = self._cosine_similarity(query_embedding, embedding)
            scores[chunk_id] = similarity
        
        # Sort by similarity score
        sorted_results = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        
        # Get top-k results
        top_results = []
        for chunk_id, score in sorted_results[:top_k]:
            result = {
                "chunk_id": chunk_id,
                "content": self.documents[chunk_id],
                "metadata": self.metadata[chunk_id],
                "score": float(score)
            }
            top_results.append(result)
        
        return top_results
    
    def _split_text(self, text: str, chunk_size: int, chunk_overlap: int) -> List[str]:
        """Split text into overlapping chunks."""
        if len(text) <= chunk_size:
            return [text]
        
        chunks = []
        start = 0
        while start < len(text):
            end = min(start + chunk_size, len(text))
            
            # Try to find a natural break point (newline or period)
            if end < len(text):
                # Look for newline
                newline_pos = text.rfind("\n", start, end)
                if newline_pos > start + chunk_size // 2:
                    end = newline_pos + 1
                else:
                    # Look for period
                    period_pos = text.rfind(". ", start, end)
                    if period_pos > start + chunk_size // 2:
                        end = period_pos + 2
            
            # Add chunk
            chunks.append(text[start:end])
            
            # Move start position for next chunk
            start = end - chunk_overlap
        
        return chunks
    
    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors."""
        vec1 = np.array(vec1)
        vec2 = np.array(vec2)
        
        dot_product = np.dot(vec1, vec2)
        norm_vec1 = np.linalg.norm(vec1)
        norm_vec2 = np.linalg.norm(vec2)
        
        if norm_vec1 == 0 or norm_vec2 == 0:
            return 0.0
        
        return dot_product / (norm_vec1 * norm_vec2)
    
    def _matches_filter(self, metadata: Dict[str, Any], filter_criteria: Dict[str, Any]) -> bool:
        """Check if metadata matches filter criteria."""
        for key, value in filter_criteria.items():
            if key not in metadata:
                return False
            
            if isinstance(value, list):
                # List of possible values
                if metadata[key] not in value:
                    return False
            elif isinstance(value, dict):
                # Range filter
                if "gt" in value and metadata[key] <= value["gt"]:
                    return False
                if "lt" in value and metadata[key] >= value["lt"]:
                    return False
                if "gte" in value and metadata[key] < value["gte"]:
                    return False
                if "lte" in value and metadata[key] > value["lte"]:
                    return False
            else:
                # Exact match
                if metadata[key] != value:
                    return False
        
        return True
    
    def clear(self):
        """Clear all stored documents and embeddings."""
        self.documents.clear()
        self.embeddings.clear()
        self.metadata.clear()
    
    def get_stats(self) -> Dict[str, Any]:
        """Get statistics about the embedding service."""
        return {
            "document_count": len(self.documents),
            "total_tokens": sum(len(doc.split()) for doc in self.documents.values()),
            "sources": self._count_sources(),
            "last_updated": datetime.now().isoformat()
        }
    
    def _count_sources(self) -> Dict[str, int]:
        """Count documents by source type."""
        sources = {}
        for metadata in self.metadata.values():
            source_type = metadata.get("source_type", "unknown")
            sources[source_type] = sources.get(source_type, 0) + 1
        return sources

# Singleton instance
embedding_service = EmbeddingService()
