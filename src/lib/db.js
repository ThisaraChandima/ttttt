import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'src', 'data');

function readJSON(filename) {
  const filePath = path.join(dataDir, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function writeJSON(filename, data) {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ── Tuitions ──────────────────────────────────────────────
export function getAllTuitions() {
  return readJSON('tuitions.json');
}

export function getTuitionById(id) {
  const tuitions = getAllTuitions();
  return tuitions.find(t => t.id === id) || null;
}

export function getTuitionBySlug(slug) {
  const tuitions = getAllTuitions();
  return tuitions.find(t => t.slug === slug) || null;
}

export function searchTuitions({ query = '', categoryId = '', minRating = 0, sort = 'rating' }) {
  let tuitions = getAllTuitions();

  if (query) {
    const q = query.toLowerCase();
    tuitions = tuitions.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q) ||
      t.subjects.some(s => s.toLowerCase().includes(q))
    );
  }

  if (categoryId) {
    tuitions = tuitions.filter(t => t.categoryId === categoryId);
  }

  if (minRating > 0) {
    tuitions = tuitions.filter(t => t.rating >= minRating);
  }

  switch (sort) {
    case 'rating':
      tuitions.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      tuitions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'name':
      tuitions.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'reviews':
      tuitions.sort((a, b) => b.totalReviews - a.totalReviews);
      break;
  }

  return tuitions;
}

export function createTuition(data) {
  const tuitions = getAllTuitions();
  const newTuition = {
    id: `tut-${Date.now()}`,
    slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    rating: 0,
    totalReviews: 0,
    featured: false,
    verified: false,
    createdAt: new Date().toISOString(),
    ...data,
  };
  tuitions.push(newTuition);
  writeJSON('tuitions.json', tuitions);
  return newTuition;
}

export function updateTuition(id, data) {
  const tuitions = getAllTuitions();
  const index = tuitions.findIndex(t => t.id === id);
  if (index === -1) return null;
  tuitions[index] = { ...tuitions[index], ...data };
  writeJSON('tuitions.json', tuitions);
  return tuitions[index];
}

export function deleteTuition(id) {
  let tuitions = getAllTuitions();
  const filtered = tuitions.filter(t => t.id !== id);
  if (filtered.length === tuitions.length) return false;
  writeJSON('tuitions.json', filtered);
  return true;
}

// ── Reviews ───────────────────────────────────────────────
export function getAllReviews() {
  return readJSON('reviews.json');
}

export function getReviewsByTuition(tuitionId) {
  return getAllReviews().filter(r => r.tuitionId === tuitionId && r.status === 'approved');
}

export function getReviewsByUser(userId) {
  return getAllReviews().filter(r => r.userId === userId);
}

export function createReview(data) {
  const reviews = getAllReviews();
  const newReview = {
    id: `rev-${Date.now()}`,
    status: 'approved',
    createdAt: new Date().toISOString(),
    ...data,
  };
  reviews.push(newReview);
  writeJSON('reviews.json', reviews);

  // Update tuition rating
  const tuitionReviews = reviews.filter(r => r.tuitionId === data.tuitionId && r.status === 'approved');
  const avgRating = tuitionReviews.reduce((sum, r) => sum + r.rating, 0) / tuitionReviews.length;
  updateTuition(data.tuitionId, {
    rating: Math.round(avgRating * 10) / 10,
    totalReviews: tuitionReviews.length,
  });

  return newReview;
}

export function updateReview(id, data) {
  const reviews = getAllReviews();
  const index = reviews.findIndex(r => r.id === id);
  if (index === -1) return null;
  reviews[index] = { ...reviews[index], ...data };
  writeJSON('reviews.json', reviews);
  return reviews[index];
}

export function deleteReview(id) {
  let reviews = getAllReviews();
  const review = reviews.find(r => r.id === id);
  if (!review) return false;
  const filtered = reviews.filter(r => r.id !== id);
  writeJSON('reviews.json', filtered);

  // Recalculate tuition rating
  const tuitionReviews = filtered.filter(r => r.tuitionId === review.tuitionId && r.status === 'approved');
  if (tuitionReviews.length > 0) {
    const avgRating = tuitionReviews.reduce((sum, r) => sum + r.rating, 0) / tuitionReviews.length;
    updateTuition(review.tuitionId, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: tuitionReviews.length,
    });
  } else {
    updateTuition(review.tuitionId, { rating: 0, totalReviews: 0 });
  }

  return true;
}

// ── Users ─────────────────────────────────────────────────
export function getAllUsers() {
  return readJSON('users.json');
}

export function getUserById(id) {
  return getAllUsers().find(u => u.id === id) || null;
}

export function getUserByEmail(email) {
  return getAllUsers().find(u => u.email === email) || null;
}

export function createUser(data) {
  const users = getAllUsers();
  if (users.find(u => u.email === data.email)) {
    return { error: 'Email already registered' };
  }
  const newUser = {
    id: `user-${Date.now()}`,
    role: 'user',
    avatar: '/images/avatars/default.jpg',
    bio: '',
    createdAt: new Date().toISOString(),
    ...data,
  };
  users.push(newUser);
  writeJSON('users.json', users);
  return newUser;
}

export function updateUser(id, data) {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...data };
  writeJSON('users.json', users);
  return users[index];
}

export function deleteUser(id) {
  let users = getAllUsers();
  const filtered = users.filter(u => u.id !== id);
  if (filtered.length === users.length) return false;
  writeJSON('users.json', filtered);
  return true;
}

// ── Categories ────────────────────────────────────────────
export function getAllCategories() {
  return readJSON('categories.json');
}

export function getCategoryById(id) {
  return getAllCategories().find(c => c.id === id) || null;
}

export function createCategory(data) {
  const categories = getAllCategories();
  const newCategory = {
    id: `cat-${Date.now()}`,
    slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    ...data,
  };
  categories.push(newCategory);
  writeJSON('categories.json', categories);
  return newCategory;
}

export function updateCategory(id, data) {
  const categories = getAllCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return null;
  categories[index] = { ...categories[index], ...data };
  writeJSON('categories.json', categories);
  return categories[index];
}

export function deleteCategory(id) {
  let categories = getAllCategories();
  const filtered = categories.filter(c => c.id !== id);
  if (filtered.length === categories.length) return false;
  writeJSON('categories.json', filtered);
  return true;
}

// ── Settings ──────────────────────────────────────────────
export function getSettings() {
  return readJSON('settings.json');
}

export function updateSettings(data) {
  const settings = getSettings();
  const updated = { ...settings, ...data };
  writeJSON('settings.json', updated);
  return updated;
}

// ── Stats ─────────────────────────────────────────────────
export function getStats() {
  const tuitions = getAllTuitions();
  const reviews = getAllReviews();
  const users = getAllUsers();
  const categories = getAllCategories();

  const avgRating = tuitions.length > 0
    ? tuitions.reduce((sum, t) => sum + t.rating, 0) / tuitions.length
    : 0;

  return {
    totalTuitions: tuitions.length,
    totalReviews: reviews.length,
    totalUsers: users.length,
    totalCategories: categories.length,
    averageRating: Math.round(avgRating * 10) / 10,
    recentReviews: reviews
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5),
    topRatedTuitions: tuitions
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5),
  };
}
