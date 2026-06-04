'use client';

import { useState } from 'react';
import { Send, MapPin, Phone, Mail, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/components/Toast';
import './contact.css';

const faqs = [
  { q: 'How do I submit a review?', a: 'First, create a free account or log in. Then, navigate to the tuition page you want to review and scroll down to the "Write a Review" section. Select your rating, add a title, write your review, and submit.' },
  { q: 'Are the reviews genuine?', a: 'Yes! All reviews come from registered users. Our moderation team reviews submissions to ensure quality and authenticity. We have a zero-tolerance policy for fake reviews.' },
  { q: 'How do I list my tuition center?', a: 'Currently, tuition centers are added by our admin team. Please contact us using the form on this page with your tuition details, and we\'ll get your center listed within 48 hours.' },
  { q: 'Can I edit or delete my review?', a: 'You can contact our support team to request edits or deletion of your review. We\'re working on adding self-service review management in a future update.' },
  { q: 'Is TuitionRate free to use?', a: 'Absolutely! TuitionRate is completely free for students and parents. There are no hidden fees or premium tiers. We believe everyone deserves access to quality education information.' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [openFaq, setOpenFaq] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    // Simulate form submission
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSubmitting(false);
  }

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="container">
          <h1 className="contact-hero-title">Contact Us</h1>
          <p className="contact-hero-subtitle">Have a question or feedback? We&apos;d love to hear from you.</p>
        </div>
      </div>

      <div className="container section">
        <div className="contact-grid">
          {/* Contact Form */}
          <div className="contact-form-card glass-card">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Your Name</label>
                  <input id="contact-name" type="text" className="form-input" placeholder="John Doe" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Email Address</label>
                  <input id="contact-email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-subject">Subject</label>
                <input id="contact-subject" type="text" className="form-input" placeholder="How can we help?" value={form.subject} onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Message</label>
                <textarea id="contact-message" className="form-input form-textarea" placeholder="Tell us more..." value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} required></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                <Send size={16} />
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Info + FAQ */}
          <div className="contact-info-side">
            <div className="contact-info-card glass-card">
              <h3>Get in Touch</h3>
              <div className="contact-info-list">
                <div className="contact-info-item">
                  <MapPin size={18} />
                  <div>
                    <span className="contact-info-label">Address</span>
                    <span className="contact-info-value">No. 42, Galle Road, Colombo 03, Sri Lanka</span>
                  </div>
                </div>
                <div className="contact-info-item">
                  <Phone size={18} />
                  <div>
                    <span className="contact-info-label">Phone</span>
                    <span className="contact-info-value">+94 11 234 5678</span>
                  </div>
                </div>
                <div className="contact-info-item">
                  <Mail size={18} />
                  <div>
                    <span className="contact-info-label">Email</span>
                    <span className="contact-info-value">support@tuitionrate.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="faq-card glass-card">
              <h3>Frequently Asked Questions</h3>
              <div className="faq-list">
                {faqs.map((faq, i) => (
                  <div key={i} className={`faq-item ${openFaq === i ? 'faq-open' : ''}`}>
                    <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      <span>{faq.q}</span>
                      {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {openFaq === i && (
                      <div className="faq-answer animate-fade-in">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
