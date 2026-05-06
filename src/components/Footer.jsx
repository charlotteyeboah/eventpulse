import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-top container">
      <div className="footer-brand">
        <div className="footer-logo">
          <span className="logo-icon">✦</span>
          <span>EventPulse</span>
        </div>
        <p>Your gateway to unforgettable experiences. Discover, book, and attend the best events across the UAE and beyond.</p>
        <div className="social-links">
          {['Facebook','Instagram','Twitter','LinkedIn'].map(s => (
            <a key={s} href="#!" className="social-link" aria-label={s}>
              {s === 'Facebook' ? '📘' : s === 'Instagram' ? '📸' : s === 'Twitter' ? '🐦' : '💼'}
            </a>
          ))}
        </div>
      </div>

      <div className="footer-links-group">
        <h4>Quick Links</h4>
        <Link to="/">Home</Link>
        <Link to="/events">Browse Events</Link>
        <Link to="/about">About Us</Link>
        <Link to="/signup">Join as Organizer</Link>
      </div>

      <div className="footer-links-group">
        <h4>Categories</h4>
        <Link to="/events?cat=Technology">Technology</Link>
        <Link to="/events?cat=Music">Music</Link>
        <Link to="/events?cat=Business">Business</Link>
        <Link to="/events?cat=Cultural">Cultural</Link>
        <Link to="/events?cat=Health">Health & Wellness</Link>
      </div>

      <div className="footer-links-group">
        <h4>Contact Us</h4>
        <p>📍 DIFC, Dubai, UAE</p>
        <p>📞 +971 4 123 4567</p>
        <p>✉️ hello@eventpulse.ae</p>
        <p>🕐 Mon–Sat: 9AM – 6PM</p>
      </div>
    </div>

    <div className="footer-bottom container">
      <p>© 2025 EventPulse. All rights reserved.</p>
      <div className="footer-bottom-links">
        <a href="#!">Privacy Policy</a>
        <a href="#!">Terms of Service</a>
        <a href="#!">Cookie Policy</a>
      </div>
    </div>
  </footer>
);

export default Footer;
