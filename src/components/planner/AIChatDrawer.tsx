import React, { useState } from 'react';
import { askAIChat } from '../../services/api';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Building2, 
  Loader2, 
  MessageSquare,
  Compass
} from 'lucide-react';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm0',
      sender: 'ai',
      text: 'Hello! I am your BuildAI Civil Engineering & Architectural Assistant. Ask me anything about IBC building codes, floor plans, structural rebar, or zoning permits.',
      time: 'Just now',
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsSending(true);

    try {
      const replyText = await askAIChat(query);
      const aiMsg: ChatMessage = {
        id: `a_${Date.now()}`,
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsSending(false);
    } catch (err) {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    'What concrete grade is best for expansive clay soil?',
    'Explain IBC fire assembly rating requirements for garages.',
    'How do I maximize solar roof panel efficiency?',
    'What are standard front and side zoning setback limits?',
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col text-slate-100">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">BuildAI Engineering Assistant</h3>
            <p className="text-[10px] text-slate-400">Powered by Gemini 3.6 Flash</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[85%] ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <p className="leading-relaxed">{m.text}</p>
              <span className="block text-[9px] text-slate-400 text-right mt-1 opacity-75">{m.time}</span>
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span>Consulting structural engineering knowledgebase...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/50 space-y-1.5">
        <p className="text-[10px] uppercase font-bold text-slate-500">Quick Engineering Topics:</p>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition-all text-left truncate max-w-full"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about floor plans, rebar, codes..."
            className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim()}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
