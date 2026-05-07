import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, X, Send, Bot, User, Zap, RefreshCw, Loader2 } from 'lucide-react';
import API from '../../services/api';

export default function AICopilot() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('manager_ai_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse chat history");
      }
    }
    return [
      {
        role: 'assistant',
        content: 'Hello! I am your Camp Manager AI Assistant. How can I help you today? I can summarize bookings, suggest notifications, or analyze revenue trends.'
      }
    ];
  });

  // Save to local storage whenever messages change
  useEffect(() => {
    localStorage.setItem('manager_ai_chat_history', JSON.stringify(messages));
  }, [messages]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Hidden strictly to manager routes
  const isManagerRoute = location.pathname.includes('/manager-dashboard') || location.pathname.includes('/super-admin');

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMsg = { role: 'user', content: inputValue };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Connect to the new decoupled AI backend route
      const response = await API.post('/ai/chat', { prompt: userMsg.content, role: 'manager' });
      
      if (response.data && response.data.success) {
        setMessages((prev) => [...prev, { role: 'assistant', content: response.data.answer }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: response.data.message || "I'm sorry, I couldn't generate a response." }]);
      }
    } catch (error) {
      console.error("AI Copilot Error:", error);
      // Fallback message if backend isn't ready or API key is missing
      let errorText = "Ah, it seems my connection to the AI matrix was interrupted. (Is the backend running and GEMINI_API_KEY set?)";
      if (error.response && error.response.data && error.response.data.message) {
         errorText = `Error: ${error.response.data.message}`;
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: errorText }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const predefinedPrompts = [
    "Summarize today's bookings",
    "Analyze revenue trends",
    "Draft weather notification"
  ];

  if (!isManagerRoute) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-2xl transition-all duration-300 z-50 flex items-center justify-center hover:scale-105 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        title="Open AI Copilot"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
      </button>

      {/* Floating Chat Interface */}
      <div 
        className={`fixed bottom-0 sm:bottom-6 sm:right-6 w-full sm:w-[400px] h-[550px] max-h-screen bg-white sm:rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-4 flex items-center justify-between shadow-md z-10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Bot className="w-5 h-5 text-teal-50" />
            </div>
            <div>
              <h3 className="font-bold text-white leading-none">EthioCamp AI</h3>
              <span className="text-xs text-teal-100 flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-400"></span> Online
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setMessages([{ role: 'assistant', content: 'Hello! I am your Camp Manager AI Assistant. How can I help you today? I can summarize bookings, suggest notifications, or analyze revenue trends.' }])}
              className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
              title="Clear Chat History"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 relative">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mb-1">
                  <Bot className="w-4 h-4 text-teal-600" />
                </div>
              )}
              
              <div 
                className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-teal-600 text-white rounded-br-sm' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-bl-sm'
                }`}
              >
                {msg.content}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mb-1">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-end gap-2 justify-start">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mb-1">
                <Bot className="w-4 h-4 text-teal-600" />
              </div>
              <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Predefined Prompts */}
        <div className="px-4 py-3 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto shrink-0 no-scrollbar">
          {predefinedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputValue(prompt);
                handleSend(); // Send immediately if you want, or just pre-fill. Let's pre-fill for user safety.
              }}
              className="whitespace-nowrap px-3 py-1.5 bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-200 text-slate-600 hover:text-teal-700 rounded-full text-xs font-medium transition-colors flex items-center gap-1"
            >
              <Zap className="w-3 h-3" />
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white shrink-0">
          <div className="relative flex items-center">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none h-[48px] overflow-hidden leading-[1.5]"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className={`absolute right-2 p-2 rounded-lg transition-colors flex items-center justify-center ${inputValue.trim() && !isTyping ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'bg-slate-200 text-slate-400'}`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center mt-2 flex items-center justify-center gap-1">
            <RefreshCw className="w-3 h-3 text-slate-400" />
            <p className="text-[10px] text-slate-400">AI responses may be simulated or inaccurate</p>
          </div>
        </div>
      </div>
    </>
  );
}
