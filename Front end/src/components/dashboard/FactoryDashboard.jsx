import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { requestsAPI } from '../../services/api';
import RequestsHistory from '../challenges/RequestsHistory';

export default function FactoryDashboard({
  onOpenNewRequest = () => {},
  onOpenHistory = () => {},
}) {
  const { user, token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const status = user?.accountStatus || 'pending';
  const statusLabel =
    status === 'approved'
      ? 'معتمد ونشط'
      : status === 'rejected'
      ? 'مرفوض'
      : 'قيد المراجعة والاعتماد';

  const roleLabel =
    user?.role === 'admin' ? 'مسؤول المنصة' : 'منشأة صناعية مسجلة';

  // Load user's submitted requests from PostgreSQL
  useEffect(() => {
    let isMounted = true;
    async function loadRequests() {
      try {
        const res = await requestsAPI.getMyRequests(token);
        if (isMounted && res?.data) {
          setRequests(res.data);
        }
      } catch (err) {
        console.error('Failed to load requests:', err);
      }
    }

    if (token) {
      loadRequests();
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  return (
    <div className="factory-portal-page">
      {/* 1. Factory Profile Hero Header (Modern Expansive Cover Layout) */}
      <div className="profile-cover-card">
        {/* Full-width Top Banner */}
        <div className="profile-cover-banner">
          <div className="profile-banner-mesh"></div>
          <div className="profile-banner-glow"></div>
          
          <div className="profile-banner-topbar">
            {/* Status Badge */}
            <span className={`status-badge ${status}`} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: 'currentColor',
                }}
              ></span>
              حالة الحساب: {statusLabel}
            </span>

            {/* Official IMC Logo Watermark */}
            <div style={{ opacity: 0.95, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }}>
              <img
                src="/imc-logo-transparent.png"
                alt="IMC"
                style={{ height: '36px', width: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </div>

        {/* Profile Card Body with Overlapping Factory Avatar */}
        <div className="profile-cover-body">
          {/* Avatar Row */}
          <div className="profile-avatar-row">
            <div className="profile-factory-avatar" title="منشأة صناعية معتمدة">
              {/* Industrial Factory Icon */}
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#002B54"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 21h18" />
                <path d="M19 21v-8l-4 2V9l-4 2V4l-6 3.5V21" />
                <path d="M9 17h1" />
                <path d="M14 17h1" />
              </svg>
            </div>
          </div>

          {/* Title, Meta & Action Button */}
          <div className="profile-title-section">
            <div>
              <h1 className="profile-factory-title">
                {user?.factoryName || 'المنشأة الصناعية'}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginTop: '4px' }}>
                <div className="profile-factory-email">
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
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <span dir="ltr">{user?.contactInfo?.email || 'لا يوجد بريد مسجل'}</span>
                </div>

                {user?.taxId && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '3px 10px',
                      background: '#F1F5F9',
                      borderRadius: '6px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#002B54',
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect width="18" height="18" x="3" y="3" rx="2" />
                      <path d="M7 7h10" />
                      <path d="M7 12h10" />
                    </svg>
                    <span>سجل: {user.taxId}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Action Button: سجل التحديات الصناعية */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setShowHistory((prev) => {
                    const nextState = !prev;
                    if (nextState) {
                      setTimeout(() => {
                        const el = document.getElementById('factory-history-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }
                    return nextState;
                  });
                }}
                className={`profile-action-btn-primary ${showHistory ? 'active' : ''}`}
                title="عرض سجل التحديات الصناعية للمنشأة"
              >
                <span>سجل التحديات الصناعية</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    marginRight: '2px',
                    transform: showHistory ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease',
                    display: 'inline-block',
                  }}
                >
                  ▼
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section (Metrics & Details Aligned Grid) */}
      <div className="factory-portal-content">
        {/* 2. Full-Width Metrics Showcase (مؤشرات المنشأة الصناعية عبر كامل الصفحة) */}
        <div className="factory-metrics-grid">
        {/* Metric 1: Total Challenges */}
        <div className="factory-metric-card">
          <div className="factory-metric-icon-wrap" style={{ background: '#EFF6FF', color: '#0055A5' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect width="8" height="4" x="8" y="2" rx="1" />
              <path d="M9 12h6" />
              <path d="M9 16h6" />
            </svg>
          </div>
          <div className="factory-metric-content">
            <span className="factory-metric-value">{requests.length}</span>
            <span className="factory-metric-title">إجمالي التحديات المسجلة</span>
            <span className="factory-metric-subtext">كافة البلاغات والطلبات للمنشأة</span>
          </div>
        </div>

        {/* Metric 2: Under Review */}
        <div className="factory-metric-card">
          <div className="factory-metric-icon-wrap" style={{ background: '#FFFBEB', color: '#D97706' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
              <path d="M11 8v3l2 2" />
            </svg>
          </div>
          <div className="factory-metric-content">
            <span className="factory-metric-value" style={{ color: '#D97706' }}>
              {requests.filter(r => r.status === 'under_review' || r.status === 'pending').length}
            </span>
            <span className="factory-metric-title">قيد الدراسة والتحليل</span>
            <span className="factory-metric-subtext">جارٍ فحصها بمعرفة فريق IMC</span>
          </div>
        </div>

        {/* Metric 3: Solved / Completed */}
        <div className="factory-metric-card">
          <div className="factory-metric-icon-wrap" style={{ background: '#F0FDF4', color: '#16A34A' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className="factory-metric-content">
            <span className="factory-metric-value" style={{ color: '#16A34A' }}>
              {requests.filter(r => r.status === 'resolved' || r.status === 'approved').length}
            </span>
            <span className="factory-metric-title">حلول مكتملة ومعالجة</span>
            <span className="factory-metric-subtext">تم استيفاء الحلول والتوصيات</span>
          </div>
        </div>

        {/* Metric 4: Account Status */}
        <div className="factory-metric-card">
          <div className="factory-metric-icon-wrap" style={{ background: '#EEF2FF', color: '#002B54' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <div className="factory-metric-content">
            <span className="factory-metric-value" style={{ fontSize: '1.25rem', color: '#002B54' }}>
              {statusLabel}
            </span>
            <span className="factory-metric-title">حالة اعتماد المنشأة</span>
            <span className="factory-metric-subtext">سجل المنظومة الصناعية الموحدة</span>
          </div>
        </div>
      </div>

      {/* 3. Full-Width Facility Credentials Grid (بيانات المنشأة والاعتماد الرسمي) */}
      <div className="factory-details-section">
        <div className="factory-section-title">بيانات المنشأة والاعتماد الرسمي</div>
        <div className="factory-details-grid">
          {/* Item 1: السجل التجاري / الضريبي */}
          <div className="factory-detail-card">
            <div className="factory-detail-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 7h10" />
                <path d="M7 12h10" />
                <path d="M7 17h6" />
              </svg>
            </div>
            <div className="factory-detail-body">
              <span className="factory-detail-label">رقم السجل التجاري / البطاقة الضريبية</span>
              <span className="factory-detail-value">{user?.taxId || 'غير مسجل'}</span>
              <span className="factory-detail-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                موثق ومعتمد رسمياً بالمنصة
              </span>
            </div>
          </div>

          {/* Item 2: قنوات الاتصال والتواصل */}
          <div className="factory-detail-card">
            <div className="factory-detail-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <div className="factory-detail-body">
              <span className="factory-detail-label">هاتف التواصل المعتمد</span>
              <span className="factory-detail-value" dir="ltr" style={{ textAlign: 'right' }}>
                {user?.contactInfo?.phone || 'غير مسجل'}
              </span>
              <span className="factory-detail-tag">
                البريد: {user?.contactInfo?.email || '—'}
              </span>
            </div>
          </div>

          {/* Item 3: الموقع والمنطقة الصناعية */}
          <div className="factory-detail-card">
            <div className="factory-detail-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="factory-detail-body">
              <span className="factory-detail-label">المقر والنطاق الجغرافي</span>
              <span className="factory-detail-value">
                {[
                  user?.location?.industrialZone,
                  user?.location?.city,
                  user?.location?.governorate,
                ]
                  .filter(Boolean)
                  .join('، ') || 'جمهورية مصر العربية'}
              </span>
              <span className="factory-detail-tag">
                المنطقة الصناعية المعتمدة
              </span>
            </div>
          </div>
        </div>
      </div>

        {/* 4. Requests History Section (Search, Filters & List - Shown directly below profile on demand) */}
        {showHistory && (
          <div
            id="factory-history-section"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '22px',
              width: '100%',
            }}
          >
            <RequestsHistory
              hideHeaderCard={true}
              onOpenNewRequest={onOpenNewRequest}
            />
          </div>
        )}
      </div>
    </div>
  );
}
