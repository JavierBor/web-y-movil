import React from 'react';
import './MainCard.css';

interface MainCardProps {
  children: React.ReactNode;
  maxWidth?: string;
  title?: string;
  fullHeight?: boolean; // Nueva prop para controlar el estiramiento
}

const MainCard: React.FC<MainCardProps> = ({ 
  children, 
  maxWidth = "800px", 
  title,
  fullHeight = false // Por defecto no se estira
}) => {
  return (
    <div 
      className={`main-card-container ${fullHeight ? 'full-height' : ''}`} 
      style={{ maxWidth: maxWidth }}
    >
      {title && <h2 className="main-card-title">{title}</h2>}
      
      <div className="main-card-content">
        {children}
      </div>
    </div>
  );
}

export default MainCard;