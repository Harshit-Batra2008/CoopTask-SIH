import React, { useState } from 'react';
import { Star } from 'lucide-react';

export function StarRating({ rating = 0, maxStars = 5, size = 'md', interactive = false, onChange }) {
  const [hover, setHover] = useState(0);
  const displayRating = hover || rating;

  return (
    <div className={`ct-stars ct-stars-${size}`} role={interactive ? 'radiogroup' : 'img'} aria-label={`Rating: ${rating} of ${maxStars}`}>
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= displayRating;
        return (
          <span
            key={i}
            className={`ct-star ${filled ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            onClick={interactive ? () => onChange?.(starValue) : undefined}
            onMouseEnter={interactive ? () => setHover(starValue) : undefined}
            onMouseLeave={interactive ? () => setHover(0) : undefined}
            role={interactive ? 'radio' : undefined}
            aria-checked={interactive ? starValue === rating : undefined}
            aria-label={interactive ? `${starValue} star${starValue > 1 ? 's' : ''}` : undefined}
          >
            <Star size={size === 'sm' ? 14 : size === 'lg' ? 24 : 18} fill={filled ? 'currentColor' : 'none'} />
          </span>
        );
      })}
    </div>
  );
}
