import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-brand">
          <Link href="/" className="nav-logo" style={{ display: 'inline-flex' }}>
            <span className="nav-logo-si">ගයිඩ්</span>
            <div className="nav-logo-pill" style={{ padding: '.22rem .85rem' }}>
              <span className="nav-logo-text" style={{ fontSize: '1.3rem' }}>GU<span className="ir">I</span>DE</span>
            </div>
          </Link>
          <p>Sri Lanka&apos;s most trusted platform for finding and rating tuition teachers — from O/L to A/L and beyond.</p>
        </div>
        <div className="footer-col">
          <h5>Explore</h5>
          <Link href="/tuitions">Browse Tutors</Link>
          <Link href="/categories">Subjects</Link>
          <Link href="/tuitions?sort=rating">Top Rated</Link>
        </div>
        <div className="footer-col">
          <h5>Community</h5>
          <Link href="/register">Write a Review</Link>
          <Link href="/register">Add a Tutor</Link>
          <Link href="/about">About Us</Link>
        </div>
        <div className="footer-col">
          <h5>Info</h5>
          <Link href="/contact">Contact</Link>
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Guide · Sri Lanka</span>
        <span>Built for students, by students 🎓</span>
      </div>
    </footer>
  );
}
