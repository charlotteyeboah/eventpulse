import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getEvent, getImageForCategory } from '../api';
import './EventDetailPage.css';

const TICKET_TYPES = [
  { type: 'General', multiplier: 1 },
  { type: 'VIP', multiplier: 2.5 },
  { type: 'Group (x5)', multiplier: 4.5 },
];

const EventDetailPage = () => {
  const { id } = useParams();
  const { addToCart, user } = useApp();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState('General');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEvent(id);
        if (data._id) setEvent(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return (
    <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: 120 }}>
      <h2>Loading event...</h2>
    </div>
  );

  if (!event) return (
    <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: 120 }}>
      <h2>Event not found</h2>
      <Link to="/events" className="btn btn-primary" style={{ marginTop: 20 }}>Back to Events</Link>
    </div>
  );

  const ticketPrice = event.price === 0 ? 0 : Math.round(event.price * TICKET_TYPES.find(t => t.type === selectedTicket).multiplier);
  const total = ticketPrice * qty;

  const handleBook = () => {
    if (!user) { navigate('/login'); return; }
    addToCart(event, selectedTicket, qty);
    navigate('/cart');
  };

  return (
    <div className="page-wrapper event-detail-page">
      <div className="detail-hero" style={{ backgroundImage: `url(${event.image || getImageForCategory(event.category)})` }}>'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format'})` }}>
        <div className="detail-hero-overlay" />
        <div className="container detail-hero-content">
          <Link to="/events" className="back-link">Back to Events</Link>
          <span className="badge badge-gold">{event.category}</span>
          <h1>{event.title}</h1>
          <div className="detail-meta">
            <span>📅 {new Date(event.date).toLocaleDateString('en-AE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>⏰ {event.time}</span>
            <span>📍 {event.location}</span>
          </div>
        </div>
      </div>

      <div className="container detail-layout">
        <div className="detail-main">
          <div className="detail-tabs">
            {['about', 'schedule', 'reviews'].map(tab => (
              <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'about' && (
            <div className="tab-content">
              <h3>About This Event</h3>
              <p>{event.description}</p>
              <h3>Organizer</h3>
              <div className="organizer-info">
                <div className="org-avatar">E</div>
                <div>
                  <p className="org-name">EventPulse Organizer</p>
                  <p className="org-sub">Verified Organizer</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="tab-content">
              <h3>Event Schedule</h3>
              {[
                { time: '09:00 AM', title: 'Registration', desc: 'Check-in and collect your event kit' },
                { time: '10:00 AM', title: 'Opening Keynote', desc: 'Special address from the organizers' },
                { time: '01:00 PM', title: 'Networking Lunch', desc: 'Connect with fellow attendees' },
                { time: '05:00 PM', title: 'Closing Ceremony', desc: 'Awards and farewell' },
              ].map((s, i) => (
                <div key={i} className="schedule-item">
                  <div className="schedule-time">{s.time}</div>
                  <div className="schedule-connector">
                    <div className="schedule-dot" />
                    <div className="schedule-line" />
                  </div>
                  <div className="schedule-info">
                    <h4>{s.title}</h4>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="tab-content">
              <h3>Reviews</h3>
              <p>No reviews yet for this event.</p>
            </div>
          )}
        </div>

        <div className="booking-sidebar">
          <div className="booking-card">
            <h3>Book Your Ticket</h3>
            <div className="ticket-type-select">
              {TICKET_TYPES.map(t => (
                <button key={t.type}
                  className={`ticket-type-btn ${selectedTicket === t.type ? 'active' : ''}`}
                  onClick={() => setSelectedTicket(t.type)}>
                  <span>{t.type}</span>
                  <span>{event.price === 0 ? 'FREE' : `AED ${Math.round(event.price * t.multiplier)}`}</span>
                </button>
              ))}
            </div>
            <div className="qty-control">
              <label>Quantity</label>
              <div className="qty-btns">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                <span>{qty}</span>
                <button onClick={() => setQty(Math.min(10, qty + 1))}>+</button>
              </div>
            </div>
            <div className="booking-summary">
              <div className="summary-row"><span>Ticket Price</span><span>AED {ticketPrice}</span></div>
              <div className="summary-row"><span>Quantity</span><span>x{qty}</span></div>
              <div className="summary-total"><span>Total</span><span>AED {total}</span></div>
            </div>
            <button className="btn btn-primary booking-btn" onClick={handleBook}>
              {user ? (event.price === 0 ? 'Register Free' : 'Add to Cart') : 'Login to Book'}
            </button>
            <p className="booking-note">Instant QR ticket delivery after payment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;