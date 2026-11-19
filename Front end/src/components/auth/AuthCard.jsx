import { useState } from 'react';
import Login from './Login';
import Register from './Register';

export default function AuthCard({ activeTab: externalTab, setActiveTab: setExternalTab }) {
  const [internalTab, setInternalTab] = useState('login');
  
  const activeTab = externalTab !== undefined ? externalTab : internalTab;
  const setActiveTab = setExternalTab !== undefined ? setExternalTab : setInternalTab;

  return (
    <div className={`auth-wrapper ${activeTab === 'register' ? 'wide' : ''}`}>
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">
            {activeTab === 'login'
              ? 'تسجيل الدخول'
              : 'تسجيل منشأة صناعية جديدة'}
          </h1>
          <p className="auth-subtitle">
            {activeTab === 'login'
              ? 'أدخل بيانات الحساب المعتمدة للوصول إلى لوحة متابعة المنشأة والخدمات'
              : 'انشئ حسابا لتسجل التحدي الصناعي اللي تواجهه في منشاتك'}
          </p>
        </div>

        <div className="auth-body">
          {activeTab === 'login' ? (
            <Login onSwitchToRegister={() => setActiveTab('register')} />
          ) : (
            <Register onSwitchToLogin={() => setActiveTab('login')} />
          )}
        </div>
      </div>
    </div>
  );
}
