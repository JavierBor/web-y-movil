import React from 'react';
import './PageLayout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="web-container">
      <div className="content-wrapper">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;