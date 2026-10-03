import React from 'react';
import { User } from 'lucide-react';

/**
 * ProfessorAvatar Component
 * Renders an authentic profile photo if available, or a clean, 
 * professional initials monogram tile if no photo exists.
 */
export default function ProfessorAvatar({ name, profileUrl, size = 'md', className = '' }) {
  // Check if image is a known generic placeholder stock photo
  const isGenericPlaceholder = !profileUrl || 
    profileUrl.includes('unsplash.com') || 
    profileUrl.includes('placeholder') || 
    profileUrl.trim() === '';

  // Calculate initials (e.g. "Abhiram Ranade" -> "AR")
  const getInitials = (fullName) => {
    if (!fullName) return 'P';
    const parts = fullName.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const dimensions = {
    sm: 'w-10 h-10 text-xs rounded-xl',
    md: 'w-14 h-14 text-sm rounded-2xl',
    lg: 'w-20 h-20 md:w-24 md:h-24 text-xl rounded-2xl'
  }[size] || 'w-14 h-14 text-sm rounded-2xl';

  if (!isGenericPlaceholder) {
    return (
      <img
        src={profileUrl}
        alt={name}
        className={`${dimensions} object-cover shadow-md border-2 border-indigo-100 ${className}`}
        onError={(e) => {
          // Fallback to initial monogram on image load error
          e.target.style.display = 'none';
        }}
      />
    );
  }

  // Blank / Genuine Initials Monogram Tile
  return (
    <div className={`${dimensions} bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-amber-400 font-display font-extrabold flex items-center justify-center shadow-md border-2 border-indigo-500/30 shrink-0 ${className}`}>
      <span>{getInitials(name)}</span>
    </div>
  );
}
