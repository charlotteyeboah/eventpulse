import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './EventCard.css';
import { getImageForCategory } from '../api';

const EventCard = ({ event }) => {
  const { addToCart, user } = useApp();
  const discount = event.originalPrice > event.price && event.originalPrice > 0
    ? Math.round((1 - event.price / event.originalPrice) * 100)
    : 0;

  const capacityPct = Math.round((event.attendees / event.capacity) * 100);

  return (
    <div className="event-card card">
      <div className="event-card-img">
        <img src={event.image || getImageForCategory(event.category)} alt={event.title} loading="lazy" />
        <div className="event-card-overlay" />
        {event.featured && <span className="event-featured-badge badge badge-gold">Featured</span>}
        {discount > 0 && <span className="event-discount-badge badge badge-red">{discount}% OFF</span>}
        <span className="event-category-badge">{event.category}</span>
      </div>

      <div className="event-card-body">
        <h3 className="event-card-title">{event.title}</h3>
        
        <div className="event-card-meta">
          <span> {new Date(event.date).toLocaleDateString('en-AE', { day:'numeric', month:'short', year:'numeric' })}</span>
          <span> {event.time}</span>
        </div>
        <div className="event-card-meta">
          <span> {event.location}</span>
        </div>

        <div className="event-card-tags">
         {(event.tags || []).slice(0, 3).map(t => (
            <span key={t} className="event-tag">{t}</span>
          ))}
        </div>

        <div className="event-capacity">
          <div className="capacity-bar">
            <div className="capacity-fill" style={{ width: `${capacityPct}%` }} />
          </div>
          <span>{event.attendees.toLocaleString()} / {event.capacity.toLocaleString()} registered</span>
        </div>

        <div className="event-card-footer">
          <div className="event-price">
            {event.price === 0 ? (
              <span className="price-free">FREE</span>
            ) : (
              <>
                <span className="price-current">AED {event.price}</span>
                {event.originalPrice > event.price && (
                  <span className="price-original">AED {event.originalPrice}</span>
                )}
              </>
            )}
          </div>
          <div className="event-card-actions">
            <Link to={`/events/${event._id || event.id}`} className="btn btn-dark">Details</Link>
            <button
              className="btn btn-primary"
              onClick={() => addToCart(event)}
              disabled={!user}
            >
              {event.price === 0 ? 'Register' : 'Book'}
            </button>
          </div>
        </div>

        <div className="event-rating">
          {'★'.repeat(Math.floor(event.rating))}{'☆'.repeat(5 - Math.floor(event.rating))}
          <span>{event.rating} ({event.reviews} reviews)</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
