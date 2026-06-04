import Link from 'next/link';

// Simple helper to pick a banner style deterministically based on string
const getBannerStyle = (str) => {
  const sum = str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const type = (sum % 4) + 1;
  return `tc-b${type}`;
};

export default function TuitionCard({ tuition, category }) {
  const categoryName = category?.name || 'General';
  const bannerStyle = getBannerStyle(tuition.id || tuition.name);

  // Parse fees to look nice or use as is
  let priceText = tuition.fees;
  let priceSuffix = '';
  if (priceText.includes('/')) {
    const parts = priceText.split('/');
    priceText = parts[0];
    priceSuffix = ' /' + parts[1];
  }

  // Generate some stars based on rating
  const fullStars = Math.floor(tuition.rating);
  const stars = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);

  return (
    <Link href={`/tuitions/${tuition.id}`} className="tutor-card" style={{ textDecoration: 'none', display: 'block' }}>
      <div className={`tc-banner ${bannerStyle}`}>
        <div className="tc-banner-line"></div>
        <div className="tc-ava">🧑‍🏫</div>
      </div>
      <div className="tc-body">
        <div className="tc-name">{tuition.name}</div>
        <div className="tc-sub">{categoryName} · {tuition.location}</div>
        <div className="tc-tags">
          <span className="tc-tag">{categoryName}</span>
          {tuition.verified && <span className="tc-tag">Verified</span>}
          {tuition.featured && <span className="tc-tag">Featured</span>}
        </div>
        <div className="tc-footer">
          <div className="tc-stars">
            <strong>{tuition.rating.toFixed(1)}</strong> {stars} ({tuition.totalReviews})
          </div>
          <div className="tc-price">
            {priceText}<span>{priceSuffix}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
