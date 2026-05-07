import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, X, Send, Bot, User, Zap, RefreshCw, Loader2 } from 'lucide-react';
import API from '../../services/api';

export default function CamperAICopilot() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('camper_ai_chat_history');
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
        content: 'Hello! I am your Camper AI Assistant. How can I help you today? I can help you find campsites, check booking policies, or suggest activities.'
      }
    ];
  });

  // Save to local storage whenever messages change
  useEffect(() => {
    localStorage.setItem('camper_ai_chat_history', JSON.stringify(messages));
  }, [messages]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Only show on camper dashboard routes
  const isCamperRoute = location.pathname.includes('/camper-dashboard');

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
      const response = await API.post('/ai/chat', { prompt: userMsg.content, role: 'camper' });
      
      if (response.data && response.data.success) {
        setMessages((prev) => [...prev, { role: 'assistant', content: response.data.answer }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: response.data.message || "I'm sorry, I couldn't generate a response." }]);
      }
    } catch (error) {
      console.error("AI Copilot Error:", error);
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
    "Discover campsites",
    "Cancellation policy",
    "Help me book"
  ];

  if (!isCamperRoute) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-2xl transition-all duration-300 z-50 flex items-center justify-center hover:scale-105 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        title="Ask EthioCamp AI"
      >
        <Sparkles className="w-6 h-6 animate-pulse" />
      </button>

      {/* Floating Chat Interface */}
      <div 
        className={`fixed bottom-0 sm:bottom-6 sm:right-6 w-full sm:w-[400px] h-[550px] max-h-screen bg-white sm:rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-10 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 p-4 flex items-center justify-between shadow-md z-10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Bot className="w-5 h-5 text-green-50" />
            </div>
            <div>
              <h3 className="font-bold text-white leading-none">EthioCamp Camper AI</h3>
              <span className="text-xs text-green-100 flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-lime-400"></span> Ready to explore
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setMessages([{ role: 'assistant', content: 'Hello! I am your Camper AI Assistant. How can I help you today? I can help you find campsites, check booking policies, or suggest activities.' }])}
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
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mb-1">
                  <Bot className="w-4 h-4 text-green-600" />
                </div>
              )}
              
              <div 
                className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-green-600 text-white rounded-br-sm' 
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
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0 mb-1">
                <Bot className="w-4 h-4 text-green-600" />
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
              className="whitespace-nowrap px-3 py-1.5 bg-slate-50 hover:bg-green-50 border border-slate-200 hover:border-green-200 text-slate-600 hover:text-green-700 rounded-full text-xs font-medium transition-colors flex items-center gap-1"
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
              placeholder="Ask about campsites, bookings, etc..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none h-[48px] overflow-hidden leading-[1.5]"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className={`absolute right-2 p-2 rounded-lg transition-colors flex items-center justify-center ${inputValue.trim() && !isTyping ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-slate-200 text-slate-400'}`}
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
