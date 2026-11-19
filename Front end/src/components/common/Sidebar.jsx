import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({
  activeTab = 'dashboard',
  setActiveTab = () => {},
  isOpen = false,
  onClose = () => {},
}) {
  const { user, logout } = useAuth();
  const [activeItem, setActiveItem] = useState(
    activeTab === 'validation' ? 'validation' : 'dashboard'
  );

  useEffect(() => {
    if (activeTab === 'validation') {
      setActiveItem('validation');
    } else {
      setActiveItem('dashboard');
    }
  }, [activeTab]);

  const handleNavClick = (key) => {
    setActiveItem(key);
    setActiveTab(key);
    if (onClose) onClose();
  };

  const handleLogout = () => {
    if (onClose) onClose();
    logout();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`app-sidebar rail-sidebar ${isOpen ? 'open' : ''}`}>
        {/* IMC Brand Mark (Clean mini badge - Traffic dots removed) */}
        <div className="rail-top-section">
          <div className="rail-brand-mark" title="مركز تحديث الصناعة - IMC">
            <img
              src="/imc-logo-transparent.png"
              alt="IMC"
              className="rail-brand-logo"
            />
          </div>
        </div>

        {/* Vertical Divider */}
        <div className="rail-divider" />

        {/* Primary Navigation Rail Icons */}
        <nav className="rail-nav-container">
          {/* 1. Dashboard (لوحة التحكم الرئيسية) */}
          <button
            type="button"
            className={`rail-nav-btn ${activeItem === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavClick('dashboard')}
            aria-label="لوحة التحكم (Dashboard)"
          >
            {activeItem === 'dashboard' && <span className="rail-active-indicator" />}
            <div className="rail-icon-wrapper">
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <span className="rail-tooltip">لوحة التحكم (Dashboard)</span>
          </button>

          {/* 2. User Validation (اعتماد وتدقيق المستخدمين والمنشآت) */}
          <button
            type="button"
            className={`rail-nav-btn ${activeItem === 'validation' ? 'active' : ''}`}
            onClick={() => handleNavClick('validation')}
            aria-label="تدقيق واعتماد المستخدمين (User Validation)"
          >
            {activeItem === 'validation' && <span className="rail-active-indicator" />}
            <div className="rail-icon-wrapper">
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <polyline points="16 11 18 13 22 9" />
              </svg>
            </div>
            <span className="rail-tooltip">تدقيق واعتماد المستخدمين (User Validation)</span>
          </button>
        </nav>

        {/* Bottom Section: User Avatar & Logout */}
        <div className="rail-bottom-section">
          {/* Logout Button */}
          <button
            type="button"
            className="rail-nav-btn rail-logout-btn"
            onClick={handleLogout}
            aria-label="تسجيل الخروج"
          >
            <div className="rail-icon-wrapper">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: 'scaleX(-1)' }}
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
            </div>
            <span className="rail-tooltip logout-tooltip">تسجيل الخروج</span>
          </button>

          {/* User Profile Avatar with Online Status */}
          <div
            className="rail-user-avatar"
            title={`${user?.name || 'مسؤول النظام'} (IMC Admin)`}
          >
            <div className="rail-avatar-ring">
              <span className="rail-avatar-initials">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AD'}
              </span>
            </div>
            <span className="rail-online-dot" />
            <span className="rail-tooltip">
              {user?.name || 'مسؤول النظام'}
              <span className="rail-tooltip-sub">مسؤول مركز تحديث الصناعة</span>
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
