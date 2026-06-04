'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import TuitionCard from '@/components/TuitionCard';
import StarRating from '@/components/StarRating';
import './tuitions.css';

function TuitionsContent() {
  const searchParams = useSearchParams();
  const [tuitions, setTuitions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    minRating: searchParams.get('minRating') || '0',
    sort: searchParams.get('sort') || 'rating',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTuitions();
  }, [filters]);

  async function fetchCategories() {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data.categories || []);
  }

  async function fetchTuitions() {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.category) params.set('category', filters.category);
    if (filters.minRating !== '0') params.set('minRating', filters.minRating);
    params.set('sort', filters.sort);

    const res = await fetch(`/api/tuitions?${params.toString()}`);
    const data = await res.json();
    setTuitions(data.tuitions || []);
    setLoading(false);
  }

  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c]));

  return (
    <div className="tuitions-page">
      <div className="tuitions-header">
        <div className="container">
          <h1 className="tuitions-page-title">Browse Tuition Classes</h1>
          <p className="tuitions-page-subtitle">Discover and compare the best tuition centers across Sri Lanka</p>
        </div>
      </div>

      <div className="container tuitions-layout">
        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="filter-search">
            <Search size={18} className="filter-search-icon" />
            <input
              type="text"
              placeholder="Search tuitions..."
              value={filters.q}
              onChange={(e) => setFilters(f => ({ ...f, q: e.target.value }))}
              className="form-input filter-search-input"
            />
          </div>

          <button className="btn btn-secondary filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal size={16} />
            Filters
          </button>

          <select
            value={filters.sort}
            onChange={(e) => setFilters(f => ({ ...f, sort: e.target.value }))}
            className="form-input form-select filter-sort"
          >
            <option value="rating">Highest Rated</option>
            <option value="reviews">Most Reviews</option>
            <option value="newest">Newest First</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="filters-panel glass-card animate-fade-in-up">
            <div className="filters-grid">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(f => ({ ...f, category: e.target.value }))}
                  className="form-input form-select"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Minimum Rating</label>
                <div className="filter-rating-options">
                  {[0, 3, 3.5, 4, 4.5].map(r => (
                    <button
                      key={r}
                      className={`filter-rating-btn ${filters.minRating === String(r) ? 'active' : ''}`}
                      onClick={() => setFilters(f => ({ ...f, minRating: String(r) }))}
                    >
                      {r === 0 ? 'Any' : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {(filters.category || filters.minRating !== '0') && (
              <button
                className="btn btn-ghost filter-clear"
                onClick={() => setFilters(f => ({ ...f, category: '', minRating: '0' }))}
              >
                <X size={14} /> Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Results */}
        <div className="tuitions-results">
          <p className="tuitions-count">
            {loading ? 'Loading...' : `${tuitions.length} tuition${tuitions.length !== 1 ? 's' : ''} found`}
          </p>

          {loading ? (
            <div className="tuitions-loading">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          ) : tuitions.length === 0 ? (
            <div className="tuitions-empty">
              <p>No tuitions found matching your criteria.</p>
              <button className="btn btn-secondary" onClick={() => setFilters({ q: '', category: '', minRating: '0', sort: 'rating' })}>
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="tuitions-grid-page stagger-children">
              {tuitions.map(t => (
                <TuitionCard key={t.id} tuition={t} category={categoryMap[t.categoryId]} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TuitionsPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '4rem 0' }}>Loading...</div>}>
      <TuitionsContent />
    </Suspense>
  );
}
