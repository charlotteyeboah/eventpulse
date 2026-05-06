import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const BOT_REPLIES = {
  greeting: ["Hi there! 👋 I'm Pulse, your EventPulse assistant. How can I help you today?"],
  events: ["We have amazing events across Dubai and Abu Dhabi! 🎉 You can browse all events by clicking 'Events' in the nav bar, or use the category filters to find what interests you."],
  book: ["Booking is simple! Find an event you love, click 'Book Now', choose your ticket type, and proceed to checkout. You'll get a QR code instantly! 🎫"],
  price: ["Our events range from FREE to premium experiences. We also offer early bird discounts! Use filters on the Events page to set your budget."],
  organizer: ["Want to host an event? Sign up as an Organizer and get access to our full organizer panel to create and manage events. 🗂️"],
  contact: ["📍 DIFC, Dubai, UAE\n📞 +971 4 123 4567\n✉️ hello@eventpulse.ae"],
  refund: ["Refund requests can be made up to 48 hours before the event. Please contact our support team at hello@eventpulse.ae with your booking ID."],
  default: ["That's a great question! 😊 I'm still learning, but our team is happy to help. You can reach us at hello@eventpulse.ae or call +971 4 123 4567."]
};

const getReply = (message, events = []) => {
  const m = message.toLowerCase();
  if (m.match(/hi|hello|hey|greet/)) return BOT_REPLIES.greeting[0];
  if (m.match(/book|ticket|register|buy/)) return BOT_REPLIES.book[0];
  if (m.match(/organiz|host|create|manage/)) return BOT_REPLIES.organizer[0];
  if (m.match(/contact|email|phone|address|reach/)) return BOT_REPLIES.contact[0];
  if (m.match(/refund|cancel|return/)) return BOT_REPLIES.refund[0];

  // Search events by name
  if (events.length > 0) {
    const matched = events.find(e => m.includes(e.title.toLowerCase()));
    if (matched) {
      return `🎉 ${matched.title}\n📅 ${new Date(matched.date).toLocaleDateString('en-AE', { day:'numeric', month:'long', year:'numeric' })}\n📍 ${matched.location}\n💰 ${matched.price === 0 ? 'FREE' : `AED ${matched.price}`}\n⏰ ${matched.time}`;
    }
    // Search by keyword in title
    const keywordMatch = events.find(e =>
      e.title.toLowerCase().split(' ').some(word => word.length > 3 && m.includes(word))
    );
    if (keywordMatch) {
      return `🎉 ${keywordMatch.title}\n📅 ${new Date(keywordMatch.date).toLocaleDateString('en-AE', { day:'numeric', month:'long', year:'numeric' })}\n📍 ${keywordMatch.location}\n💰 ${keywordMatch.price === 0 ? 'FREE' : `AED ${keywordMatch.price}`}`;
    }
  }

  if (m.match(/event|show|find|browse|price|cost|fee|free|cheap/)) {
    if (events.length > 0) {
      const list = events.slice(0, 3).map(e => `• ${e.title} — ${e.price === 0 ? 'FREE' : `AED ${e.price}`}`).join('\n');
      return `Here are some upcoming events:\n${list}\n\nVisit our Events page to see all!`;
    }
    return BOT_REPLIES.events[0];
  }

if (m.match(/interest|recommend|suggest|best|popular|top|good|great|attend|go to/)) {
    if (events.length > 0) {
      const list = events.slice(0, 3).map(e => `• ${e.title} — ${e.price === 0 ? 'FREE' : `AED ${e.price}`}`).join('\n');
      return `Here are some great events I recommend:\n${list}\n\nVisit our Events page to see all! 🎉`;
    }
  }

  if (m.match(/how many|total|list|all event/)) {
    if (events.length > 0) {
      return `We currently have ${events.length} amazing events! 🎉 Visit our Events page to browse them all.`;
    }
  }

  if (m.match(/location|where|venue|place/)) {
    return `Our events are held across Dubai and the UAE! Popular venues include Dubai World Trade Centre, Atlantis The Palm, DIFC and more. 📍`;
  }

  if (m.match(/time|when|date|schedule/)) {
    return `Events run throughout the year! Check our Events page for specific dates and times. 📅`;
  }

  if (m.match(/help|support|assist/)) {
    return `I can help you with:\n• Finding events\n• Checking prices\n• Booking information\n• Contact details\n\nJust ask me anything! 😊`;
  }

  return BOT_REPLIES.default[0];
};

const QUICK_REPLIES = ['Browse Events', 'How to Book?', 'Pricing', 'Become Organizer'];

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm Pulse 🤖 — your EventPulse assistant. Ask me about any event, price or booking!" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [events, setEvents] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setEvents(data); })
      .catch(() => {});
  }, []); const sendMessage = (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setMessages(prev => [...prev, { from: 'user', text: msg }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: 'bot', text: getReply(msg, events) }]);
    }, 900 + Math.random() * 400);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      <button className={`chatbot-trigger ${open ? 'active' : ''}`} onClick={() => setOpen(!open)}>
        {open ? '✕' : '💬'}
        {!open && <span className="chatbot-pulse" />}
      </button>

      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-avatar">🤖</div>
            <div>
              <p className="chatbot-name">Pulse</p>
              <p className="chatbot-status"><span className="online-dot" />Online Now</p>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.from}`}>
                {msg.from === 'bot' && <div className="bot-avatar">🤖</div>}
                <div className="msg-bubble">{msg.text}</div>
              </div>
            ))}
            {typing && (
              <div className="chat-msg bot">
                <div className="bot-avatar">🤖</div>
                <div className="msg-bubble typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="quick-replies">
            {QUICK_REPLIES.map(q => (
              <button key={q} className="quick-reply-btn" onClick={() => sendMessage(q)}>{q}</button>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button onClick={() => sendMessage()} disabled={!input.trim()}>➤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
