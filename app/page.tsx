"use client";

import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const Home = () => {
  const [input, setInput] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!input || isLoading) return;

    setInput('');
    setMessage(null); // Clear the previous message
    setIsLoading(true);

    // Simulate response
    setTimeout(() => {
      setMessage("Hello Output");
      setIsLoading(false);
    }, 1000); // Simulate delay of 1000ms
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.scrollHeight <= 100) {
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col justify-between h-screen bg-[#212121] p-4">
      <h1 className="text-[#F9F9F9] text-3xl font-bold text-center mb-6">Chat Simulation</h1>
      <div className="flex justify-center mb-4">
        <textarea
          value={input}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          className="w-1/2 min-h-[2rem] max-h-[10rem] px-4 py-2 rounded-lg bg-[#2F2F2F] text-[#F9F9F9] focus:outline-none resize-none"
          placeholder="Type your message..."
        />
        <div
          onClick={handleSend}
          className={`ml-2 flex justify-center items-center w-12 h-12 cursor-pointer rounded-full transition-all ${isLoading ? 'bg-[#333]' : 'bg-[#2F2F2F]'}`}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-4 border-[#F9F9F9] border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <FaPaperPlane className="text-[#F9F9F9] text-xl" />
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto mb-6 flex justify-center">
        <div className="w-full max-w-[70%]">
          {isLoading && (
            <div className="my-2 p-2 rounded-lg bg-[#444] self-start">
              <span className="text-[#F9F9F9]">Loading...</span>
            </div>
          )}
          {!isLoading && message && (
            <div className="my-2 p-2 rounded-lg bg-[#444] self-start">
              <span className="text-[#F9F9F9]">{message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;