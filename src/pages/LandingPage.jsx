import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { EVENTS, CATEGORIES, TESTIMONIALS, STATS } from '../data/mockData';
import { getEvents } from '../api';
import './LandingPage.css';

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        if (Array.isArray(data) && data.length > 0) setEvents(data);
        else setEvents(EVENTS);
      } catch { setEvents(EVENTS); }
    };
    fetchEvents();
  }, []);

  const featured = events.filter(e => e.featured || true).slice(0, 3);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(s => (s + 1) % featured.length), 4000);
    return () => clearInterval(timer);
  }, [featured.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/events?q=${searchQuery}`);
  };

  const stats = [
    { label: 'Events Hosted', value: '2,400+' },
    { label: 'Happy Attendees', value: '180K+' },
    { label: 'Cities Covered', value: '12' },
    { label: 'Organizers', value: '500+' },
  ];

  const categories = [
    { name: 'Technology', count: 24 },
    { name: 'Music', count: 18 },
    { name: 'Business', count: 31 },
    { name: 'Cultural', count: 15 },
    { name: 'Health', count: 12 },
    { name: 'Arts', count: 20 },
    { name: 'Food', count: 9 },
    { name: 'Sports', count: 16 },
  ];

  return (
    <div className="landing-page">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg">
          {featured.map((e, i) => (
            <div key={i} className={`hero-slide ${i === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${e.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1400&auto=format'})` }} />
          ))}
          <div className="hero-overlay" />
        </div>

        <div className="hero-content container">
          <div className="hero-text">
            <span className="hero-label badge badge-gold">Dubai & UAE's #1 Event Platform</span>
            <h1 className="hero-title">
              Discover &<br />
              <span className="hero-accent">Experience</span><br />
              Extraordinary Events
            </h1>
            <p className="hero-desc">
              From tech summits to desert festivals — find, book, and attend the most exciting events across the UAE.
            </p>

            <form className="hero-search" onSubmit={handleSearch}>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search events, artists, venues..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">Search</button>
              </div>
            </form>

            <div className="hero-chips">
              {['Technology', 'Music', 'Business', 'Food', 'Cultural'].map(c => (
                <button key={c} className="chip" onClick={() => navigate(`/events?cat=${c}`)}>{c}</button>
              ))}
            </div>
          </div>

          <div className="hero-card-preview">
            {featured[currentSlide] && (
              <div className="preview-card">
                <img src={featured[currentSlide].image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format'} alt="" />
                <div className="preview-info">
                  <span className="badge badge-gold">{featured[currentSlide].category}</span>
                  <h4>{featured[currentSlide].title}</h4>
                  <p>{new Date(featured[currentSlide].date).toLocaleDateString('en-AE', { day: 'numeric', month: 'long' })}</p>
                  <p>{featured[currentSlide].location}</p>
                  <div className="preview-price">
                    {featured[currentSlide].price === 0 ? 'FREE' : `AED ${featured[currentSlide].price}`}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="hero-dots">
          {featured.map((_, i) => (
            <button key={i} className={`dot ${i === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(i)} />
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="stat-item">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories-section container">
        <div className="section-header">
          <h2 className="section-title">Browse by Category</h2>
          <p className="section-subtitle">Explore events that match your interests</p>
        </div>
        <div className="categories-grid">
          {categories.map(cat => (
            <button
              key={cat.name}
              className="category-card"
              onClick={() => navigate(`/events?cat=${cat.name}`)}
            >
              <span className="cat-name">{cat.name}</span>
              <span className="cat-count">{cat.count} events</span>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED EVENTS */}
      <section className="featured-events container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Events</h2>
            <p className="section-subtitle">Handpicked events you won't want to miss</p>
          </div>
          <Link to="/events" className="btn btn-dark">View All</Link>
        </div>
        <div className="grid-3">
          {events.slice(0, 6).map(event => (
            <EventCard key={event._id || event.id} event={event} />
          ))}
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="promo-banner">
        <div className="container promo-inner">
          <div className="promo-text">
            <span className="badge badge-gold">Limited Time</span>
            <h2>Become an Event Organizer</h2>
            <p>Create, manage and sell tickets for your events. Join 500+ organizers already on EventPulse.</p>
            <Link to="/signup" className="btn btn-primary">Get Started Free</Link>
          </div>
          <div className="promo-visual">
            <div className="promo-float-card">
              <div>
                <p>Events Created</p>
                <strong>2,400+</strong>
              </div>
            </div>
            <div className="promo-float-card delay">
              <div>
                <p>Tickets Sold</p>
                <strong>180K+</strong>
              </div>
            </div>
            <div className="promo-float-card delay2">
              <div>
                <p>Avg Rating</p>
                <strong>4.8/5</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section container">
        <div className="section-header">
          <h2 className="section-title">What People Say</h2>
          <p className="section-subtitle">Trusted by thousands across the UAE</p>
        </div>
        <div className="grid-3">
          {TESTIMONIALS.map(t => (
            <div key={t.id} className="testimonial-card card">
              <div className="testimonial-stars">★★★★★</div>
              <p className="testimonial-text">"{t.text}"</p>
              <div className="testimonial-author">
                <img src={t.avatar} alt={t.name} />
                <div>
                  <p className="author-name">{t.name}</p>
                  <p className="author-role">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="newsletter-section container">
        <div className="newsletter-box">
          <h2>Stay in the Loop</h2>
          <p>Get the latest events and exclusive offers delivered to your inbox</p>
          <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;