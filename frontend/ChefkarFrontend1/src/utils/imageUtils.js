/**
 * ✅ FIXED: Image Utility Functions
 * Handles all image URL scenarios: Cloudinary, local, external, missing
 */

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80';
const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80';

export const normalizeImageUrl = (imageUrl, fallback = null) => {
  if (!imageUrl || imageUrl === 'undefined' || imageUrl === 'null') {
    return fallback || FALLBACK_IMAGE;
  }
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  if (imageUrl.startsWith('//')) {
    return `https:${imageUrl}`;
  }
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }
  if (!imageUrl.includes('://')) {
    return `/${imageUrl}`;
  }
  return imageUrl;
};

export const getImageUrl = (item, fallback = null) => {
  if (!item) return fallback || FALLBACK_IMAGE;
  const imageUrl =
    item.image ||
    item.url ||
    item.profilepic ||
    item.profileimage ||
    item.photo ||
    item.picture ||
    item.thumbnail ||
    item.avatar;
  return normalizeImageUrl(imageUrl, fallback);
};

export const getAvatarUrl = (item, fallback = null) => {
  if (!item) return fallback || FALLBACK_AVATAR;
  const imageUrl =
    item.profilepic ||
    item.profileimage ||
    item.avatar ||
    item.photo ||
    item.image;
  return normalizeImageUrl(imageUrl, fallback || FALLBACK_AVATAR);
};

export const handleImageError = (event, fallback = null) => {
  const fallbackUrl = fallback || FALLBACK_IMAGE;
  if (event.target.src !== fallbackUrl) {
    event.target.src = fallbackUrl;
    event.target.onerror = null; // Prevent infinite loop
  }
};

export const handleAvatarError = (event) => {
  if (event.target.src !== FALLBACK_AVATAR) {
    event.target.src = FALLBACK_AVATAR;
    event.target.onerror = null;
  }
};

export const isValidImageUrl = (url) => {
  if (!url) return false;
  if (url.startsWith('data:image/')) return true;
  if (url.startsWith('http://') || url.startsWith('https://')) return true;
  if (url.startsWith('/')) return true;
  return false;
};
