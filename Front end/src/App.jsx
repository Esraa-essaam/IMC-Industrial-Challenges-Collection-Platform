import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import AuthCard from './components/auth/AuthCard';
import LandingPage from './components/landing/LandingPage';
import FactoryDashboard from './components/dashboard/FactoryDashboard';
import ProblemSubmissionForm from './components/challenges/ProblemSubmissionForm';
import RequestsHistory from './components/challenges/RequestsHistory';
import AdminPortal from './components/admin/AdminPortal';

function MainApp() {
  const { isAuthenticated, initLoading, user } = useAuth();
  const [activeTab, setActiveTab] = useState('landing'); // 'landing' | 'login' | 'register'
  const [factoryView, setFactoryView] = useState('dashboard'); // 'dashboard' | 'new-request'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Loading Screen
  if (initLoading) {
    return (
      <div className="app-container">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="main-content">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div
              className="spinner"
              style={{
                width: '32px',
                height: '32px',
                borderColor: 'var(--neutral-300)',
                borderTopColor: 'var(--primary)',
                margin: '0 auto 12px',
              }}
            ></div>
            <p
              style={{
                fontFamily: 'var(--font-headline)',
                color: 'var(--neutral-600)',
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            >
              جاري تحميل منصة مركز تحديث الصناعة...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Admin Portal: Uses the dedicated Admin Sidebar layout!
  if (isAuthenticated && user?.role === 'admin') {
    return (
      <div className="app-layout">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="app-main-wrapper">
          <header className="mobile-topbar">
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="فتح القائمة الجانبية"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            <div className="mobile-topbar-brand">
              <div className="mobile-logo-badge">
                <img src="/imc-logo-transparent.png" alt="IMC" className="mobile-brand-logo" />
              </div>
              <span className="mobile-brand-title">بوابة المشرفين | IMC</span>
            </div>
          </header>

          <main className="main-content admin-main-content">
            <AdminPortal activeTab={activeTab} setActiveTab={setActiveTab} />
          </main>
        </div>
      </div>
    );
  }

  const isLanding = !isAuthenticated && activeTab === 'landing';

  // All other pages (Landing, Login, Register, Factory Portal): Use the top Navbar!
  return (
    <div className={`app-container ${isLanding ? 'landing-mode' : ''}`}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        factoryView={factoryView}
        setFactoryView={setFactoryView}
        isLanding={isLanding}
      />

      <main className={`main-content ${isLanding ? 'landing-main-content' : isAuthenticated ? 'portal-main-content' : ''}`}>
        {isAuthenticated ? (
          factoryView === 'new-request' ? (
            <div className="portal-subview-container">
              <ProblemSubmissionForm
                onCancel={() => setFactoryView('dashboard')}
                onSuccess={() => setFactoryView('dashboard')}
              />
            </div>
          ) : factoryView === 'history' ? (
            <div className="portal-subview-container">
              <RequestsHistory
                onOpenNewRequest={() => setFactoryView('new-request')}
              />
            </div>
          ) : (
            <FactoryDashboard
              onOpenNewRequest={() => setFactoryView('new-request')}
              onOpenHistory={() => setFactoryView('history')}
            />
          )
        ) : activeTab === 'landing' ? (
          <LandingPage onNavigateToAuth={(tab) => setActiveTab(tab)} />
        ) : (
          <div className="auth-view-wrapper">
            <div className="auth-back-toolbar">
              <button
                type="button"
                className="btn-back-landing"
                onClick={() => setActiveTab('landing')}
              >
                <span className="back-arrow" style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>➔</span>
                <span>العودة إلى الصفحة الرئيسية</span>
              </button>
            </div>
            <AuthCard activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
