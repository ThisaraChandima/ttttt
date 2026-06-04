'use client';

import { Star } from 'lucide-react';
import './StarRating.css';

export default function StarRating({ rating = 0, maxStars = 5, size = 18, interactive = false, onChange }) {
  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  return (
    <div className={`star-rating ${interactive ? 'star-rating-interactive' : ''}`}>
      {Array.from({ length: maxStars }, (_, i) => {
        const value = i + 1;
        const filled = value <= Math.round(rating);
        return (
          <button
            key={i}
            type="button"
            className={`star-btn ${filled ? 'star-filled' : 'star-empty'}`}
            onClick={() => handleClick(value)}
            disabled={!interactive}
            aria-label={`${value} star${value > 1 ? 's' : ''}`}
          >
            <Star size={size} fill={filled ? 'currentColor' : 'none'} />
          </button>
        );
      })}
      {!interactive && rating > 0 && (
        <span className="star-rating-value">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
