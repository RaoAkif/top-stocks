import { API_CONFIG } from "../config/apiConfig";

export const fetchEmbedding = async (text: string) => {
  if (!API_CONFIG.EMBEDDING_URL) {
    throw new Error("EMBEDDING_URL is not defined.");
  }

  const response = await fetch(API_CONFIG.EMBEDDING_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch embeddings.");
  }

  const data = await response.json();
  return data.embedding;
};

export const queryPinecone = async (vector: number[], topK = 10) => {
  if (!API_CONFIG.PINECONE_URL) {
    throw new Error("PINECONE_URL is not defined.");
  }

  const response = await fetch(API_CONFIG.PINECONE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(API_CONFIG.PINECONE_API_KEY && { "Api-Key": API_CONFIG.PINECONE_API_KEY }),
    },
    body: JSON.stringify({
      vector,
      top_k: topK,
      include_metadata: true,
      namespace: "stock-descriptions",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to query Pinecone.");
  }

  return response.json();
};
