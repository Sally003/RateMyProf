import React from 'react';

export default function ThreeDTile({ 
  children, 
  variant = 'default', // 'default' | 'indigo' | 'gold' | 'glass'
  hover = true, 
  className = '',
  onClick,
  ...props 
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'indigo':
        return 'tile-indigo text-white';
      case 'gold':
        return 'tile-gold text-slate-900';
      case 'glass':
        return 'glass-panel text-slate-900 rounded-2xl shadow-lg border border-white/60';
      default:
        return 'tile-3d text-slate-900';
    }
  };

  const hoverStyle = hover ? 'tile-3d-hover cursor-pointer' : '';

  return (
    <div 
      className={`${getVariantStyles()} ${hoverStyle} p-6 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
