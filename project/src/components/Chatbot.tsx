import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Send, Loader2 } from 'lucide-react';
import EmotionIndicator from './EmotionIndicator';
import { Message } from '../types';

const Chatbot: React.FC = () => {
  const { messages, addMessage } = useAppContext();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Initialize with a welcome message if no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        sender: 'bot',
        text: 'Hello! I\'m your SignVerse assistant. How can I help you today?',
        emotion: 'happy',
        timestamp: new Date()
      };
      addMessage(welcomeMessage);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };
    
    addMessage(userMessage);
    setInput('');
    setIsLoading(true);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponses = [
        { text: "I understand what you're saying. How can I help further?", emotion: 'neutral' },
        { text: "That's great to hear! I'm glad things are going well.", emotion: 'happy' },
        { text: "I'm sorry to hear that. Is there anything I can do to help?", emotion: 'sad' },
        { text: "I'm here to assist with your sign language translation needs.", emotion: 'neutral' },
        { text: "Could you please provide more details so I can better assist you?", emotion: 'neutral' }
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        id: Date.now().toString(),
        sender: 'bot',
        text: randomResponse.text,
        emotion: randomResponse.emotion as any,
        timestamp: new Date()
      };
      
      addMessage(botMessage);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] md:h-[calc(100vh-10rem)] max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-4 bg-indigo-600 text-white">
        <h2 className="text-lg font-medium">SignVerse Assistant</h2>
        <p className="text-sm text-indigo-200">Ask for help or practice communication</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user' 
                  ? 'bg-indigo-100 dark:bg-indigo-900/40 text-gray-800 dark:text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            >
              <p>{message.text}</p>
              
              {message.emotion && message.sender === 'bot' && (
                <div className="mt-2 flex justify-end">
                  <EmotionIndicator emotion={message.emotion} size="sm" />
                </div>
              )}
              
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
                <span className="text-gray-500 dark:text-gray-400">Typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;