"use client";

import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const Home = () => {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  interface Match {
    score: number;
    id: string;
    metadata: Record<string, string | number | boolean>;
  }

  const [matches, setMatches] = useState<Match[]>([]);

  const handleSend = async () => {
    if (!input || isLoading) return;

    setMessage(null); // Clear the previous message
    setIsLoading(true);

    try {
      // Step 1: Fetch embedding from the API
      const embeddingResponse = await fetch(
        "https://txt-embd.onrender.com/get-embedding/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: input }),
        }
      );

      if (!embeddingResponse.ok) {
        throw new Error("Failed to fetch embeddings.");
      }

      const embeddingData = await embeddingResponse.json();
      const rawQueryEmbedding = embeddingData.embedding;

      // Step 2: Query Pinecone for similar items
      const pineconeResponse = await fetch(
        "https://nyse-d3tf7gs.svc.aped-4627-b74a.pinecone.io/query",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Api-Key":
              process.env.PINECONE_API_KEY ||
              "pcsk_6Xmi37_PvParSyccpaGtPAXZcL3uzQooGDMKhWLz7WNM5NBvfunui67gogpzisJkDADq4y",
          },
          body: JSON.stringify({
            vector: rawQueryEmbedding,
            top_k: 10,
            include_metadata: true,
            namespace: "stock-descriptions",
          }),
        }
      );

      if (!pineconeResponse.ok) {
        throw new Error("Failed to query Pinecone.");
      }

      const pineconeData = await pineconeResponse.json();
      setMatches(pineconeData.matches || []);
    } catch (error) {
      setMessage("Error: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.scrollHeight <= 100) {
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  const SkeletonCard = () => (
    <div className="bg-[#333] p-6 rounded-lg shadow-lg animate-pulse">
      <div className="h-6 bg-gray-500 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-600 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-600 rounded w-3/4"></div>
    </div>
  );

  return (
    <div className="flex flex-col justify-between h-screen bg-[#212121] p-4">
      <h1 className="text-[#F9F9F9] text-2xl font-bold text-center mb-6">
        Top Stocks Search
      </h1>
      <div className="flex justify-center items-center mb-4">
        <textarea
          value={input}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          className="w-1/2 min-h-[2rem] max-h-[10rem] px-4 py-2 rounded-lg bg-[#2F2F2F] text-[#F9F9F9] focus:outline-none resize-none"
          placeholder="Type your message..."
        />
        <div
          onClick={handleSend}
          className={`ml-2 flex justify-center items-center w-12 h-12 pb-1 pr-1 cursor-pointer rounded-full transition-all ${
            isLoading ? "bg-[#333]" : "bg-[#2F2F2F]"
          }`}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-4 border-[#F9F9F9] border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FaPaperPlane className="text-[#F9F9F9] text-xl" />
          )}
        </div>
      </div>
      <div className="flex-1 mb-6 flex justify-center px-20 mx-48">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mr-10 ml-10">
          {message && (
            <div className="my-2 p-2 rounded-lg bg-[#444] self-start w-full">
              <pre className="text-[#F9F9F9] whitespace-pre-wrap">{message}</pre>
            </div>
          )}
          {isLoading
            ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
            : matches.length > 0 && (
                <div className="my-2 p-2 rounded-lg text-[#F9F9F9] w-full col-span-full">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                    {matches.slice(0, 10).map((match, index) => (
                      <li
                        key={index}
                        className="bg-[#333] p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl max-w-[500px]"
                      >
                        <h3 className="text-2xl font-semibold mb-4 text-[#F9F9F9] text-left">
                          {match.metadata.Name}
                        </h3>

                        <div className="flex items-center text-[#F9F9F9] text-sm mb-2 text-left">
                          <i className="fas fa-industry text-[#35AE47] mr-2"></i>
                          <span>
                            <strong>Industry:</strong> {match.metadata.Industry} / {" "}
                            {match.metadata.Sector}
                          </span>
                        </div>

                        <div className="flex items-center text-[#F9F9F9] text-sm mb-2 text-left">
                          <i className="fas fa-map-marker-alt text-[#6C71FF] mr-2"></i>
                          <span>
                            <strong>Location:</strong> {match.metadata.City}, {" "}
                            {match.metadata.State}, {match.metadata.Country}
                          </span>
                        </div>

                        <div className="flex items-center text-[#F9F9F9] text-sm mb-2 text-left">
                          <i className="fas fa-chart-line text-[#6C71FF] mr-2"></i>
                          <span>
                            <strong>Ticker Symbol:</strong> {match.metadata.Ticker}
                          </span>
                        </div>

                        <div className="flex items-center text-[#F9F9F9] text-sm mb-2 text-left">
                          <i className="fas fa-calendar-alt text-[#EA8444] mr-2"></i>
                          <span>
                            <strong>Founded Year:</strong> {match.metadata.Founded || "N/A"}
                          </span>
                        </div>

                        <div className="text-[#F9F9F9] text-sm mb-4 text-left pl-2">
                          <strong>Key Markets/Segments:</strong>
                          <ul className="list-disc ml-4">
                            {match.metadata.Industry}, {match.metadata.Sector}
                          </ul>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
        </div>
      </div>
    </div>
  );
};

export default Home;
