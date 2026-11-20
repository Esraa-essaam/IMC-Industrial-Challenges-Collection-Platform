import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import Alert from '../common/Alert';

export default function AdminPortal({ activeTab = 'dashboard', setActiveTab = () => {} }) {
  const { user, token, logout } = useAuth();

  const [factories, setFactories] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState(''); // '' | 'pending' | 'approved' | 'rejected'
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState({ type: '', text: '' });
  const [previewImage, setPreviewImage] = useState(null);

  // Synchronize sidebar activeTab with internal filter
  useEffect(() => {
    if (activeTab === 'checker') {
      setActiveFilter('pending');
    } else if (activeTab === 'facilities') {
      setActiveFilter('');
    }
  }, [activeTab]);

  // Dedicated Factory Verification Page State
  const [selectedFactoryForCheck, setSelectedFactoryForCheck] = useState(null);
  const [auditNotes, setAuditNotes] = useState('');
  const [checklist, setChecklist] = useState({
    taxIdValid: true,
    locationVerified: true,
    activityMatching: true,
    contactConfirmed: true,
  });

  // Fetch facilities and statistics
  const fetchData = useCallback(async () => {
    if (user?.role !== 'admin') return;
    try {
      setLoading(true);
      const [factoriesRes, statsRes] = await Promise.all([
        adminAPI.getFactories(token, activeFilter, searchQuery),
        adminAPI.getStats(token),
      ]);

      if (factoriesRes.success) {
        setFactories(factoriesRes.factories || []);
      }
      if (statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
      }
    } catch (err) {
      setToastMessage({
        type: 'danger',
        text: err.message || 'حدث خطأ أثناء تحميل بيانات المنشآت الصناعية.',
      });
    } finally {
      setLoading(false);
    }
  }, [token, activeFilter, searchQuery, user?.role]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Security Guard: Only Admins can access this portal
  if (user?.role !== 'admin') {
    return (
      <div className="auth-card" style={{ maxWidth: '500px', margin: '40px auto', textAlign: 'center', padding: '32px' }}>
        <div style={{ color: 'var(--danger)', fontSize: '2rem', marginBottom: '12px' }}>⚠️</div>
        <h2 style={{ color: 'var(--primary)', marginBottom: '8px' }}>غير مصرح بالدخول</h2>
        <p style={{ color: 'var(--neutral-600)', marginBottom: '20px' }}>
          هذه الصفحة مخصصة فقط لمديري ومسؤولي مركز تحديث الصناعة (IMC Admin).
        </p>
        <button onClick={logout} className="btn btn-primary">
          تسجيل الخروج والعودة
        </button>
      </div>
    );
  }

  // Handle live search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  // Authorize / Change Status of a Facility
  const handleUpdateStatus = async (factoryId, newStatus, notes = '') => {
    try {
      setActionLoadingId(factoryId);
      const res = await adminAPI.updateFactoryStatus(factoryId, newStatus, token, notes);

      if (res.success && res.factory) {
        // Update local state smoothly
        setFactories((prev) =>
          prev.map((f) => (f._id === factoryId ? { ...f, accountStatus: newStatus, auditNotes: notes } : f))
        );

        // If inspecting currently, update inspection object
        if (selectedFactoryForCheck && selectedFactoryForCheck._id === factoryId) {
          setSelectedFactoryForCheck((prev) => ({ ...prev, accountStatus: newStatus, auditNotes: notes }));
        }

        // Update stats
        const statsRes = await adminAPI.getStats(token);
        if (statsRes.success) setStats(statsRes.stats);

        const statusLabel =
          newStatus === 'approved'
            ? 'تم اعتماد وتوثيق المنشأة وتفعيل الحساب رسمياً'
            : newStatus === 'rejected'
            ? 'تم رفض طلب المنشأة'
            : 'تمت إعادة حالة الحساب إلى قيد المراجعة';

        setToastMessage({
          type: 'success',
          text: `${statusLabel}: ${res.factory.factoryName}`,
        });

        setTimeout(() => setToastMessage({ type: '', text: '' }), 5000);
      }
    } catch (err) {
      setToastMessage({
        type: 'danger',
        text: err.message || 'فشل تحديث حالة المنشأة.',
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // Open Inspection / Check Page
  const handleOpenCheckPage = (factory) => {
    setSelectedFactoryForCheck(factory);
    setAuditNotes(factory.auditNotes || '');
    setChecklist({
      taxIdValid: true,
      locationVerified: true,
      activityMatching: true,
      contactConfirmed: true,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // =========================================================================
  // VIEW 1: DEDICATED FACTORY VERIFICATION & AUDIT PAGE (صفحة الفحص والتدقيق)
  // =========================================================================
  if (selectedFactoryForCheck) {
    const factory = selectedFactoryForCheck;
    const isPending = factory.accountStatus === 'pending';
    const isApproved = factory.accountStatus === 'approved';
    const isRejected = factory.accountStatus === 'rejected';

    return (
      <div style={{ width: '100%', maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Navigation & Header */}
        <div className="dashboard-card" style={{ margin: 0, padding: '24px 28px', borderRadius: '16px', border: '1.5px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => setSelectedFactoryForCheck(null)}
              className="btn-back-landing"
              style={{ padding: '8px 18px', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <span className="back-arrow" style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>➔</span>
              <span>العودة إلى سجل المنشآت</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className={`status-badge ${factory.accountStatus}`}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'currentColor' }}></span>
                حالة الحساب: {isApproved ? 'معتمد وموثق' : isRejected ? 'مرفوض' : 'قيد المراجعة والتدقيق'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: '#0055A5', background: '#eff6ff', padding: '2px 10px', borderRadius: '4px', fontWeight: 700 }}>
                  فحص وتدقيق موثوقية المنشأة
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--neutral-500)' }}>
                  تاريخ تقديم الطلب: {factory.createdAt ? new Date(factory.createdAt).toLocaleDateString('ar-EG') : 'غير مسجل'}
                </span>
              </div>

              <h1 style={{ fontFamily: 'var(--font-headline)', color: '#002B54', fontSize: '1.65rem', margin: '0 0 6px', fontWeight: 800 }}>
                {factory.factoryName}
              </h1>

              <p style={{ margin: 0, color: 'var(--neutral-600)', fontSize: '0.9rem' }}>
                مراجعة مطابقة السجلات، فحص صحة الرقم الضريبي ومستندات المنشأة للتحقق من الموثوقية والملاءمة قبل إنشاء وتفعيل الحساب.
              </p>
            </div>
          </div>
        </div>

        {toastMessage.text && <Alert type={toastMessage.type} message={toastMessage.text} />}

        {/* Section 1: Reliability & Trust Indicators (مؤشرات الموثوقية) */}
        <div className="dashboard-card" style={{ margin: 0, padding: '24px 28px' }}>
          <h3
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '1.15rem',
              color: '#002B54',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ width: '4px', height: '18px', background: '#FDB813', borderRadius: '2px' }} />
            1. الفحص الآلي لمطابقة بيانات المنشأة والموثوقية
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px' }}>
            {/* Card 1: Tax ID Check */}
            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--neutral-500)', fontWeight: 700 }}>السجل الضريبي / التجاري</span>
                <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  ✓ منسق وصالح
                </span>
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#002B54', letterSpacing: '0.5px' }}>
                {factory.taxId || 'غير مدخل'}
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                تم فحص صيغة السجل المكون من 9 أرقام ضريبية رسمية.
              </p>
            </div>

            {/* Card 2: Sector & Activity */}
            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--neutral-500)', fontWeight: 700 }}>القطاع والنشاط الصناعي</span>
                <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#1e40af', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  مؤهل لـ IMC
                </span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#002B54' }}>
                {factory.industrialSector || 'قطاع الصناعات الهندسية والمعدنية'}
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                ضمن القطاعات المستهدفة لبرامج تحسين الإنتاجية وتعميق التصنيع.
              </p>
            </div>

            {/* Card 3: Location */}
            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--neutral-500)', fontWeight: 700 }}>الموقع والمنطقة الصناعية</span>
                <span style={{ fontSize: '0.72rem', background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  منطقة معتمدة
                </span>
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#002B54' }}>
                {[factory.location?.industrialZone, factory.location?.city, factory.location?.governorate]
                  .filter(Boolean)
                  .join(' - ') || 'جمهورية مصر العربية'}
              </div>
              <p style={{ margin: '6px 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                موقع المصنع مسجل بنطاق المدن والمناطق الصناعية الرسمية.
              </p>
            </div>

            {/* Card 4: Contact */}
            <div style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--neutral-500)', fontWeight: 700 }}>بيانات الاتصال الرسمية</span>
                <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  مفعل
                </span>
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#002B54' }} dir="ltr">
                {factory.contactInfo?.email || 'لا يوجد بريد'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }} dir="ltr">
                {factory.contactInfo?.phone || 'لا يوجد هاتف'}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Official Document Preview (فحص المستند الضريبي) */}
        <div className="dashboard-card" style={{ margin: 0, padding: '24px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
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
              2. معاينة وفحص المستندات الرسمية الثلاثة للمنشأة
            </h3>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
              (البطاقة الضريبية، السجل التجاري، السجل الصناعي)
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            {/* 1. البطاقة الضريبية */}
            <div
              style={{
                background: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#002B54' }}>
                  1. البطاقة الضريبية
                </span>
                {factory.taxCardImage?.fileUrl ? (
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>✓ مرفقة</span>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>غير متوفرة</span>
                )}
              </div>
              {factory.taxCardImage?.fileUrl ? (
                <>
                  <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <img
                      src={factory.taxCardImage.fileUrl}
                      alt="البطاقة الضريبية"
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewImage(factory.taxCardImage.fileUrl)}
                    className="btn-back-landing"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', textAlign: 'center', justifyContent: 'center' }}
                  >
                    🔍 عرض بحجم كامل
                  </button>
                </>
              ) : (
                <div style={{ padding: '30px 10px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                  لا توجد صورة مرفقة
                </div>
              )}
            </div>

            {/* 2. السجل التجاري */}
            <div
              style={{
                background: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#002B54' }}>
                  2. السجل التجاري
                </span>
                {factory.commercialRegImage?.fileUrl ? (
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>✓ مرفق</span>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>غير متوفر</span>
                )}
              </div>
              {factory.commercialRegImage?.fileUrl ? (
                <>
                  <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <img
                      src={factory.commercialRegImage.fileUrl}
                      alt="السجل التجاري"
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewImage(factory.commercialRegImage.fileUrl)}
                    className="btn-back-landing"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', textAlign: 'center', justifyContent: 'center' }}
                  >
                    🔍 عرض بحجم كامل
                  </button>
                </>
              ) : (
                <div style={{ padding: '30px 10px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                  لا توجد صورة مرفقة
                </div>
              )}
            </div>

            {/* 3. السجل الصناعي */}
            <div
              style={{
                background: '#f8fafc',
                border: '1.5px solid #cbd5e1',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#002B54' }}>
                  3. السجل الصناعي
                </span>
                {factory.industrialRegImage?.fileUrl ? (
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>✓ مرفق</span>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>غير متوفر</span>
                )}
              </div>
              {factory.industrialRegImage?.fileUrl ? (
                <>
                  <div style={{ height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <img
                      src={factory.industrialRegImage.fileUrl}
                      alt="السجل الصناعي"
                      style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setPreviewImage(factory.industrialRegImage.fileUrl)}
                    className="btn-back-landing"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', textAlign: 'center', justifyContent: 'center' }}
                  >
                    🔍 عرض بحجم كامل
                  </button>
                </>
              ) : (
                <div style={{ padding: '30px 10px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                  لا توجد صورة مرفقة
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Auditor Verification Checklist & Decision */}
        <div className="dashboard-card" style={{ margin: 0, padding: '24px 28px' }}>
          <h3
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '1.15rem',
              color: '#002B54',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ width: '4px', height: '18px', background: '#FDB813', borderRadius: '2px' }} />
            3. معايير التدقيق الفني وقرار الاعتماد
          </h3>

          {/* Checklist */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', marginBottom: '20px' }}>
            {[
              { key: 'taxIdValid', label: 'صحة ومطابقة السجل التجاري / الرقم الضريبي' },
              { key: 'activityMatching', label: 'ملاءمة النشاط الصناعي لمعايير مركز تحديث الصناعة' },
              { key: 'locationVerified', label: 'التحقق من صحة المنطقة والموقع الجغرافي للمصنع' },
              { key: 'contactConfirmed', label: 'فاعلية وجدية بيانات التواصل مع المسؤول' },
            ].map((item) => (
              <label
                key={item.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: checklist[item.key] ? '#f0fdf4' : '#fff',
                  border: `1.5px solid ${checklist[item.key] ? '#86efac' : '#cbd5e1'}`,
                  borderRadius: '8px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: checklist[item.key] ? '#166534' : 'var(--neutral-700)',
                }}
              >
                <input
                  type="checkbox"
                  checked={checklist[item.key]}
                  onChange={(e) => setChecklist((prev) => ({ ...prev, [item.key]: e.target.checked }))}
                  style={{ width: '18px', height: '18px', accentColor: '#16a34a' }}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>

          {/* Audit Notes */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#1e293b', marginBottom: '6px' }}>
              ملاحظات مسؤول المراجعة والاعتماد الفني:
            </label>
            <textarea
              rows={3}
              value={auditNotes}
              onChange={(e) => setAuditNotes(e.target.value)}
              placeholder="اكتب أي ملاحظات داخلية حول موثوقية المنشأة أو نتائج التواصل الميداني معها..."
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Decision Action Buttons */}
          <div
            style={{
              paddingTop: '20px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div>
              {isApproved && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontWeight: 800 }}>
                  <span>✓</span>
                  <span>هذا الحساب موثق ومفعل حالياً ويمكنه تسجيل الطلبات والبلاغات.</span>
                </div>
              )}
              {isPending && (
                <span style={{ fontSize: '0.88rem', color: '#64748b' }}>
                  عند الضغط على قبول واعتماد، سيتم تفعيل حساب المصنع رسمياً ومنحه صلاحية الدخول.
                </span>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {isPending ? (
                <>
                  <button
                    type="button"
                    disabled={actionLoadingId === factory._id}
                    onClick={() => handleUpdateStatus(factory._id, 'approved', auditNotes)}
                    style={{
                      background: '#16a34a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 28px',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      fontFamily: 'var(--font-headline)',
                      cursor: actionLoadingId === factory._id ? 'not-allowed' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)',
                    }}
                  >
                    {actionLoadingId === factory._id ? (
                      'جاري الاعتماد وتفعيل الحساب...'
                    ) : (
                      <>
                        <span>✓</span>
                        <span>قبول واعتماد المنشأة وتفعيل الحساب رسمياً</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={actionLoadingId === factory._id}
                    onClick={() => handleUpdateStatus(factory._id, 'rejected', auditNotes)}
                    style={{
                      background: '#ffffff',
                      color: '#dc2626',
                      border: '1.5px solid #fca5a5',
                      borderRadius: '8px',
                      padding: '12px 20px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-headline)',
                      cursor: 'pointer',
                    }}
                  >
                    رفض الطلب لعدم الاستيفاء
                  </button>
                </>
              ) : isApproved ? (
                <>
                  <button
                    type="button"
                    disabled={actionLoadingId === factory._id}
                    onClick={() => handleUpdateStatus(factory._id, 'pending', auditNotes)}
                    style={{
                      background: '#ffffff',
                      color: '#b45309',
                      border: '1.5px solid #fcd34d',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-headline)',
                      cursor: 'pointer',
                    }}
                  >
                    إعادة الحساب لحالة قيد المراجعة
                  </button>

                  <button
                    type="button"
                    disabled={actionLoadingId === factory._id}
                    onClick={() => handleUpdateStatus(factory._id, 'rejected', auditNotes)}
                    style={{
                      background: '#ffffff',
                      color: '#dc2626',
                      border: '1.5px solid #fca5a5',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      fontFamily: 'var(--font-headline)',
                      cursor: 'pointer',
                    }}
                  >
                    إلغاء الاعتماد وتعليق الحساب
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  disabled={actionLoadingId === factory._id}
                  onClick={() => handleUpdateStatus(factory._id, 'approved', auditNotes)}
                  style={{
                    background: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 26px',
                    fontSize: '0.95rem',
                    fontWeight: 800,
                    fontFamily: 'var(--font-headline)',
                    cursor: 'pointer',
                  }}
                >
                  إلغاء الرفض وتفعيل الحساب الآن
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: DASHBOARD VIEW (لوحة التحكم الرئيسية - تعرض إحصائيات المنشآت ومساحة قيد الربط)
  // =========================================================================
  if (activeTab === 'dashboard') {
    return (
      <div style={{ width: '100%', maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Admin Dashboard Header Card */}
        <div
          className="profile-cover-card"
          style={{
            margin: 0,
            overflow: 'hidden',
            borderRadius: '16px',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 4px 20px rgba(0, 43, 84, 0.04)',
          }}
        >
          <div
            className="profile-cover-banner"
            style={{
              height: 'auto',
              minHeight: '130px',
              padding: '28px 36px',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div className="profile-banner-mesh"></div>
            <div className="profile-banner-glow"></div>

            <div style={{ position: 'relative', zIndex: 2 }}>
              <h1
                style={{
                  fontFamily: 'var(--font-headline)',
                  margin: 0,
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                لوحة التحكم والمؤشرات الصناعية
              </h1>
            </div>
          </div>

          {/* Stats Summary Bar (الجزء المطلوب فقط في الصفحة الرئيسية) */}
          <div
            style={{
              padding: '24px 36px',
              background: 'var(--white)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
            }}
          >
            <div
              onClick={() => {
                setActiveFilter('');
                setActiveTab('validation');
              }}
              style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--neutral-50)',
                border: '1.5px solid var(--neutral-200)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              title="عرض كافة المنشآت المسجلة"
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--neutral-600)', marginBottom: '4px' }}>
                إجمالي المنشآت المسجلة
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--blue-900)' }}>
                {stats.total}
              </div>
            </div>

            <div
              onClick={() => {
                setActiveFilter('pending');
                setActiveTab('validation');
              }}
              style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--yellow-50)',
                border: '1.5px solid var(--yellow-200)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              title="عرض المنشآت بانتظار الفحص"
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--yellow-900)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--yellow-500)', boxShadow: '0 0 6px var(--yellow-400)' }}></span>
                بانتظار الفحص والاعتماد
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--yellow-900)' }}>
                {stats.pending}
              </div>
            </div>

            <div
              onClick={() => {
                setActiveFilter('approved');
                setActiveTab('validation');
              }}
              style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--success-bg)',
                border: '1.5px solid var(--success-border)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              title="عرض المنشآت المعتمدة"
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>✓</span>
                منشآت معتمدة وموثقة
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--success)' }}>
                {stats.approved}
              </div>
            </div>

            <div
              onClick={() => {
                setActiveFilter('rejected');
                setActiveTab('validation');
              }}
              style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--danger-bg)',
                border: '1.5px solid var(--danger-border)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              title="عرض المنشآت المرفوضة"
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '4px' }}>
                منشآت مرفوضة
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--danger)' }}>
                {stats.rejected}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Empty Placeholder (فاضية لحين ربطها) */}
        <div
          className="dashboard-card"
          style={{
            padding: '50px 24px',
            textAlign: 'center',
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px dashed #CBD5E1',
            margin: 0,
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#EFF6FF',
              color: '#0055A5',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              marginBottom: '16px',
            }}
          >
            📊
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-headline)',
              color: '#002B54',
              fontSize: '1.25rem',
              margin: '0 0 8px',
              fontWeight: 800,
            }}
          >
            لوحة المؤشرات والرسوم البيانية (قيد الربط)
          </h3>
          <p
            style={{
              margin: '0 auto 20px',
              color: '#64748B',
              fontSize: '0.92rem',
              maxWidth: '520px',
              lineHeight: 1.6,
            }}
          >
            هذه المساحة مخصصة للرسوم البيانية والمؤشرات التحليلية المتقدمة. سيتم تفعيلها وعرض الرسوم فور ربط مصادر البيانات.
          </p>
          <button
            type="button"
            onClick={() => setActiveTab('validation')}
            className="btn btn-primary"
            style={{
              padding: '10px 24px',
              fontSize: '0.9rem',
              fontWeight: 800,
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>الانتقال إلى تدقيق واعتماد المستخدمين</span>
            <span style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>➔</span>
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: USER VALIDATION VIEW (سجل المنشآت والتدقيق المباشر لكافة المستخدمين المسجلين)
  // =========================================================================
  return (
    <div style={{ width: '100%', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Admin Portal Main Card (Matching Profile / Form Dimensions & Style) */}
      <div
        className="profile-cover-card"
        style={{
          width: '100%',
          margin: '0 auto 32px',
          padding: 0,
          overflow: 'hidden',
          borderRadius: '16px',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 4px 20px rgba(0, 43, 84, 0.04)',
        }}
      >
        {/* Cover Banner (Matching Form Header in Image 2) */}
        <div
          className="profile-cover-banner"
          style={{
            height: 'auto',
            minHeight: '145px',
            padding: '28px 36px',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '20px',
            position: 'relative',
          }}
        >
          <div className="profile-banner-mesh"></div>
          <div className="profile-banner-glow"></div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '4px',
              flexWrap: 'wrap',
              gap: '14px',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-headline)',
                  margin: 0,
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                تدقيق واعتماد المستخدمين
              </h1>
            </div>
          </div>

          {/* Stepper Progress Style Filter Tabs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              position: 'relative',
              zIndex: 2,
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveFilter('')}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                border: 'none',
                background: activeFilter === '' ? '#FDB813' : 'rgba(255,255,255,0.15)',
                color: activeFilter === '' ? '#002B54' : '#fff',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-headline)',
              }}
            >
              <span>جميع المنشآت</span>
              <span
                style={{
                  background: activeFilter === '' ? '#002B54' : 'rgba(255,255,255,0.25)',
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}
              >
                {stats.total}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('pending')}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                border: 'none',
                background: activeFilter === 'pending' ? '#FDB813' : 'rgba(255,255,255,0.15)',
                color: activeFilter === 'pending' ? '#002B54' : '#fff',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-headline)',
              }}
            >
              <span>🛡️ فاحص المنشآت والاعتماد</span>
              <span
                style={{
                  background: activeFilter === 'pending' ? '#002B54' : '#FDB813',
                  color: activeFilter === 'pending' ? '#fff' : '#002B54',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}
              >
                {stats.pending}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('approved')}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                border: 'none',
                background: activeFilter === 'approved' ? '#10b981' : 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-headline)',
              }}
            >
              <span>المعتمدة</span>
              <span
                style={{
                  background: 'rgba(255,255,255,0.25)',
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}
              >
                {stats.approved}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveFilter('rejected')}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                border: 'none',
                background: activeFilter === 'rejected' ? '#ef4444' : 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
                fontFamily: 'var(--font-headline)',
              }}
            >
              <span>المرفوضة</span>
              <span
                style={{
                  background: 'rgba(255,255,255,0.25)',
                  color: '#fff',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}
              >
                {stats.rejected}
              </span>
            </button>
          </div>
        </div>

        {/* Toolbar: Search Box */}
        <div
          style={{
            padding: '18px 36px',
            background: '#FAFBFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <form
            onSubmit={handleSearchSubmit}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', maxWidth: '420px' }}
          >
            <div className="input-container" style={{ flex: 1, margin: 0 }}>
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                className="form-input"
                placeholder="بحث بالاسم، السجل الضريبي، أو الهاتف..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '0.85rem' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
              بحث
            </button>
          </form>

          <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 700 }}>
            عدد المنشآت: {factories.length}
          </span>
        </div>

        {/* Content Body / Facilities List */}
        <div className="dashboard-body" style={{ padding: '36px' }}>
          <Alert type={toastMessage.type} message={toastMessage.text} />

          {activeFilter === 'pending' && (
            <div
              style={{
                background: '#FEFCE8',
                border: '1.5px solid #FDE047',
                borderRadius: '10px',
                padding: '16px 20px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
              }}
            >
              <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>🛡️</span>
              <div style={{ flex: 1, fontSize: '0.88rem', color: '#713F12', lineHeight: 1.6 }}>
                <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '2px', color: '#854D0E' }}>
                  بوابة فحص وتدقيق المنشآت (Admin Checker & Verification Page)
                </strong>
                هذه المنشآت مسجلة حديثاً على المنصة وحساباتها معلّقة ومحظورة من تسجيل الدخول. وفقاً لنظام الأمان المعتمد، لا يتم تفعيل أي مستخدم إلا بعد فحص مستند صورة البطاقة الضريبية والتأكد من بيانات السجل ثم الضغط على زر «قبول واعتماد المنشأة وتفعيل الحساب (Accept)».
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <div
                className="spinner"
                style={{
                  width: '34px',
                  height: '34px',
                  borderColor: 'var(--neutral-300)',
                  borderTopColor: 'var(--primary)',
                  margin: '0 auto 12px',
                }}
              ></div>
              <p style={{ fontFamily: 'var(--font-headline)', color: 'var(--neutral-600)', fontSize: '0.9rem' }}>
                جاري فحص وتحديث سجلات المنشآت الصناعية...
              </p>
            </div>
          ) : factories.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '48px 20px',
                background: 'var(--neutral-50)',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--neutral-300)',
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--neutral-400)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '10px' }}>
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <h4 style={{ color: 'var(--blue-900)', marginBottom: '6px' }}>لا توجد منشآت مطابقة للبحث أو التصفية الحالية</h4>
              <p style={{ color: 'var(--neutral-500)', fontSize: '0.85rem' }}>
                يمكنك تغيير شروط التصفية أعلاه أو مسح نص البحث لعرض جميع المنشآت.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {factories.map((factory) => {
                const isPending = factory.accountStatus === 'pending';
                const isApproved = factory.accountStatus === 'approved';
                const isRejected = factory.accountStatus === 'rejected';

                const statusLabel = isApproved
                  ? 'معتمد وموثق (Authorized)'
                  : isRejected
                  ? 'مرفوض'
                  : 'حالة الحساب: قيد المراجعة والاعتماد';

                return (
                  <div
                    key={factory._id}
                    style={{
                      background: 'var(--white)',
                      border: `1.5px solid ${isApproved ? 'var(--success-border)' : isPending ? 'var(--yellow-300)' : 'var(--danger-border)'}`,
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-sm)',
                      padding: '22px 24px',
                      transition: 'all var(--transition-fast)',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Top status accent strip */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        left: 0,
                        height: '3.5px',
                        background: isApproved
                          ? 'var(--success)'
                          : isPending
                          ? 'var(--yellow-500)'
                          : 'var(--danger)',
                      }}
                    ></div>

                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span className={`status-badge ${factory.accountStatus}`}>
                            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'currentColor' }}></span>
                            {statusLabel}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--neutral-500)', fontFamily: 'var(--font-label)' }}>
                            تاريخ التسجيل: {factory.createdAt ? new Date(factory.createdAt).toLocaleDateString('ar-EG') : 'غير مسجل'}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.25rem', color: 'var(--blue-900)', fontWeight: 800 }}>
                          {factory.factoryName}
                        </h3>
                      </div>

                      {/* MAIN ACTION BUTTON: DEDICATED CHECK / VERIFICATION BUTTON */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenCheckPage(factory)}
                          style={{
                            background: '#002B54',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '9px 18px',
                            fontFamily: 'var(--font-headline)',
                            fontWeight: 700,
                            fontSize: '0.86rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 2px 8px rgba(0, 43, 84, 0.2)',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#00407a';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#002B54';
                            e.currentTarget.style.transform = 'none';
                          }}
                        >
                          <span>🔍</span>
                          <span>فحص وتدقيق المنشأة واعتمادها</span>
                        </button>

                        {isPending && (
                          <button
                            type="button"
                            className="btn btn-yellow"
                            disabled={actionLoadingId === factory._id}
                            onClick={() => handleUpdateStatus(factory._id, 'approved')}
                            style={{
                              padding: '9px 18px',
                              fontSize: '0.86rem',
                              fontWeight: 800,
                              gap: '6px',
                            }}
                          >
                            {actionLoadingId === factory._id ? 'جاري الاعتماد...' : '✓ اعتماد سريع'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Facility Data Details Grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                        gap: '12px',
                        padding: '14px 16px',
                        background: 'var(--neutral-50)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--neutral-200)',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--neutral-500)', fontWeight: 700, marginBottom: '2px' }}>
                          السجل التجاري / الرقم الضريبي
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--blue-900)', fontWeight: 700 }}>
                          {factory.taxId || 'غير مدخل'}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--neutral-500)', fontWeight: 700, marginBottom: '2px' }}>
                          البريد الإلكتروني الرسمي
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--blue-900)', fontWeight: 600 }} dir="ltr">
                          {factory.contactInfo?.email || 'غير مسجل'}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--neutral-500)', fontWeight: 700, marginBottom: '2px' }}>
                          رقم الهاتف للتواصل
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--blue-900)', fontWeight: 600 }} dir="ltr">
                          {factory.contactInfo?.phone || 'غير مسجل'}
                        </div>
                      </div>

                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--neutral-500)', fontWeight: 700, marginBottom: '2px' }}>
                          الموقع والمنطقة الصناعية
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--blue-900)', fontWeight: 600 }}>
                          {[
                            factory.location?.industrialZone,
                            factory.location?.city,
                            factory.location?.governorate,
                          ]
                            .filter(Boolean)
                            .join('، ') || 'لم يُحدد'}
                        </div>
                      </div>
                    </div>

                    {/* 3 Documents Verification Box */}
                    <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        {/* 1. البطاقة الضريبية */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-700)' }}>
                            البطاقة الضريبية:
                          </span>
                          {factory.taxCardImage?.fileUrl ? (
                            <button
                              type="button"
                              onClick={() => setPreviewImage(factory.taxCardImage.fileUrl)}
                              style={{ border: 'none', background: 'none', color: '#16a34a', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
                              title="معاينة صورة البطاقة الضريبية"
                            >
                              ✓ معاينة
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>غير مرفقة</span>
                          )}
                        </div>

                        {/* 2. السجل التجاري */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-700)' }}>
                            السجل التجاري:
                          </span>
                          {factory.commercialRegImage?.fileUrl ? (
                            <button
                              type="button"
                              onClick={() => setPreviewImage(factory.commercialRegImage.fileUrl)}
                              style={{ border: 'none', background: 'none', color: '#16a34a', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
                              title="معاينة صورة السجل التجاري"
                            >
                              ✓ معاينة
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>غير مرفق</span>
                          )}
                        </div>

                        {/* 3. السجل الصناعي */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-700)' }}>
                            السجل الصناعي:
                          </span>
                          {factory.industrialRegImage?.fileUrl ? (
                            <button
                              type="button"
                              onClick={() => setPreviewImage(factory.industrialRegImage.fileUrl)}
                              style={{ border: 'none', background: 'none', color: '#16a34a', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
                              title="معاينة صورة السجل الصناعي"
                            >
                              ✓ معاينة
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>غير مرفق</span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedFactory(factory)}
                        className="btn btn-outline"
                        style={{
                          padding: '4px 12px',
                          fontSize: '0.78rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          borderColor: 'var(--blue-200)',
                          color: 'var(--blue-700)',
                          background: 'var(--blue-50)',
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        فحص المنشأة والمستندات الثلاثة
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Tax Card Document Preview */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 37, 64, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '20px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '680px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--blue-900)', color: '#fff' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                معاينة مستند البطاقة الضريبية للمنشأة
              </div>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', padding: '0 6px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '20px', textAlign: 'center', maxHeight: '70vh', overflowY: 'auto' }}>
              <img
                src={previewImage}
                alt="البطاقة الضريبية"
                style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'block';
                }}
              />
              <div style={{ display: 'none', padding: '30px 10px', color: 'var(--neutral-600)', fontSize: '0.9rem' }}>
                <p>تعذر عرض الصورة مباشرة. يمكنك فتح الرابط الأصلي أدناه:</p>
                <a href={previewImage} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ marginTop: '12px' }}>
                  فتح رابط المستند في نافذة جديدة
                </a>
              </div>
            </div>

            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-color)', background: 'var(--neutral-50)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <a href={previewImage} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ fontSize: '0.82rem' }}>
                فتح الرابط الخارجي
              </a>
              <button type="button" onClick={() => setPreviewImage(null)} className="btn btn-primary" style={{ fontSize: '0.82rem' }}>
                إغلاق المعاينة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
