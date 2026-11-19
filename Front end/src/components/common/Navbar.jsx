import { useAuth } from '../../context/AuthContext';

export default function Navbar({
  activeTab = 'landing',
  setActiveTab = () => {},
  factoryView = 'dashboard',
  setFactoryView = () => {},
  isLanding = false,
}) {
  const { user, isAuthenticated, logout } = useAuth();

  const handleBrandClick = () => {
    if (!isAuthenticated) {
      setActiveTab('landing');
    } else {
      setFactoryView('dashboard');
    }
  };

  // Navbar is always white across the entire platform (Landing, Login, Register, and User Factory Portal)
  const isWhiteNavbar = true;

  return (
    <div
      className={`navbar-wrapper ${isLanding ? 'landing-navbar-wrapper' : ''} ${
        isAuthenticated ? 'portal-navbar-wrapper' : ''
      } ${isWhiteNavbar ? 'white-navbar-wrapper' : ''}`}
    >
      <header className={`navbar ${isWhiteNavbar ? 'landing-navbar-white' : ''}`}>
        <div className="brand" onClick={handleBrandClick} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-container" title="مركز تحديث الصناعة - IMC">
            <img
              src="/imc-logo-transparent.png"
              alt="شعار مركز تحديث الصناعة - IMC"
              className="brand-logo-img"
            />
          </div>
          <div className="brand-divider"></div>
          <div className="brand-platform-text">
            <span className="brand-platform-title">منصة تحديات الصناعة</span>
          </div>
        </div>

        {isAuthenticated && user ? (
          <div className="navbar-user-actions">
            <div className="navbar-nav-group">
              {/* خيار 1: الملف التعريفي */}
              <button
                type="button"
                className={`navbar-nav-pill ${factoryView === 'dashboard' ? 'active' : ''}`}
                onClick={() => setFactoryView('dashboard')}
                title="الملف التعريفي للمنشأة الصناعية"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>الملف التعريفي</span>
              </button>

              {/* خيار 2: تسجيل تحدٍ صناعي جديد */}
              <button
                type="button"
                className={`navbar-nav-pill ${factoryView === 'new-request' ? 'active' : ''}`}
                onClick={() => setFactoryView('new-request')}
                title="تسجيل طلب أو تحدٍ صناعي جديد"
              >
                <span style={{ fontSize: '1.15rem', fontWeight: 800, marginLeft: '2px', lineHeight: 1 }}>+</span>
                <span>تسجيل تحدٍ صناعي جديد</span>
              </button>
            </div>

            {/* Logout Button: Yellow by default, Red on hover */}
            <button
              onClick={logout}
              className="navbar-logout-btn"
              title="تسجيل الخروج من المنظومة"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: 'scaleX(-1)' }}
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
              <span>تسجيل الخروج</span>
            </button>
          </div>
        ) : (
          <div className="landing-auth-buttons">
            <button
              type="button"
              className={`landing-btn-outline ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              className={`landing-btn-solid ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => setActiveTab('register')}
            >
              إنشاء حساب
            </button>
          </div>
        )}
      </header>
    </div>
  );
}
