"use client";

import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { generateRandomParagraph } from './text';

const Home = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!input) return;

    setMessages([...messages, { text: input, isUser: true }]);
    setInput('');
    setIsLoading(true);

    const randomParagraph = generateRandomParagraph(15);
    const words = randomParagraph.split(' ');
    let currentMessage = '';
    let i = 0;

    const intervalId = setInterval(() => {
      currentMessage += `${words[i]} `;
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, prevMessages.length - 1),
        { text: currentMessage, isUser: false },
      ]);
      i++;

      if (i === words.length) {
        clearInterval(intervalId);
        setIsLoading(false);
      }
    }, 30);
  };

  return (
    <div className="flex flex-col justify-between h-screen bg-[#212121] p-4">
      <h1 className="text-[#F9F9F9] text-3xl font-bold text-center mb-6">Chat Simulation</h1>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="w-1/2 px-4 py-2 rounded-full bg-[#2F2F2F] text-[#F9F9F9] focus:outline-none"
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
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`my-2 p-2 rounded-lg ${msg.isUser ? 'bg-[#2F2F2F] self-end' : 'bg-[#444] self-start'}`}
            >
              <span className="text-[#F9F9F9]">{msg.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
