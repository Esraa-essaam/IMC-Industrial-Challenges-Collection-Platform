import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Alert from '../common/Alert';

export default function Login({ onSwitchToRegister }) {
  const { login, loading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('صيغة البريد الإلكتروني غير صحيحة.');
      return;
    }

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول. يرجى التحقق من صحة بيانات الاعتماد.');
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Alert type="danger" message={error} />

      <div className="form-group">
        <label className="form-label" htmlFor="login-email">
          البريد الإلكتروني المسجل <span className="required">*</span>
        </label>
        <div className="input-container">
          <span className="input-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </span>
          <input
            id="login-email"
            type="email"
            name="email"
            className="form-input"
            placeholder="factory@company.com"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            dir="ltr"
            style={{ textAlign: 'right' }}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="login-password">
          كلمة المرور <span className="required">*</span>
        </label>
        <div className="input-container">
          <span className="input-icon">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            className="form-input"
            placeholder="••••••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            dir="ltr"
            style={{ textAlign: 'right' }}
          />
          <button
            type="button"
            className="input-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
            aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
          >
            {showPassword ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" x2="22" y1="2" y2="22" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div style={{ marginTop: '18px' }}>
        <button
          type="submit"
          className="btn btn-primary btn-block btn-login-submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              جاري تسجيل الدخول...
            </>
          ) : (
            <>
              تسجيل الدخول
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ transform: 'scaleX(-1)' }}
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </>
          )}
        </button>
      </div>

      <div
        style={{
          marginTop: '16px',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--neutral-600)',
          fontFamily: 'var(--font-headline)',
        }}
      >
        ليس لديك منشأة مسجلة؟{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--yellow-700)',
            fontWeight: 800,
            cursor: 'pointer',
            padding: 0,
            textDecoration: 'underline',
            fontFamily: 'var(--font-headline)',
          }}
        >
          انشاء حساب
        </button>
      </div>
    </form>
  );
}
