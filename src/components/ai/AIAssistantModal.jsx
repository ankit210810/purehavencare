import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Phone, Mail, ArrowRight, ShoppingBag } from 'lucide-react';
import { askAIAssistant } from '../../services/aiAssistantService';
import { useCart } from '../../context/CartContext';
import { useNotification } from '../../context/NotificationContext';

export default function AIAssistantModal({ isOpen, onClose, onQuickView }) {
  const { addItem } = useCart();
  const { addToast } = useNotification();
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello! I am your personal **PureHaven Fromager AI**.\n\nWhether you are planning a grand dinner party, seeking wine pairings, or looking for delicate A2 cultured dairy, I am at your service. How may I assist your palate today?`,
      recommendedProducts: []
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    "Wine pairings for Cheddar & Brie",
    "Cheeseboard for 8 guests",
    "Low-lactose & A2 options",
    "How does cold-chain delivery work?",
    "Direct customer care contact"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (queryText) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend || isTyping) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await askAIAssistant(textToSend, messages);
      const botMsg = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: response.text,
        recommendedProducts: response.recommendedProducts || []
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          sender: 'bot',
          text: "I apologize, my tasting notes are momentarily resting. You can reach our master cheesemaker directly at +91 91421 66210 or purehavencare26@gmail.com.",
          recommendedProducts: []
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-charcoal-950/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-float border border-cream-200 overflow-hidden flex flex-col h-[650px] max-h-[90vh] z-10 animate-fade-in">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-forest-950 text-cream-50 flex items-center justify-between border-b border-forest-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-forest-900 border border-butter-400/40 text-butter-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-cream-50 flex items-center gap-2">
                <span>PureHaven Fromager AI</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-forest-800 text-butter-300">
                  Sommelier Engine
                </span>
              </h3>
              <p className="text-xs text-cream-300">
                Culinary pairings, guest board planning, and dietary recommendations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-cream-300 hover:text-white hover:bg-forest-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-cream-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-forest-900 text-butter-400 flex items-center justify-center flex-shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-soft ${
                    isUser
                      ? 'bg-forest-900 text-cream-50 rounded-br-none'
                      : 'bg-white text-charcoal-900 border border-cream-200 rounded-bl-none'
                  }`}
                >
                  {/* Markdown formatted text */}
                  <div className="whitespace-pre-line space-y-2">
                    {msg.text.split('\n\n').map((para, i) => (
                      <p key={i}>
                        {para.split('**').map((part, index) => 
                          index % 2 === 1 ? <strong key={index} className="font-bold text-forest-950">{part}</strong> : part
                        )}
                      </p>
                    ))}
                  </div>

                  {/* Recommended Product Cards inside AI Message */}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-cream-100 space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-forest-700">
                        Recommended from PureHaven Cellars:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.recommendedProducts.map((prod) => (
                          <div
                            key={prod.id}
                            className="flex items-center gap-2 p-2 rounded-xl bg-cream-50 border border-cream-200 hover:border-butter-400 transition-all text-charcoal-900"
                          >
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold truncate">{prod.name}</p>
                              <p className="text-xs text-forest-900 font-bold">₹{prod.price}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onClose();
                                    onQuickView(prod);
                                  }}
                                  className="text-[10px] font-bold text-forest-700 hover:underline"
                                >
                                  Details
                                </button>
                                <span>•</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    addItem(prod);
                                    addToast(`Added "${prod.name}" to your cart!`, 'success');
                                  }}
                                  className="text-[10px] font-bold text-forest-800 hover:text-forest-950 hover:underline flex items-center gap-0.5"
                                >
                                  + Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-forest-100 text-forest-900 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 items-center text-xs text-charcoal-500 italic">
              <div className="w-8 h-8 rounded-xl bg-forest-900 text-butter-400 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <span className="animate-pulse">Consulting fromagerie tasting notes...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-3 bg-cream-100/60 border-t border-cream-200 overflow-x-auto flex gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(prompt)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white border border-cream-300 hover:border-butter-400 hover:bg-butter-50 text-xs text-charcoal-700 font-medium transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-cream-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about cheese pairings, party quantities, or dietary notes..."
              className="flex-1 px-4 py-3 rounded-2xl bg-cream-50 border border-cream-300 text-xs sm:text-sm focus:outline-none focus:border-forest-700"
            />
            <button
              type="submit"
              disabled={isTyping || !inputText.trim()}
              className="p-3 rounded-2xl bg-forest-900 hover:bg-forest-800 disabled:opacity-50 text-cream-50 transition-all shadow-sm flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
