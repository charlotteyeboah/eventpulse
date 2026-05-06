import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { STATS } from '../data/mockData';
import './AboutPage.css';

const AboutPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="page-wrapper about-page">
      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-bg" />
        <div className="container about-hero-content">
          <span className="badge badge-gold">🌟 About EventPulse</span>
          <h1>We Connect People <br /><span className="hero-accent">With Experiences</span></h1>
          <p>EventPulse is the UAE's premier event discovery and ticketing platform, built to help people find, book, and enjoy the most extraordinary events across the region.</p>
          <div className="about-cta-btns">
            <Link to="/events" className="btn btn-primary">Explore Events</Link>
            <Link to="/signup" className="btn btn-outline">Join as Organizer</Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="about-stats container">
        {STATS.map((s, i) => (
          <div key={i} className="about-stat">
            <span>{s.icon}</span>
            <p className="about-stat-value">{s.value}</p>
            <p className="about-stat-label">{s.label}</p>
          </div>
        ))}
      </section>

      {/* MISSION */}
      <section className="mission-section container">
        <div className="mission-text">
          <span className="badge badge-blue">Our Mission</span>
          <h2 className="section-title" style={{ marginTop: 12 }}>Making Every Event <br /> Unforgettable</h2>
          <p>We believe that great events have the power to educate, inspire, and bring communities together. EventPulse was built with a single purpose: to eliminate the friction between people and the experiences they love.</p>
          <p>From intimate workshops to massive festivals, we provide the tools to make every event a success — for organizers and attendees alike.</p>
          <div className="mission-points">
            {['Seamless booking in 3 clicks', 'Instant QR code tickets', 'Real-time event updates', 'Secure payment processing'].map(p => (
              <div key={p} className="mission-point"><span>✓</span> {p}</div>
            ))}
          </div>
        </div>
        <div className="mission-visual">
          <div className="mission-img-grid">
            <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&auto=format" alt="Event" />
            <img src="https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&auto=format" alt="Event" />
            <img src="https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=400&auto=format" alt="Event" />
            <img src="https://images.unsplash.com/photo-1531058020387-3be344556be6?w=400&auto=format" alt="Event" />
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="team-section">
        <div className="container">
          <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="section-title">Meet the Team</h2>
            <p className="section-subtitle">Passionate people building the future of events</p>
          </div>
          <div className="grid-4">
            {[
              { name: 'Khalid Al Mansouri', role: 'CEO & Co-Founder', emoji: '👨‍💼', bg: '#0a0f2e' },
              { name: 'Aisha Rahman', role: 'CTO & Co-Founder', emoji: '👩‍💻', bg: '#1e2a6e' },
              { name: 'Omar Bin Laden', role: 'Head of Design', emoji: '🎨', bg: '#7c3aed' },
              { name: 'Fatima Noor', role: 'Head of Marketing', emoji: '📣', bg: '#e8445a' },
            ].map((member, i) => (
              <div key={i} className="team-card card">
                <div className="team-avatar" style={{ background: member.bg }}>
                  <span>{member.emoji}</span>
                </div>
                <div className="team-info">
                  <h4>{member.name}</h4>
                  <p>{member.role}</p>
                  <div className="team-socials">
                    <a href="#!" className="team-social">💼</a>
                    <a href="#!" className="team-social">🐦</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="contact-section container" id="contact">
        <div className="contact-layout">
          <div className="contact-info">
            <span className="badge badge-gold">Contact Us</span>
            <h2 className="section-title" style={{ marginTop: 12 }}>Get In Touch</h2>
            <p>Have a question, feedback, or partnership inquiry? We'd love to hear from you.</p>
            <div className="contact-details">
              {[
                { icon: '📍', label: 'Address', value: 'Gate Village 5, DIFC, Dubai, UAE' },
                { icon: '📞', label: 'Phone', value: '+971 4 123 4567' },
                { icon: '✉️', label: 'Email', value: 'hello@eventpulse.ae' },
                { icon: '🕐', label: 'Hours', value: 'Mon–Sat: 9AM – 6PM GST' },
              ].map(d => (
                <div key={d.label} className="contact-detail">
                  <span className="contact-icon">{d.icon}</span>
                  <div>
                    <p className="contact-detail-label">{d.label}</p>
                    <p className="contact-detail-value">{d.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="contact-form-box">
            {submitted ? (
              <div className="form-success">
                <span>✅</span>
                <h3>Message Sent!</h3>
                <p>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <h3>Send a Message</h3>
                <div className="form-row-2">
                  <div className="form-group"><label>Full Name *</label><input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your full name" /></div>
                  <div className="form-group"><label>Email *</label><input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="your@email.com" /></div>
                </div>
                <div className="form-group"><label>Subject *</label><input required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} placeholder="How can we help?" /></div>
                <div className="form-group"><label>Message *</label><textarea required value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Write your message here..." /></div>
                <button type="submit" className="btn btn-primary send-btn">Send Message →</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
