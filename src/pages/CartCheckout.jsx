
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './CartCheckout.css';
import { createBooking } from '../api';
import { getImageForCategory } from '../api';

export const CartPage = () => {
  const { cart, removeFromCart, updateCartQty, cartTotal, cartCount, user } = useApp();
  const navigate = useNavigate();

  if (cart.length === 0) return (
    <div className="page-wrapper empty-cart">
      <div className="empty-cart-content">
        <span>🛒</span>
        <h2>Your cart is empty</h2>
        <p>Discover amazing events and start booking!</p>
        <Link to="/events" className="btn btn-primary">Browse Events</Link>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper cart-page">
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: 8, marginTop: 20 }}>Shopping Cart</h1>
        <p className="section-subtitle">{cartCount} item{cartCount !== 1 ? 's' : ''} in your cart</p>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item, i) => (
              <div key={i} className="cart-item">
                <img src={item.event.image || getImageForCategory(item.event.category)} alt={item.event.title} />
                <div className="cart-item-info">
                  <span className="badge badge-blue">{item.event.category}</span>
                  <h3>{item.event.title}</h3>
                  <p>📅 {new Date(item.event.date).toLocaleDateString('en-AE', { day:'numeric', month:'short', year:'numeric' })}</p>
                  <p>📍 {item.event.location}</p>
                  <p>🎫 Ticket Type: <strong>{item.ticketType}</strong></p>
                </div>
                <div className="cart-item-controls">
                  <div className="qty-btns">
                    <button onClick={() => updateCartQty(item.eventId, item.ticketType, item.qty - 1)}>−</button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateCartQty(item.eventId, item.ticketType, item.qty + 1)}>+</button>
                  </div>
                  <p className="cart-item-price">AED {item.price === 0 ? 0 : item.price * item.qty}</p>
                  <p className="price-per">AED {item.price} each</p>
                  {item.price < item.event?.originalPrice && item.event?.originalPrice > 0 && (
                    <p className="price-save">You save AED {(item.event.originalPrice - item.price) * item.qty}</p>
                  )}
                  <button className="remove-btn" onClick={() => removeFromCart(item.eventId, item.ticketType)}>
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary-box">
            <h3>Order Summary</h3>
            <div className="summary-rows">
              <div className="summary-row"><span>Subtotal</span><span>AED {cartTotal}</span></div>
              <div className="summary-row"><span>Service Fee (5%)</span><span>AED {Math.round(cartTotal * 0.05)}</span></div>
              <div className="summary-row"><span>Items</span><span>{cartCount}</span></div>
              {cartTotal > 0 && <div className="summary-row save"><span>You Save</span><span>AED {cart.reduce((acc, i) => acc + ((i.event?.originalPrice || i.price) - i.price) * i.qty, 0)}</span></div>}
            </div>
            <div className="summary-total-row">
              <span>Total</span>
              <span>AED {cartTotal + Math.round(cartTotal * 0.05)}</span>
            </div>
            <button
              className="btn btn-primary checkout-btn"
              onClick={() => user ? navigate('/checkout') : navigate('/login')}
            >
              {user ? '→ Proceed to Checkout' : '🔐 Login to Checkout'}
            </button>
            <Link to="/events" className="btn btn-dark continue-btn">← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CheckoutPage = () => {
  const { cart, cartTotal, addBooking, clearCart, user } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    paymentMethod: 'card',
    cardNumber: '', expiry: '', cvv: '',
  });
  const [loading, setLoading] = useState(false);

  const total = cartTotal + Math.round(cartTotal * 0.05);

const handlePay = async () => {
  setLoading(true);
  try {
    for (const item of cart) {
      await createBooking({
        event: item.eventId || item.event?._id || item.event?.id,
        ticketType: item.ticketType,
        quantity: item.qty,
        totalPrice: item.price * item.qty
      });
    }
  } catch (error) {
    console.log('Booking error:', error);
  }
  const booking = addBooking({ items: cart, total, buyer: form });
  clearCart();
  navigate('/confirmation', { state: { booking } });
  setLoading(false);
};
  return (
    <div className="page-wrapper checkout-page">
      <div className="container">
        <div className="checkout-steps">
          <div className={`checkout-step ${step >= 1 ? 'active' : ''}`}>
            <span>1</span> Contact Info
          </div>
          <div className="step-connector" />
          <div className={`checkout-step ${step >= 2 ? 'active' : ''}`}>
            <span>2</span> Shipping
          </div>
          <div className="step-connector" />
          <div className={`checkout-step ${step >= 3 ? 'active' : ''}`}>
            <span>3</span> Payment
          </div>
        </div>

        <div className="checkout-layout">
          <div className="checkout-form-area">
            {step === 1 && (
              <div className="checkout-section">
                <h3>Contact Information</h3>
                <p>Have an account? <Link to="/login" style={{ color: 'var(--accent)' }}>Log in</Link></p>
                <div className="form-row-2">
                  <div className="form-group"><label>First Name</label>
                    <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="First name" />
                  </div>
                  <div className="form-group"><label>Last Name</label>
                    <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" />
                  </div>
                </div>
                <div className="form-group"><label>Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
                </div>
                <div className="form-group"><label>Phone</label>
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+971 XX XXX XXXX" />
                </div>
                <label className="checkbox-label" style={{ marginBottom: 20 }}>
                  <input type="checkbox" /> Email me with updates and offers
                </label>
                <button className="btn btn-primary" onClick={() => setStep(2)}>Continue to Shipping →</button>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-section">
                <h3>Delivery Method</h3>
                <div className="delivery-options">
                  <div className="delivery-option active">
                    <span>📧</span>
                    <div>
                      <strong>Email Delivery (QR Code)</strong>
                      <p>Instant delivery to your email address</p>
                    </div>
                    <span className="delivery-price">FREE</span>
                  </div>
                  <div className="delivery-option">
                    <span>📱</span>
                    <div>
                      <strong>SMS Delivery</strong>
                      <p>QR code sent via SMS</p>
                    </div>
                    <span className="delivery-price">AED 2</span>
                  </div>
                </div>
                <div className="checkout-nav">
                  <button className="btn btn-dark" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary" onClick={() => setStep(3)}>Continue to Payment →</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="checkout-section">
                <h3>Payment</h3>
                <div className="payment-methods">
                  {[
                    { id: 'card', label: '💳 Credit/Debit Card' },
                    { id: 'paypal', label: '🅿️ PayPal' },
                    { id: 'gpay', label: '📱 Google Pay' },
                  ].map(m => (
                    <button key={m.id} className={`payment-method-btn ${form.paymentMethod === m.id ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, paymentMethod: m.id })}>
                      {m.label}
                    </button>
                  ))}
                </div>

                {form.paymentMethod === 'card' && (
                  <div className="card-form">
                    <div className="form-group"><label>Card Number</label>
                      <input value={form.cardNumber} onChange={e => setForm({ ...form, cardNumber: e.target.value })} placeholder="1234 5678 9012 3456" maxLength={19} />
                    </div>
                    <div className="form-row-2">
                      <div className="form-group"><label>Expiry</label>
                        <input value={form.expiry} onChange={e => setForm({ ...form, expiry: e.target.value })} placeholder="MM/YY" maxLength={5} />
                      </div>
                      <div className="form-group"><label>CVV</label>
                        <input type="password" value={form.cvv} onChange={e => setForm({ ...form, cvv: e.target.value })} placeholder="•••" maxLength={3} />
                      </div>
                    </div>
                  </div>
                )}

                <div className="secure-notice">🔒 Your payment info is encrypted and secure</div>

                <div className="checkout-nav">
                  <button className="btn btn-dark" onClick={() => setStep(2)}>← Back</button>
                  <button className="btn btn-primary pay-btn" onClick={handlePay} disabled={loading}>
                    {loading ? <><span className="spinner" /> Processing...</> : `💳 Pay AED ${total}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="checkout-summary">
            <h3>Order Summary</h3>
            {cart.map((item, i) => (
              <div key={i} className="checkout-item">
                <img src={item.event.image || getImageForCategory(item.event.category)} alt="" />
                <div>
                  <p className="checkout-item-title">{item.event.title}</p>
                  <p className="checkout-item-sub">{item.ticketType} × {item.qty}</p>
                </div>
                <span>AED {item.price * item.qty}</span>
              </div>
            ))}
            <div className="checkout-totals">
              <div className="summary-row"><span>Subtotal</span><span>AED {cartTotal}</span></div>
              <div className="summary-row"><span>Service Fee</span><span>AED {Math.round(cartTotal * 0.05)}</span></div>
              <div className="summary-total-row"><span>Total</span><span>AED {total}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConfirmationPage = () => {
  const navigate = useNavigate();
  const [bookingId] = useState('TKT-' + Math.random().toString(36).substr(2, 8).toUpperCase());

  return (
    <div className="page-wrapper confirmation-page">
      <div className="container">
        <div className="confirmation-card">
          <div className="confirmation-icon">🎉</div>
          <h1>Booking Confirmed!</h1>
          <p className="confirmation-sub">Your tickets have been booked successfully!</p>

          <div className="qr-section">
            <div className="qr-code">
              <div className="qr-inner">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="qr-row">
                    {[...Array(6)].map((_, j) => (
                      <div key={j} className={`qr-cell ${Math.random() > 0.5 ? 'filled' : ''}`} />
                    ))}
                  </div>
                ))}
              </div>
              <p>Scan for Entry</p>
            </div>
            <div className="ticket-details">
              <div className="ticket-detail-row">
                <span>Booking ID</span>
                <strong>{bookingId}</strong>
              </div>
              <div className="ticket-detail-row">
                <span>Status</span>
                <span className="badge badge-green">Confirmed</span>
              </div>
              <div className="ticket-detail-row">
                <span>Delivery</span>
                <span>📧 Sent to email</span>
              </div>
            </div>
          </div>

          <div className="confirmation-actions">
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              View My Bookings
            </button>
            <button className="btn btn-dark" onClick={() => navigate('/events')}>
              Browse More Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};