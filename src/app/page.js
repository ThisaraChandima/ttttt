'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import TuitionCard from '@/components/TuitionCard';

// Utility for animating numbers (used in stats band)
function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = performance.now();
    const update = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      setCount(ease * target);
      if (t < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }, [isVisible, target, duration]);

  return { count, ref };
}

export default function HomePage() {
  const [tuitions, setTuitions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const statsRef = useRef(null);
  
  // Parallax for hero orb
  const [orbPos, setOrbPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchData();
    
    // Intersection Observer for scroll reveal animations
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    
    setTimeout(() => {
      document.querySelectorAll('.reveal, .reveal-scale').forEach(el => io.observe(el));
    }, 100);

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setOrbPos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      io.disconnect();
    };
  }, []);

  async function fetchData() {
    try {
      const [tuitionsRes, categoriesRes] = await Promise.all([
        fetch('/api/tuitions?sort=rating'),
        fetch('/api/categories'),
      ]);
      const tuitionsData = await tuitionsRes.json();
      const categoriesData = await categoriesRes.json();
      setTuitions(tuitionsData.tuitions || []);
      setCategories(categoriesData.categories || []);
    } catch (e) {
      console.error(e);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/tuitions?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  }

  const topRated = tuitions.slice(0, 4);
  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c]));
  
  const totalTuitions = tuitions.length > 0 ? tuitions.length : 12400;
  const totalReviews = tuitions.length > 0 ? tuitions.reduce((sum, t) => sum + t.totalReviews, 0) : 89;

  return (
    <>
      {/* ════════════════ HERO ════════════════ */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-chip">Sri Lanka&apos;s #1 Tuition Directory</div>
          <h1 className="hero-welcome">ආයුබෝවන්!</h1>
          <div className="hero-accent-bar"></div>
          <span className="hero-tagline">FIND · RATE · TRUST YOUR TUTOR</span>
          <p className="hero-subtitle">
            ශ්‍රී ලංකාවේ හොඳම ගුරුවරුන් සොයා ගන්න — real student reviews කියවා,
            ඔබේ ගුරුවරයා rate කරන්න. නිවැරදිව, නිදහසේ.
          </p>
          <div className="hero-actions">
            <Link href="/tuitions" className="btn-fill">🔍 ගුරුවරයෙකු සොයන්න</Link>
            <Link href="/register" className="btn-outline">⭐ Rate කරන්න</Link>
          </div>
          <div className="hero-stats">
            <div>
              <div className="stat-num">{totalTuitions}+</div>
              <div className="stat-lbl">Tutors Listed</div>
            </div>
            <div>
              <div className="stat-num">{totalReviews >= 1000 ? Math.floor(totalReviews/1000) + 'K+' : totalReviews + '+'}</div>
              <div className="stat-lbl">Reviews</div>
            </div>
            <div>
              <div className="stat-num">4.8★</div>
              <div className="stat-lbl">Avg Rating</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div 
            className="hero-orb" 
            style={{ transform: `translate(calc(-50% + ${orbPos.x}px), calc(-50% + ${orbPos.y}px))` }}
          ></div>

          <div className="fcard fcard-a">
            <div className="fcard-avatar">🧑‍🏫</div>
            <div className="fcard-name">Mr. Karunathilaka</div>
            <div className="fcard-sub">A/L Combined Maths</div>
            <div className="fcard-stars">★★★★★ <span>4.9 (312 reviews)</span></div>
            <div className="fcard-pill">📍 Colombo 07</div>
          </div>

          <div className="fcard fcard-b">
            <div className="fcard-avatar" style={{ background: 'linear-gradient(135deg,#d4f0e8,#40b080)' }}>👩‍🏫</div>
            <div className="fcard-name">Ms. Fathima Riyaz</div>
            <div className="fcard-sub">O/L Science &amp; Maths</div>
            <div className="fcard-stars">★★★★★ <span>4.8 (198)</span></div>
            <div className="fcard-verified">✓ Verified Tutor</div>
          </div>

          <div className="fcard fcard-c">
            <div style={{ fontSize: '.7rem', color: 'var(--gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: '.55rem' }}>Latest Review</div>
            <p style={{ fontSize: '.86rem', color: 'rgba(255,255,255,.88)', lineHeight: 1.6 }}>&quot;Excellent teacher — my son improved from C to A in just 3 months!&quot;</p>
            <div style={{ fontSize: '.72rem', color: 'rgba(240,160,32,.6)', marginTop: '.6rem' }}>— Nimal P., O/L Student</div>
          </div>
        </div>
      </section>

      {/* ════════════════ SEARCH ════════════════ */}
      <div className="search-wrap-outer reveal">
        <form className="search-inner" onSubmit={handleSearch}>
          <input 
            className="search-field" 
            type="text" 
            placeholder="ගුරු නම, විෂය, හෝ ප්‍රදේශය සොයන්න…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="search-sep"></div>
          <select className="search-sel">
            <option>All Subjects</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          <div className="search-sep"></div>
          <select className="search-sel">
            <option>All Areas</option>
            <option>Colombo</option>
            <option>Kandy</option>
            <option>Galle</option>
            <option>Negombo</option>
          </select>
          <button type="submit" className="search-go">Search →</button>
        </form>
      </div>

      {/* ════════════════ SUBJECTS ════════════════ */}
      <section className="subjects-bg" id="subjects">
        <div className="section-wrap">
          <div className="section-head reveal">
            <div>
              <div className="section-eyebrow">Explore</div>
              <h2 className="section-title">Browse by Subject</h2>
            </div>
            <Link href="/categories" className="section-all">View all</Link>
          </div>
          <div className="subjects-grid">
            {categories.length > 0 ? categories.map((cat, i) => (
              <Link key={cat.id} href={`/tuitions?category=${cat.id}`} className={`subj-card reveal-scale stagger-${(i % 4) + 1}`}>
                <span className="subj-icon">{['📐','⚛️','🧪','🧬','🇬🇧','📊','🏛️','🖥️','🎨','🎵'][i % 10]}</span>
                <div className="subj-name">{cat.name}</div>
                <div className="subj-count">{tuitions.filter(t => t.categoryId === cat.id).length} classes</div>
              </Link>
            )) : (
              <div className="subj-card reveal-scale stagger-1"><div className="subj-name">Loading subjects...</div></div>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════ TOP TUTORS ════════════════ */}
      <section id="tutors">
        <div className="section-wrap">
          <div className="section-head reveal">
            <div>
              <div className="section-eyebrow">Community Picks</div>
              <h2 className="section-title">Top-Rated Tutors</h2>
            </div>
            <Link href="/tuitions?sort=rating" className="section-all">Browse all</Link>
          </div>
          <div className="tutors-grid">
            {topRated.length > 0 ? topRated.map((t, i) => (
              <div key={t.id} className={`reveal-scale stagger-${(i % 4) + 1}`} style={{height: '100%'}}>
                <TuitionCard tuition={t} category={categoryMap[t.categoryId]} />
              </div>
            )) : (
              <div className="reveal-scale stagger-1">Loading tutors...</div>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════ HOW IT WORKS ════════════════ */}
      <section className="how-bg" id="how-it-works">
        <div className="section-wrap" style={{ textAlign: 'center' }}>
          <div className="reveal">
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Simple &amp; Clear</div>
            <h2 className="section-title">How Guide Works</h2>
          </div>
          <div className="steps-row">
            <div className="step-card reveal stagger-1">
              <div className="step-num-wrap">1</div>
              <div className="step-title">Search &amp; Discover</div>
              <p className="step-desc">Search by subject, location, or price to find tutors that perfectly match your needs.</p>
            </div>
            <div className="step-card reveal stagger-2">
              <div className="step-num-wrap">2</div>
              <div className="step-title">Read Real Reviews</div>
              <p className="step-desc">Browse honest student and parent reviews before making your decision.</p>
            </div>
            <div className="step-card reveal stagger-3">
              <div className="step-num-wrap">3</div>
              <div className="step-title">Rate &amp; Share</div>
              <p className="step-desc">Attended a class? Share your experience and help others in the community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ STATS BAND ════════════════ */}
      <div className="stats-band reveal" ref={statsRef}>
        <div className="stats-inner">
          <div>
            <div className="band-stat-num">{Math.round(totalTuitions)}+</div>
            <div className="band-stat-lbl">Tutors Listed</div>
          </div>
          <div>
            <div className="band-stat-num">{Math.round(totalReviews)}K+</div>
            <div className="band-stat-lbl">Reviews Written</div>
          </div>
          <div>
            <div className="band-stat-num">25</div>
            <div className="band-stat-lbl">Districts Covered</div>
          </div>
          <div>
            <div className="band-stat-num">4.8★</div>
            <div className="band-stat-lbl">Average Rating</div>
          </div>
        </div>
      </div>

      {/* ════════════════ REVIEWS ════════════════ */}
      <section id="reviews">
        <div className="section-wrap">
          <div className="section-head reveal">
            <div>
              <div className="section-eyebrow">What Students Say</div>
              <h2 className="section-title">Recent Reviews</h2>
            </div>
            <Link href="/tuitions" className="section-all">All reviews</Link>
          </div>
          <div className="reviews-grid">

            <div className="review-card reveal-scale stagger-1">
              <div className="rv-head">
                <div className="rv-ava">👦</div>
                <div>
                  <div className="rv-name">Ashan Perera</div>
                  <div className="rv-meta">A/L Student · Mr. Karunathilaka</div>
                </div>
              </div>
              <div className="rv-stars">★★★★★</div>
              <p className="rv-body">&quot;Best Combined Maths teacher in Colombo. Explains every concept clearly and gives lots of past papers. Scored A at A/Ls thanks to him!&quot;</p>
            </div>

            <div className="review-card reveal-scale stagger-2">
              <div className="rv-head">
                <div className="rv-ava" style={{ background: 'linear-gradient(135deg,#fce4b0,#c88010)' }}>👧</div>
                <div>
                  <div className="rv-name">Shalini Fernando</div>
                  <div className="rv-meta">Parent · Ms. Fathima Riyaz</div>
                </div>
              </div>
              <div className="rv-stars">★★★★★</div>
              <p className="rv-body">&quot;My daughter&apos;s Science grade went from C3 to A1 within 5 months. Very patient and dedicated teacher. Highly recommend for O/L students.&quot;</p>
            </div>

            <div className="review-card reveal-scale stagger-3">
              <div className="rv-head">
                <div className="rv-ava" style={{ background: 'linear-gradient(135deg,#d4e8fc,#5090d0)' }}>🧑</div>
                <div>
                  <div className="rv-name">Ruvini Jayawardena</div>
                  <div className="rv-meta">A/L Student · Mr. Pradeep Silva</div>
                </div>
              </div>
              <div className="rv-stars">★★★★☆</div>
              <p className="rv-body">&quot;Good Physics teacher with very clear explanations. Group classes can be crowded sometimes but the teaching quality is consistently great.&quot;</p>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════ CTA ════════════════ */}
      <section className="cta-section">
        <div className="cta-inner reveal">
          <h2 className="cta-title">ගුරුවරයෙකු ද?</h2>
          <span className="cta-en">LIST ON GUIDE FOR FREE</span>
          <p className="cta-desc">Join thousands of tutors already on Guide and grow your student base through genuine, community-driven reviews across Sri Lanka.</p>
          <div className="cta-actions">
            <Link href="/register" className="btn-brown">Tutor ලෙස Register කරන්න</Link>
            <Link href="/about" className="btn-stroke">Learn More</Link>
          </div>
        </div>
      </section>
    </>
  );
}
