'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import './categories.css';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [tuitions, setTuitions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const [catRes, tutRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/tuitions'),
      ]);
      const catData = await catRes.json();
      const tutData = await tutRes.json();
      setCategories(catData.categories || []);
      setTuitions(tutData.tuitions || []);
    }
    fetchData();
  }, []);

  const icons = {
    'calculator': '📐', 'flask-conical': '🔬', 'book-open': '📖', 'monitor': '💻',
    'trending-up': '📊', 'languages': '🌍', 'music': '🎵', 'dumbbell': '🏋️'
  };

  return (
    <div className="categories-page">
      <div className="categories-hero">
        <div className="container">
          <h1 className="categories-hero-title">Tuition Categories</h1>
          <p className="categories-hero-subtitle">Browse tuition classes by subject area and find your perfect match</p>
        </div>
      </div>

      <div className="container section">
        <div className="cat-grid stagger-children">
          {categories.map(cat => {
            const count = tuitions.filter(t => t.categoryId === cat.id).length;
            return (
              <Link key={cat.id} href={`/tuitions?category=${cat.id}`} className="cat-card glass-card">
                <div className="cat-card-header" style={{ background: `linear-gradient(135deg, ${cat.color}22 0%, transparent 100%)` }}>
                  <span className="cat-card-icon">{icons[cat.icon] || '📚'}</span>
                  <span className="cat-card-count" style={{ color: cat.color }}>{count} classes</span>
                </div>
                <div className="cat-card-body">
                  <h2 className="cat-card-name">{cat.name}</h2>
                  <p className="cat-card-desc">{cat.description}</p>
                  <span className="cat-card-link" style={{ color: cat.color }}>
                    Browse Classes <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
