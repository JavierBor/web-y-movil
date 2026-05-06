import React from 'react';
import './MainCard.css';

interface MainCardProps {
  children: React.ReactNode;
  maxWidth?: string; // Permitimos que el tamaño sea flexible
  title?: string;
}

const MainCard: React.FC<MainCardProps> = ({ children, maxWidth = "800px", title }) => {
  return (
    <div className="main-card-container" style={{ maxWidth: maxWidth }}>
      {title && <h2 className="main-card-title">{title}</h2>}
      <div className="main-card-content">
        {children}
      </div>
    </div>
  );
};

export default MainCard;