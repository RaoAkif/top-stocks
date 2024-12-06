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

  return (
    <div className="flex flex-col justify-between h-screen bg-[#212121] p-4">
      <h1 className="text-[#F9F9F9] text-3xl font-bold text-center mb-6">
        Top Stocks Search
      </h1>
      <p>What are some companies that manufacture consumer hardware?</p>
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
      <div className="flex-1 overflow-y-auto mb-6 flex justify-center">
        <div className="w-full max-w-[90%] grid grid-cols-1 sm:grid-cols-2 gap-6">
          {message && (
            <div className="my-2 p-2 rounded-lg bg-[#444] self-start">
              <pre className="text-[#F9F9F9] whitespace-pre-wrap">
                {message}
              </pre>
            </div>
          )}
          {matches.length > 0 && (
            <div className="my-2 p-2 rounded-lg bg-[#444] text-[#F9F9F9] w-full">
              <h2 className="text-lg font-bold mb-4">Top Matches:</h2>
              <ul>
                {matches.slice(0, 10).map((match, index) => (
                  <li
                    key={index}
                    className="bg-[#333] p-6 rounded-lg shadow-lg mb-4"
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      {match.metadata.Name}
                    </h3>
                    <p className="text-sm text-[#bbb]">
                      <strong>Industry/Sector:</strong>{" "}
                      {match.metadata.Industry} / {match.metadata.Sector}
                    </p>
                    <p className="text-sm text-[#bbb]">
                      <strong>Location:</strong> {match.metadata.City},{" "}
                      {match.metadata.State}, {match.metadata.Country}
                    </p>
                    <p className="text-sm text-[#bbb]">
                      <strong>Ticker Symbol:</strong> {match.metadata.Ticker}
                    </p>
                    <p className="text-sm text-[#bbb]">
                      <strong>Founded Year:</strong>{" "}
                      {match.metadata.Founded ? match.metadata.Founded : "N/A"}
                    </p>
                    <p className="text-sm text-[#bbb]">
                      <strong>Brief Description:</strong>{" "}
                      {match.metadata["Business Summary"].slice(0, 150)}...
                    </p>
                    <p className="text-sm text-[#bbb]">
                      <strong>Key Markets/Segments:</strong>{" "}
                      {match.metadata.Industry}, {match.metadata.Sector}
                    </p>
                    <p className="text-sm text-[#bbb]">
                      <strong>Operating Regions:</strong>{" "}
                      {match.metadata.OperatingRegions || "N/A"}
                    </p>
                    <p className="text-sm text-[#bbb]">
                      <strong>Key Services/Products:</strong>
                      <ul className="list-disc ml-4">
                        {match.metadata.text
                          .toString()
                          .split(", ")
                          .slice(0, 3)
                          .map((service, index) => (
                            <li key={index} className="text-sm">
                              {service}
                            </li>
                          ))}
                      </ul>
                    </p>
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
