import React, { useState } from 'react';
import { EngineerChatMessage } from '../../types';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  User, 
  Sparkles, 
  Check, 
  CheckCheck, 
  Bot,
  Building2
} from 'lucide-react';
import { askAIChat } from '../../services/api';

interface ChatSectionProps {
  messages: EngineerChatMessage[];
  onSaveMessages: (msgs: EngineerChatMessage[]) => void;
  activeClientName?: string;
  activeProjectTitle?: string;
}

export const ChatSection: React.FC<ChatSectionProps> = ({
  messages,
  onSaveMessages,
  activeClientName = 'Sarah Jenkins',
  activeProjectTitle = 'Grand Modern Villa 2026',
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedClient, setSelectedClient] = useState(activeClientName);
  const [selectedProject, setSelectedProject] = useState(activeProjectTitle);
  const [isAiSuggesting, setIsAiSuggesting] = useState(false);

  // Group messages by recipient/project or filter for selected client
  const conversationMessages = messages.filter(
    (m) => m.senderName === selectedClient || m.recipientName === selectedClient
  );

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: EngineerChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'eng_david_vance',
      senderName: 'David Vance, PE',
      senderRole: 'engineer',
      recipientId: 'usr_customer_1',
      recipientName: selectedClient,
      projectTitle: selectedProject,
      messageText: inputText.trim(),
      timestamp: new Date().toISOString(),
      isRead: true,
    };

    onSaveMessages([...messages, newMsg]);
    setInputText('');
  };

  const handleAISuggestReply = async () => {
    setIsAiSuggesting(true);
    const lastMsg = conversationMessages[conversationMessages.length - 1];
    const contextPrompt = lastMsg ? lastMsg.messageText : 'General structural engineering query for ' + selectedProject;
    
    const suggestion = await askAIChat(`Draft a quick professional structural engineer reply to client inquiry: "${contextPrompt}"`);
    setInputText(suggestion);
    setIsAiSuggesting(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-amber-400" />
            <span>Direct Client Engineering Chat & Consultation Channel</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Communicate directly with house plan owners regarding soil specs, beam calculations, and PE stamp progress.
          </p>
        </div>

        <button
          onClick={handleAISuggestReply}
          disabled={isAiSuggesting}
          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>{isAiSuggesting ? 'Drafting PE Response...' : 'AI Draft Engineering Response'}</span>
        </button>
      </div>

      {/* Main Chat Layout */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-4 min-h-[520px]">
        {/* Left Client List */}
        <div className="border-r border-slate-800 p-4 space-y-3 bg-slate-950/50">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">Active Conversations</h4>
          
          <div className="space-y-1">
            {[
              { name: 'Sarah Jenkins', project: 'Grand Modern Villa 2026', unread: 1 },
              { name: 'Michael Chen', project: 'Coastal Glass House', unread: 0 },
              { name: 'Harrison Meyer', project: 'Hillside Modern Villa', unread: 0 },
            ].map((cl) => (
              <button
                key={cl.name}
                onClick={() => {
                  setSelectedClient(cl.name);
                  setSelectedProject(cl.project);
                }}
                className={`w-full p-3 rounded-2xl text-left transition-all flex items-center gap-3 ${
                  selectedClient === cl.name ? 'bg-amber-500/10 border border-amber-500/30 text-white' : 'hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 shrink-0">
                  {cl.name[0]}
                </div>
                <div className="truncate flex-1">
                  <p className="text-xs font-bold truncate">{cl.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{cl.project}</p>
                </div>
                {cl.unread > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-ping" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Active Message Thread */}
        <div className="md:col-span-3 flex flex-col justify-between bg-slate-900 p-6">
          {/* Active Chat Header */}
          <div className="border-b border-slate-800 pb-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400">
                {selectedClient[0]}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{selectedClient}</h4>
                <p className="text-xs text-amber-400 flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> Project: {selectedProject}
                </p>
              </div>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Online Direct Line
            </span>
          </div>

          {/* Messages Log */}
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[360px] pr-2 scrollbar-thin">
            {conversationMessages.map((msg) => {
              const isMe = msg.senderRole === 'engineer';
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-md p-4 rounded-2xl text-xs space-y-1 shadow-md ${
                    isMe ? 'bg-amber-600 text-white rounded-br-none' : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                  }`}>
                    <div className="flex items-center justify-between gap-2 text-[10px] opacity-80 pb-1">
                      <span className="font-bold">{msg.senderName}</span>
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.messageText}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSendMessage} className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert('Attachment upload ready for CAD files & PDF specs.')}
              className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Attach CAD or PDF"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${selectedClient} regarding ${selectedProject}...`}
              className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-md disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
