import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-title">
        <span role="img" aria-label="robot">🤖</span> 나만의 AI 비서
      </div>
      <div className="header-actions">
        <button className="header-button">프로필</button>
        <button className="header-button">자료</button>
        <button className="header-button">대화 삭제</button>
      </div>
    </header>
  );
};

export default Header;