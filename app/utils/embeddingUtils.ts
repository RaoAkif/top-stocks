import { API_CONFIG } from "../config/apiConfig";

export const fetchEmbedding = async (text: string) => {
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
  const response = await fetch(API_CONFIG.PINECONE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": API_CONFIG.PINECONE_API_KEY,
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
