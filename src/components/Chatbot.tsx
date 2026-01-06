import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { SensorData, ChatMessage } from '../types';
import { format } from 'date-fns';

interface ChatbotProps {
  sensorData: SensorData[];
}

const Chatbot: React.FC<ChatbotProps> = ({ sensorData }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message:
        "👋 **Hello!** I'm your IoT assistant.\n\nI can help you understand your **sensor data**, check **system status**, and give **smart insights**.\n\n💡 Try asking:\n- What's the current temperature?\n- Show system status\n- Analyze recent trends",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Call FastAPI backend
  const fetchBotResponse = async (query: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, n_results: 3 }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      return (
        data.answer ||
        "❌ Sorry, I couldn't generate an answer. Please try again."
      );
    } catch (error) {
      console.error('Error fetching bot response:', error);
      return '⚠️ Connection issue. Please try again later.';
    }
  };

  const handleSendMessage = async (query?: string) => {
    const text = query || inputMessage;
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // 🔥 Call backend for AI-generated response
    const botText = await fetchBotResponse(text);

    const botResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      message: botText,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ✨ Suggested questions
  const suggestedQuestions = [
    "What's the project overview?",
    'Who are the developers?',
    'How to set up the system?',
    'Cost analysis of the project',
    'List all sensors used in the system',
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-slate-900/50 via-blue-950/30 to-slate-900/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mb-4">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
            IoT AI Assistant
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Your intelligent companion for IoT data insights. Ask me anything
            about your sensors, system performance, or smart irrigation
            recommendations.
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-cyan-500/20 shadow-2xl shadow-cyan-500/10 h-[650px] flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-cyan-500/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800 animate-pulse"></div>
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Assistant</h3>
                  <p className="text-xs text-green-400">
                    Online • Ready to help
                  </p>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                {sensorData.length} data points available
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-slate-900/20">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-4 ${
                  message.isUser ? 'flex-row-reverse space-x-reverse' : ''
                } animate-fade-in`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                    message.isUser
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-500'
                      : 'bg-gradient-to-br from-purple-500 to-blue-600 ring-2 ring-purple-500/30'
                  }`}
                >
                  {message.isUser ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </div>
                <div
                  className={`max-w-xs lg:max-w-lg px-5 py-4 rounded-2xl shadow-lg backdrop-blur-sm ${
                    message.isUser
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-cyan-500/25'
                      : 'bg-gradient-to-br from-slate-700/80 to-slate-800/80 text-gray-100 border border-slate-600/50 shadow-slate-900/50'
                  }`}
                >
                  {/* ✅ Render AI/User responses with Markdown */}
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      strong: ({node, ...props}) => (
                        <strong className="font-semibold" {...props} />
                      ),
                      ul: ({node, ...props}) => (
                        <ul className="list-disc pl-5 space-y-1" {...props} />
                      ),
                      ol: ({node, ...props}) => (
                        <ol className="list-decimal pl-5 space-y-1" {...props} />
                      ),
                      li: ({node, ...props}) => (
                        <li className="leading-relaxed" {...props} />
                      ),
                      h1: ({node, ...props}) => (
                        <h1 className="text-xl font-bold mt-4 mb-2" {...props} />
                      ),
                      h2: ({node, ...props}) => (
                        <h2 className="text-lg font-semibold mt-3 mb-1" {...props} />
                      ),
                      p: ({node, ...props}) => (
                        <p className="mb-2 leading-relaxed" {...props} />
                      ),
                    }}
                  >
                    {message.message}
                  </ReactMarkdown>

                  <p className="text-xs opacity-70 mt-2 flex items-center">
                    <span className="w-1 h-1 bg-current rounded-full mr-2"></span>
                    {format(message.timestamp, 'HH:mm')}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center ring-2 ring-purple-500/30 shadow-lg">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 border border-slate-600/50 px-5 py-4 rounded-2xl shadow-lg backdrop-blur-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-700/50 p-6 bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm">
            {/* Suggested Questions */}
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="text-xs px-3 py-2 rounded-full bg-slate-700/70 hover:bg-cyan-600 text-gray-200 hover:text-white transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about temperature, humidity, system status..."
                className="flex-1 bg-slate-700/80 border border-slate-600/50 rounded-xl px-5 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 backdrop-blur-sm transition-all duration-200"
                disabled={isTyping}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
