import { Target, Users, Award, Heart } from 'lucide-react';
import './about.css';

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <h1 className="about-hero-title">About TuitionRate</h1>
          <p className="about-hero-subtitle">
            Empowering students to make informed decisions about their education through
            honest, transparent tuition reviews and ratings.
          </p>
        </div>
      </div>

      <section className="container section">
        <div className="about-mission glass-card">
          <div className="about-mission-content">
            <h2>Our Mission</h2>
            <p>
              TuitionRate was born from a simple idea: every student deserves access to quality education,
              and every parent deserves reliable information to make the best choice for their children.
              We bridge the gap between tuition providers and learners by creating a transparent platform
              for honest reviews and ratings.
            </p>
            <p>
              Founded in 2025, we&apos;ve grown to become Sri Lanka&apos;s most trusted tuition rating platform,
              helping thousands of students find the right tuition classes for their needs and goals.
            </p>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2 className="about-section-title">Why Choose TuitionRate?</h2>
        <div className="about-values stagger-children">
          <div className="about-value glass-card">
            <div className="about-value-icon"><Target size={28} /></div>
            <h3>Accurate Ratings</h3>
            <p>All reviews come from verified students who have actually attended the tuition classes.</p>
          </div>
          <div className="about-value glass-card">
            <div className="about-value-icon"><Users size={28} /></div>
            <h3>Community Driven</h3>
            <p>Our platform is powered by the student community, ensuring diverse and honest perspectives.</p>
          </div>
          <div className="about-value glass-card">
            <div className="about-value-icon"><Award size={28} /></div>
            <h3>Quality Assured</h3>
            <p>Featured tuitions undergo thorough verification to ensure they meet our quality standards.</p>
          </div>
          <div className="about-value glass-card">
            <div className="about-value-icon"><Heart size={28} /></div>
            <h3>Student First</h3>
            <p>Every feature we build is designed with students&apos; best interests at heart.</p>
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="about-stats-bar glass-card">
          <div className="about-stat-item">
            <span className="about-stat-number">10+</span>
            <span className="about-stat-label">Tuition Centers</span>
          </div>
          <div className="about-stat-item">
            <span className="about-stat-number">500+</span>
            <span className="about-stat-label">Active Students</span>
          </div>
          <div className="about-stat-item">
            <span className="about-stat-number">20+</span>
            <span className="about-stat-label">Verified Reviews</span>
          </div>
          <div className="about-stat-item">
            <span className="about-stat-number">8</span>
            <span className="about-stat-label">Categories</span>
          </div>
        </div>
      </section>
    </div>
  );
}
