import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { requestsAPI } from '../../services/api';
import CustomSelect from '../common/CustomSelect';

export default function RequestsHistory({ onOpenNewRequest = () => {}, hideHeaderCard = false }) {
  const { token, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' | 'oldest'
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Load requests from PostgreSQL
  useEffect(() => {
    let isMounted = true;
    async function fetchRequests() {
      try {
        setLoading(true);
        setError(null);
        const res = await requestsAPI.getMyRequests(token);
        if (isMounted && res?.data) {
          setRequests(res.data);
        }
      } catch (err) {
        console.error('Failed to load user history requests:', err);
        // Fallback to local storage if available so user is not blocked
        try {
          const localBackup = JSON.parse(localStorage.getItem('imc_submitted_requests') || '[]');
          if (isMounted) {
            setRequests(localBackup);
          }
        } catch (_) {
          if (isMounted) setRequests([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (token) {
      fetchRequests();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Request Type Helpers
  const getRequestTypeMeta = (type) => {
    switch (type) {
      case 'challenge':
        return { label: 'تحدٍ فني وعطل', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' };
      case 'improve':
        return { label: 'تحسين كفاءة', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' };
      case 'idea':
        return { label: 'فكرة ابتكارية', color: '#D97706', bg: '#FEFCE8', border: '#FDE68A' };
      case 'localize':
        return { label: 'تعميق تصنيع محلي', color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' };
      case 'lab':
        return { label: 'فحص واختبار معملي', color: '#9333EA', bg: '#FAF5FF', border: '#E9D5FF' };
      default:
        return { label: 'طلب فني', color: '#0055A5', bg: '#F0F9FF', border: '#BAE6FD' };
    }
  };

  // Filtered and sorted requests
  const filteredRequests = useMemo(() => {
    return requests
      .filter((req) => {
        // Type filter
        if (selectedType !== 'all' && req.requestType !== selectedType) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const idMatch = req.requestId?.toLowerCase().includes(q);
          const areaMatch = req.reportedAreaLabel?.toLowerCase().includes(q);
          const symptomMatch = req.reportedSymptomLabel?.toLowerCase().includes(q);
          const subjectMatch = req.subjectName?.toLowerCase().includes(q);
          const descMatch = req.freeDescription?.toLowerCase().includes(q);
          if (!idMatch && !areaMatch && !symptomMatch && !subjectMatch && !descMatch) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.submittedAt || 0).getTime();
        const dateB = new Date(b.submittedAt || 0).getTime();
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
      });
  }, [requests, selectedType, searchQuery, sortOrder]);

  // Statistics (مؤشرات ودورة حياة التحديات الصناعية)
  const stats = useMemo(() => {
    const total = requests.length;

    // 1. تحديات لم يتم مراجعتها
    const pendingReview = requests.filter((r) => {
      const s = String(r.imcReviewStatus || r.status || '').toLowerCase();
      if (['resolved', 'completed', 'approved', 'closed', 'تم الحل', 'مكتمل'].includes(s)) return false;
      if (['underreview', 'under_review', 'in_review', 'قيد المراجعة', 'قيد_المراجعة'].includes(s)) return false;
      return true; // الافتراضي: لم يتم المراجعة بعد
    }).length;

    // 2. تحديات يتم مراجعتها
    const underReview = requests.filter((r) => {
      const s = String(r.imcReviewStatus || r.status || '').toLowerCase();
      return ['underreview', 'under_review', 'in_review', 'قيد المراجعة', 'قيد_المراجعة'].includes(s);
    }).length;

    // 3. تحديات تم حلها بالفعل
    const resolved = requests.filter((r) => {
      const s = String(r.imcReviewStatus || r.status || '').toLowerCase();
      return ['resolved', 'completed', 'approved', 'closed', 'تم الحل', 'مكتمل'].includes(s);
    }).length;

    return { total, pendingReview, underReview, resolved };
  }, [requests]);

  return (
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* 1. Header Card */}
      {!hideHeaderCard && (
        <div className="dashboard-card" style={{ margin: 0, padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div className="dashboard-logo-badge" title="سجل التحديات الصناعية للمنشأة">
                <img src="/imc-logo-transparent.png" alt="IMC Logo" className="dashboard-logo-img" />
              </div>

              <div>
                {user?.factoryName && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--neutral-500)', fontWeight: 600, marginBottom: '4px' }}>
                    {user.factoryName}
                  </div>
                )}

                <h1 style={{ fontFamily: 'var(--font-headline)', color: '#002B54', fontSize: '1.65rem', margin: '0 0 6px', fontWeight: 800 }}>
                  سجل التحديات الصناعية
                </h1>
                <p style={{ margin: 0, color: 'var(--neutral-600)', fontSize: '0.88rem' }}>
                  سجل رقمي متكامل لكافة التحديات الصناعية.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenNewRequest}
              className="navbar-nav-pill active"
              style={{
                padding: '10px 22px',
                fontSize: '0.92rem',
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(0, 85, 165, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>+</span>
              <span>تسجيل تحدٍ صناعي جديد</span>
            </button>
          </div>

          {/* Quick Metrics Bar (دورة حياة التحديات المطلوبة) */}
          <div
            style={{
              marginTop: '20px',
              paddingTop: '18px',
              borderTop: '1px solid #E2E8F0',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
            }}
          >
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px 16px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>إجمالي التحديات المسجلة</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#002B54' }}>{stats.total}</div>
            </div>

            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px' }}>
              <div style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 700 }}>تحديات لم يتم مراجعتها</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#DC2626' }}>{stats.pendingReview}</div>
            </div>

            <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '12px 16px' }}>
              <div style={{ fontSize: '0.75rem', color: '#0055A5', fontWeight: 700 }}>تحديات يتم مراجعتها</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0055A5' }}>{stats.underReview}</div>
            </div>

            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '12px 16px' }}>
              <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 700 }}>تحديات تم حلها بالفعل</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16A34A' }}>{stats.resolved}</div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Search, Filters & Controls */}
      <div className="dashboard-card" style={{ margin: 0, padding: '20px 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Box */}
          <div style={{ flex: '1 1 320px', position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94A3B8',
                fontSize: '0.9rem',
              }}
            >
              🔍
            </span>
            <input
              type="text"
              placeholder="ابحث برقم البلاغ، المجال المتأثر، العطل، أو الكلمات المفتاحية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingRight: '36px', fontSize: '0.88rem' }}
            />
          </div>

          {/* Sort Control */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '170px' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600, whiteSpace: 'nowrap' }}>الترتيب:</span>
            <CustomSelect
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ minWidth: '130px' }}
            >
              <option value="newest">الأحدث أولاً</option>
              <option value="oldest">الأقدم أولاً</option>
            </CustomSelect>
          </div>
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '16px',
            paddingTop: '14px',
            borderTop: '1px solid #F1F5F9',
          }}
        >
          {[
            { id: 'all', label: 'جميع البلاغات' },
            { id: 'challenge', label: 'تحديات وأعطال فنية' },
            { id: 'improve', label: 'تحسين كفاءة إنتاجية' },
            { id: 'idea', label: 'أفكار ابتكارية' },
            { id: 'localize', label: 'تعميق التصنيع المحلي' },
            { id: 'lab', label: 'فحص واختبار معملي' },
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelectedType(type.id)}
              style={{
                background: selectedType === type.id ? '#0055A5' : '#F8FAFC',
                color: selectedType === type.id ? '#FFFFFF' : '#475569',
                border: `1.5px solid ${selectedType === type.id ? '#0055A5' : '#E2E8F0'}`,
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: selectedType === type.id ? 800 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Requests List */}
      <div className="dashboard-card" style={{ margin: 0, padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '1.15rem',
              color: '#002B54',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ width: '4px', height: '18px', background: '#FDB813', borderRadius: '2px' }} />
            سجل التحديات الصناعية ({filteredRequests.length})
          </h3>

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{ background: 'none', border: 'none', color: '#0055A5', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
            >
              إلغاء البحث ✕
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
            <div className="spinner" style={{ margin: '0 auto 12px', width: '28px', height: '28px' }} />
            <p style={{ margin: 0, fontSize: '0.9rem' }}>جاري تحميل سجل التحديات الصناعية من قاعدة البيانات...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#DC2626', background: '#FEF2F2', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontWeight: 700 }}>{error}</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '48px 20px',
              background: '#F8FAFC',
              borderRadius: '12px',
              border: '1.5px dashed #CBD5E1',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>📋</div>
            <h4 style={{ margin: '0 0 6px', color: '#002B54', fontFamily: 'var(--font-headline)', fontSize: '1.1rem' }}>
              لا توجد بلاغات أو تحديات مطابقة
            </h4>
            <p style={{ margin: '0 0 16px', color: '#64748B', fontSize: '0.88rem' }}>
              {searchQuery || selectedType !== 'all'
                ? 'لم نجد أي طلبات تطابق معايير البحث أو التصفية المختارة.'
                : 'لم تقم بتسجيل أي تحدٍ أو بلاغ صناعي حتى الآن.'}
            </p>
            <button
              type="button"
              onClick={onOpenNewRequest}
              className="navbar-nav-pill active"
              style={{ padding: '8px 20px', fontSize: '0.88rem' }}
            >
              + تسجيل تحدٍ صناعي جديد
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredRequests.map((req) => {
              const badge = getRequestTypeMeta(req.requestType);
              const formattedDate = req.submittedAt
                ? new Date(req.submittedAt).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'تاريخ غير مسجل';

              return (
                <div
                  key={req.requestId}
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '20px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  }}
                >
                  {/* Card Top Row: ID, Badges, Date */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          background: '#F1F5F9',
                          borderRadius: '6px',
                          fontFamily: 'var(--font-headline)',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          color: '#002B54',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {req.requestId}
                      </span>

                      <span
                        style={{
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: '4px',
                        }}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                        🕒 {formattedDate}
                      </span>
                      {(() => {
                        const s = String(req.imcReviewStatus || req.status || '').toLowerCase();
                        if (['resolved', 'completed', 'approved', 'closed', 'تم الحل', 'مكتمل'].includes(s)) {
                          return (
                            <span
                              style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                background: '#F0FDF4',
                                color: '#16A34A',
                                border: '1px solid #BBF7D0',
                              }}
                            >
                              ✓ تم حل التحدي
                            </span>
                          );
                        }
                        if (['underreview', 'under_review', 'in_review', 'قيد المراجعة', 'قيد_المراجعة'].includes(s)) {
                          return (
                            <span
                              style={{
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                background: '#EFF6FF',
                                color: '#0055A5',
                                border: '1px solid #BFDBFE',
                              }}
                            >
                              ⏳ يتم مراجعته حالياً
                            </span>
                          );
                        }
                        return (
                          <span
                            style={{
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              background: '#FEF2F2',
                              color: '#DC2626',
                              border: '1px solid #FECACA',
                            }}
                          >
                            • لم يتم مراجعته بعد
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div>
                    <h4
                      style={{
                        margin: '0 0 6px',
                        fontSize: '1.05rem',
                        color: '#002B54',
                        fontFamily: 'var(--font-headline)',
                        fontWeight: 800,
                      }}
                    >
                      {req.reportedAreaLabel || req.subjectName || req.labTestAreaLabel || 'طلب دعم فني وتحدٍ صناعي'}
                      {req.reportedSymptomLabel && ` - ${req.reportedSymptomLabel}`}
                    </h4>

                    {req.freeDescription && (
                      <p
                        style={{
                          margin: '0 0 10px',
                          fontSize: '0.88rem',
                          color: '#475569',
                          lineHeight: 1.6,
                          maxHeight: '3.2em',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {req.freeDescription}
                      </p>
                    )}

                    {/* Metadata Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.78rem' }}>
                      {req.metricValue && (
                        <span style={{ background: '#EFF6FF', color: '#1E40AF', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          📊 القياس: {req.metricValue} {req.metricUnit} {req.metricTypeLabel ? `(${req.metricTypeLabel})` : ''}
                        </span>
                      )}

                      {req.frequencyLabel && (
                        <span style={{ background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', padding: '3px 8px', borderRadius: '4px' }}>
                          وتيرة الحدوث: {req.frequencyLabel}
                        </span>
                      )}

                      {req.affectedScopeLabel && (
                        <span style={{ background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', padding: '3px 8px', borderRadius: '4px' }}>
                          نطاق التأثير: {req.affectedScopeLabel}
                        </span>
                      )}

                      {req.desiredOutcomeLabel && (
                        <span style={{ background: '#F0FDF4', color: '#166534', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          المخرج المرجو: {req.desiredOutcomeLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Action */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedRequest(req)}
                      className="btn-back-landing"
                      style={{ padding: '6px 16px', fontSize: '0.82rem', fontWeight: 700 }}
                    >
                      عرض التفاصيل الكاملة للبلاغ ➔
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Full Details Modal */}
      {selectedRequest && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            backdropFilter: 'blur(3px)',
          }}
          onClick={() => setSelectedRequest(null)}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '28px 32px',
              position: 'relative',
              boxShadow: '0 25px 35px -5px rgba(0, 0, 0, 0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                borderBottom: '1px solid #E2E8F0',
                paddingBottom: '14px',
              }}
            >
              <div>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>
                  بطاقة البلاغ الفني المعتمدة
                </span>
                <h3
                  style={{
                    margin: '2px 0 0',
                    color: '#002B54',
                    fontFamily: 'var(--font-headline)',
                    fontSize: '1.35rem',
                    fontWeight: 800,
                  }}
                >
                  {selectedRequest.requestId}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                style={{
                  background: '#F1F5F9',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: '8px' }}>
                <strong>نوع الطلب:</strong>
                <span style={{ fontWeight: 800, color: getRequestTypeMeta(selectedRequest.requestType).color }}>
                  {getRequestTypeMeta(selectedRequest.requestType).label}
                </span>
              </div>

              {selectedRequest.reportedAreaLabel && (
                <div>
                  <strong>المجال / النظام المتأثر:</strong> {selectedRequest.reportedAreaLabel}
                </div>
              )}

              {selectedRequest.reportedSymptomLabel && (
                <div>
                  <strong>مظهر العطل أو الهدف:</strong> {selectedRequest.reportedSymptomLabel}
                </div>
              )}

              {selectedRequest.symptomDetail && (
                <div>
                  <strong>التفصيل الدقيق:</strong> {selectedRequest.symptomDetail}
                </div>
              )}

              {selectedRequest.subjectName && (
                <div>
                  <strong>اسم المكوّن أو الفكرة:</strong> {selectedRequest.subjectName}
                </div>
              )}

              {selectedRequest.freeDescription && (
                <div>
                  <strong>الوصف الفني التفصيلي:</strong>
                  <p
                    style={{
                      margin: '6px 0 0',
                      color: '#334155',
                      background: '#F8FAFC',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      lineHeight: 1.7,
                    }}
                  >
                    {selectedRequest.freeDescription}
                  </p>
                </div>
              )}

              {selectedRequest.metricValue && (
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '10px 14px', borderRadius: '8px', color: '#1E40AF' }}>
                  <strong>القياس والمؤشر الرقمي:</strong> {selectedRequest.metricValue} {selectedRequest.metricUnit} {selectedRequest.metricTypeLabel ? `(${selectedRequest.metricTypeLabel})` : ''}
                </div>
              )}

              {selectedRequest.frequencyLabel && (
                <div>
                  <strong>وتيرة الحدوث:</strong> {selectedRequest.frequencyLabel}
                </div>
              )}

              {selectedRequest.affectedScopeLabel && (
                <div>
                  <strong>نطاق التأثير الإنتاجي:</strong> {selectedRequest.affectedScopeLabel}
                </div>
              )}

              {Array.isArray(selectedRequest.impactLabels) && selectedRequest.impactLabels.length > 0 && (
                <div>
                  <strong>الآثار الفنية المترتبة:</strong> {selectedRequest.impactLabels.join('، ')}
                </div>
              )}

              {Array.isArray(selectedRequest.expectedBenefitLabels) && selectedRequest.expectedBenefitLabels.length > 0 && (
                <div>
                  <strong>المزايا والفوائد المتوقعة:</strong> {selectedRequest.expectedBenefitLabels.join('، ')}
                </div>
              )}

              {selectedRequest.desiredOutcomeLabel && (
                <div>
                  <strong>المخرج المرجو من مركز تحديث الصناعة (IMC):</strong> {selectedRequest.desiredOutcomeLabel}
                </div>
              )}

              <div style={{ fontSize: '0.82rem', color: '#64748B', paddingTop: '10px', borderTop: '1px solid #E2E8F0' }}>
                تاريخ التسجيل الرسمي: {new Date(selectedRequest.submittedAt).toLocaleString('ar-EG')}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ marginTop: '24px', textAlign: 'left', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="btn-back-landing"
                style={{ padding: '8px 22px', fontSize: '0.88rem' }}
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

