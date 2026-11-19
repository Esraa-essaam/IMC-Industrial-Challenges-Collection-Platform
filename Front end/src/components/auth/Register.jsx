import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import Alert from '../common/Alert';

export default function Register({ onSwitchToLogin }) {
  const { register, loading } = useAuth();
  
  // Refs for 3 mandatory image uploads
  const taxCardInputRef = useRef(null);
  const commercialRegInputRef = useRef(null);
  const industrialRegInputRef = useRef(null);

  const [formData, setFormData] = useState({
    factoryName: '',
    email: '',
    phone: '',
    taxId: '',
    governorate: '',
    city: '',
    industrialZone: '',
    password: '',
    confirmPassword: '',
  });

  // Mandatory 3 Image Files state (Strictly File, No Links, All Required)
  // 1. البطاقة الضريبية (Tax Card)
  const [taxCardImage, setTaxCardImage] = useState(null);
  const [taxCardMeta, setTaxCardMeta] = useState(null);
  const [isDraggingTax, setIsDraggingTax] = useState(false);

  // 2. السجل التجاري
  const [commercialRegImage, setCommercialRegImage] = useState(null);
  const [commercialRegMeta, setCommercialRegMeta] = useState(null);
  const [isDraggingComm, setIsDraggingComm] = useState(false);

  // 3. السجل الصناعي
  const [industrialRegImage, setIndustrialRegImage] = useState(null);
  const [industrialRegMeta, setIndustrialRegMeta] = useState(null);
  const [isDraggingInd, setIsDraggingInd] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const processImageFile = (file, docType) => {
    if (!file) return;

    // Strict validation: Images only, NO other file types or links
    if (!file.type.startsWith('image/')) {
      setError('يُقبل رفع ملفات الصور فقط (PNG, JPG, JPEG, WEBP). المستندات الأخرى والروابط غير مقبولة.');
      return;
    }

    // Limit to 5MB to prevent memory bloat
    if (file.size > 5 * 1024 * 1024) {
      setError('حجم الصورة كبير جداً. الحد الأقصى المسموح به هو 5 ميجابايت لكل مستند.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = uploadEvent.target.result;
      const meta = {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' ك.ب',
      };

      if (docType === 'tax') {
        setTaxCardImage(dataUrl);
        setTaxCardMeta(meta);
      } else if (docType === 'comm') {
        setCommercialRegImage(dataUrl);
        setCommercialRegMeta(meta);
      } else if (docType === 'ind') {
        setIndustrialRegImage(dataUrl);
        setIndustrialRegMeta(meta);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (docType) => {
    if (docType === 'tax') {
      setTaxCardImage(null);
      setTaxCardMeta(null);
      if (taxCardInputRef.current) taxCardInputRef.current.value = '';
    } else if (docType === 'comm') {
      setCommercialRegImage(null);
      setCommercialRegMeta(null);
      if (commercialRegInputRef.current) commercialRegInputRef.current.value = '';
    } else if (docType === 'ind') {
      setIndustrialRegImage(null);
      setIndustrialRegMeta(null);
      if (industrialRegInputRef.current) industrialRegInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validations
    if (!formData.factoryName.trim()) {
      setError('اسم المصنع أو المنشأة مطلوب.');
      return;
    }

    if (!formData.taxId.trim()) {
      setError('رقم السجل الضريبي / التجاري مطلوب.');
      return;
    }

    // Strictly Require ALL THREE Image Documents
    if (!taxCardImage) {
      setError('1. مستند صورة البطاقة الضريبية (Tax Card) مطلوب كملف صورة لإتمام التسجيل.');
      return;
    }

    if (!commercialRegImage) {
      setError('2. مستند صورة السجل التجاري مطلوب كملف صورة لإتمام التسجيل.');
      return;
    }

    if (!industrialRegImage) {
      setError('3. مستند صورة السجل الصناعي مطلوب كملف صورة لإتمام التسجيل.');
      return;
    }

    if (!formData.email.trim()) {
      setError('البريد الإلكتروني الرسمي مطلوب.');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('يرجى إدخال بريد إلكتروني رسمي بصيغة صحيحة (name@company.com).');
      return;
    }

    if (!formData.password) {
      setError('كلمة المرور مطلوبة.');
      return;
    }

    if (formData.password.length < 6) {
      setError('يجب ألا تقل كلمة المرور عن 6 أحرف.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('كلمتا المرور غير متطابقتين. يرجى التأكيد.');
      return;
    }

    try {
      const res = await register({
        factoryName: formData.factoryName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim(),
        taxId: formData.taxId.trim(),
        location: {
          governorate: formData.governorate.trim(),
          city: formData.city.trim(),
          industrialZone: formData.industrialZone.trim(),
        },
        taxCardImage: {
          fileUrl: taxCardImage,
        },
        commercialRegImage: {
          fileUrl: commercialRegImage,
        },
        industrialRegImage: {
          fileUrl: industrialRegImage,
        },
      });

      if (res?.requiresApproval || !res?.token) {
        setRegistrationSuccess({
          message:
            res?.message ||
            'تم تسجيل طلب المنشأة بنجاح وهو الآن قيد الفحص والمراجعة من قِبل إدارة مركز تحديث الصناعة (Admin Checker).',
        });
      }
    } catch (err) {
      setError(err.message || 'فشل إنشاء الحساب. يرجى التحقق من صحة البيانات.');
    }
  };

  // =========================================================================
  // VIEW: REGISTRATION SUCCESS & PENDING ADMIN APPROVAL CONFIRMATION
  // =========================================================================
  if (registrationSuccess) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: '#FEF3C7',
            color: '#B45309',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            border: '2px solid #FCD34D',
            boxShadow: '0 6px 16px rgba(245, 158, 11, 0.2)',
          }}
        >
          ⏳
        </div>

        <h3
          style={{
            color: '#002B54',
            fontFamily: 'var(--font-headline)',
            fontSize: '1.4rem',
            fontWeight: 800,
            margin: 0,
          }}
        >
          تم تقديم طلب التسجيل بنجاح
        </h3>

        <div
          style={{
            background: '#F8FAFC',
            border: '1.5px solid #E2E8F0',
            borderRadius: '12px',
            padding: '18px 20px',
            fontSize: '0.92rem',
            color: '#334155',
            lineHeight: 1.7,
            textAlign: 'right',
          }}
        >
          <p style={{ margin: '0 0 10px', fontWeight: 700, color: '#0055A5' }}>
            ℹ️ إجراءات التحقق والاعتماد (Admin Checker):
          </p>
          <p style={{ margin: '0 0 8px' }}>
            {registrationSuccess.message}
          </p>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
            وفقاً لسياسة الأمان والجودة بمركز تحديث الصناعة (IMC)، لا يتم تفعيل أي حساب منشأة إلا بعد مراجعة السجل التجاري وصورة البطاقة الضريبية واعتمادها رسمياً من قِبل المشرف المختص.
          </p>
        </div>

        <button
          type="button"
          onClick={onSwitchToLogin}
          className="btn btn-primary btn-block"
          style={{ marginTop: '10px', padding: '12px 24px', fontSize: '0.95rem' }}
        >
          الانتقال إلى شاشة تسجيل الدخول
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
        </button>
      </div>
    );
  }

  // =========================================================================
  // VIEW: REGISTRATION FORM
  // =========================================================================
  return (
    <form onSubmit={handleSubmit} noValidate>
      <Alert type="danger" message={error} />

      {/* Section 1: Facility Identification */}
      <div className="section-divider">بيانات المنشأة الصناعية والمستندات</div>

      {/* Factory Name */}
      <div className="form-group">
        <label className="form-label" htmlFor="reg-factoryName">
          اسم المصنع / المنشأة <span className="required">*</span>
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
              <path d="M2 20h20" />
              <path d="M5 20V8l5 4V8l5 4V4h5v16" />
            </svg>
          </span>
          <input
            id="reg-factoryName"
            type="text"
            name="factoryName"
            className="form-input"
            placeholder="مثال: شركة الأمل للصناعات الهندسية"
            value={formData.factoryName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Row: Tax ID & Phone */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="reg-taxId">
            رقم السجل الضريبي / التجاري <span className="required">*</span>
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </span>
            <input
              id="reg-taxId"
              type="text"
              name="taxId"
              className="form-input"
              placeholder="مثال: 100-234-567"
              value={formData.taxId}
              onChange={handleChange}
              dir="ltr"
              style={{ textAlign: 'right' }}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-phone">
            رقم الهاتف للتواصل
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
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <input
              id="reg-phone"
              type="tel"
              name="phone"
              className="form-input"
              placeholder="01012345678"
              value={formData.phone}
              onChange={handleChange}
              dir="ltr"
              style={{ textAlign: 'right' }}
            />
          </div>
        </div>
      </div>

      {/* 3 STRICT IMAGE ONLY INPUTS (ALL REQUIRED): البطاقة الضريبية، السجل التجاري، السجل الصناعي */}
      <div className="section-divider" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <span>المستندات الرسمية للمنشأة (مطلوبة بصيغة صور فقط)</span>
        <span style={{ fontSize: '0.78rem', color: '#DC2626', fontWeight: 700 }}>
          * المستندات الثلاثة إلزامية لاكتمال التسجيل
        </span>
      </div>

      {/* 1. البطاقة الضريبية (Tax Card) */}
      <div className="form-group" style={{ marginBottom: '18px' }}>
        <label className="form-label" htmlFor="reg-taxCardFile">
          1. البطاقة الضريبية (Tax Card) <span className="required">*</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--neutral-500)', marginRight: '6px' }}>
            (ملف صورة فقط - إلزامي)
          </span>
        </label>

        <input
          ref={taxCardInputRef}
          id="reg-taxCardFile"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={(e) => processImageFile(e.target.files?.[0], 'tax')}
          style={{ display: 'none' }}
        />

        {!taxCardImage ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingTax(true);
            }}
            onDragLeave={() => setIsDraggingTax(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingTax(false);
              processImageFile(e.dataTransfer.files?.[0], 'tax');
            }}
            onClick={() => taxCardInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDraggingTax ? '#0055A5' : '#CBD5E1'}`,
              borderRadius: '10px',
              padding: '20px 16px',
              textAlign: 'center',
              background: isDraggingTax ? '#EFF6FF' : '#F8FAFC',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                margin: '0 auto 8px',
                borderRadius: '50%',
                background: '#EFF6FF',
                color: '#0055A5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" x2="12" y1="3" y2="15" />
              </svg>
            </div>
            <div style={{ fontWeight: 700, color: '#002B54', fontSize: '0.9rem', marginBottom: '3px' }}>
              اضغط لرفع صورة البطاقة الضريبية أو اسحب الملف هنا
            </div>
            <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
              الصيغ المقبولة: PNG, JPG, JPEG, WEBP (الحد الأقصى: 5 ميجابايت)
            </div>
          </div>
        ) : (
          <div
            style={{
              background: '#F0FDF4',
              border: '1.5px solid #86EFAC',
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={taxCardImage}
                alt="معاينة البطاقة الضريبية"
                style={{
                  width: '52px',
                  height: '52px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  border: '1px solid #BBF7D0',
                }}
              />
              <div>
                <div style={{ fontWeight: 700, color: '#166534', fontSize: '0.88rem' }}>
                  ✓ تم رفع صورة البطاقة الضريبية
                </div>
                <div style={{ fontSize: '0.75rem', color: '#4B5563' }}>
                  {taxCardMeta?.name} ({taxCardMeta?.size})
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => taxCardInputRef.current?.click()}
                className="btn-back-landing"
                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
              >
                تغيير الصورة
              </button>
              <button
                type="button"
                onClick={() => handleRemoveImage('tax')}
                style={{
                  background: 'none',
                  border: '1px solid #FCA5A5',
                  color: '#DC2626',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                حذف
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. السجل التجاري */}
      <div className="form-group" style={{ marginBottom: '18px' }}>
        <label className="form-label" htmlFor="reg-commRegFile">
          2. السجل التجاري <span className="required">*</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--neutral-500)', marginRight: '6px' }}>
            (ملف صورة فقط - إلزامي)
          </span>
        </label>

        <input
          ref={commercialRegInputRef}
          id="reg-commRegFile"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={(e) => processImageFile(e.target.files?.[0], 'comm')}
          style={{ display: 'none' }}
        />

        {!commercialRegImage ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingComm(true);
            }}
            onDragLeave={() => setIsDraggingComm(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingComm(false);
              processImageFile(e.dataTransfer.files?.[0], 'comm');
            }}
            onClick={() => commercialRegInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDraggingComm ? '#0055A5' : '#CBD5E1'}`,
              borderRadius: '10px',
              padding: '20px 16px',
              textAlign: 'center',
              background: isDraggingComm ? '#EFF6FF' : '#F8FAFC',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                margin: '0 auto 8px',
                borderRadius: '50%',
                background: '#EFF6FF',
                color: '#0055A5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M7 7h10" />
                <path d="M7 12h10" />
                <path d="M7 17h6" />
              </svg>
            </div>
            <div style={{ fontWeight: 700, color: '#002B54', fontSize: '0.9rem', marginBottom: '3px' }}>
              اضغط لرفع صورة السجل التجاري أو اسحب الملف هنا
            </div>
            <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
              الصيغ المقبولة: PNG, JPG, JPEG, WEBP (الحد الأقصى: 5 ميجابايت)
            </div>
          </div>
        ) : (
          <div
            style={{
              background: '#F0FDF4',
              border: '1.5px solid #86EFAC',
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={commercialRegImage}
                alt="معاينة السجل التجاري"
                style={{
                  width: '52px',
                  height: '52px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  border: '1px solid #BBF7D0',
                }}
              />
              <div>
                <div style={{ fontWeight: 700, color: '#166534', fontSize: '0.88rem' }}>
                  ✓ تم رفع صورة السجل التجاري
                </div>
                <div style={{ fontSize: '0.75rem', color: '#4B5563' }}>
                  {commercialRegMeta?.name} ({commercialRegMeta?.size})
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => commercialRegInputRef.current?.click()}
                className="btn-back-landing"
                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
              >
                تغيير الصورة
              </button>
              <button
                type="button"
                onClick={() => handleRemoveImage('comm')}
                style={{
                  background: 'none',
                  border: '1px solid #FCA5A5',
                  color: '#DC2626',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                حذف
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. السجل الصناعي */}
      <div className="form-group" style={{ marginBottom: '22px' }}>
        <label className="form-label" htmlFor="reg-indRegFile">
          3. السجل الصناعي <span className="required">*</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--neutral-500)', marginRight: '6px' }}>
            (ملف صورة فقط - إلزامي)
          </span>
        </label>

        <input
          ref={industrialRegInputRef}
          id="reg-indRegFile"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={(e) => processImageFile(e.target.files?.[0], 'ind')}
          style={{ display: 'none' }}
        />

        {!industrialRegImage ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingInd(true);
            }}
            onDragLeave={() => setIsDraggingInd(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingInd(false);
              processImageFile(e.dataTransfer.files?.[0], 'ind');
            }}
            onClick={() => industrialRegInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDraggingInd ? '#0055A5' : '#CBD5E1'}`,
              borderRadius: '10px',
              padding: '20px 16px',
              textAlign: 'center',
              background: isDraggingInd ? '#EFF6FF' : '#F8FAFC',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                margin: '0 auto 8px',
                borderRadius: '50%',
                background: '#EFF6FF',
                color: '#0055A5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M2 20h20" />
                <path d="M5 20V8l5 4V4l5 4V2l4 4v14" />
              </svg>
            </div>
            <div style={{ fontWeight: 700, color: '#002B54', fontSize: '0.9rem', marginBottom: '3px' }}>
              اضغط لرفع صورة السجل الصناعي أو اسحب الملف هنا
            </div>
            <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
              الصيغ المقبولة: PNG, JPG, JPEG, WEBP (الحد الأقصى: 5 ميجابايت)
            </div>
          </div>
        ) : (
          <div
            style={{
              background: '#F0FDF4',
              border: '1.5px solid #86EFAC',
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={industrialRegImage}
                alt="معاينة السجل الصناعي"
                style={{
                  width: '52px',
                  height: '52px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  border: '1px solid #BBF7D0',
                }}
              />
              <div>
                <div style={{ fontWeight: 700, color: '#166534', fontSize: '0.88rem' }}>
                  ✓ تم رفع صورة السجل الصناعي
                </div>
                <div style={{ fontSize: '0.75rem', color: '#4B5563' }}>
                  {industrialRegMeta?.name} ({industrialRegMeta?.size})
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => industrialRegInputRef.current?.click()}
                className="btn-back-landing"
                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
              >
                تغيير الصورة
              </button>
              <button
                type="button"
                onClick={() => handleRemoveImage('ind')}
                style={{
                  background: 'none',
                  border: '1px solid #FCA5A5',
                  color: '#DC2626',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                حذف
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: Account & Location */}
      <div className="section-divider">بيانات الاتصال والموقع الجغرافي</div>

      {/* Email */}
      <div className="form-group">
        <label className="form-label" htmlFor="reg-email">
          البريد الإلكتروني الرسمي <span className="required">*</span>
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
            id="reg-email"
            type="email"
            name="email"
            className="form-input"
            placeholder="factory@company.com"
            value={formData.email}
            onChange={handleChange}
            dir="ltr"
            style={{ textAlign: 'right' }}
            required
          />
        </div>
      </div>

      {/* Location Details */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="reg-governorate">
            المحافظة
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
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <input
              id="reg-governorate"
              type="text"
              name="governorate"
              className="form-input"
              placeholder="مثال: الشرقية"
              value={formData.governorate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-city">
            المدينة / المركز
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
                <path d="M3 21h18" />
                <path d="M5 21V7l8-4v18" />
                <path d="M19 21V11l-6-3" />
              </svg>
            </span>
            <input
              id="reg-city"
              type="text"
              name="city"
              className="form-input"
              placeholder="مثال: العاشر من رمضان"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="reg-industrialZone">
          المنطقة الصناعية (إن وجدت)
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
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </span>
          <input
            id="reg-industrialZone"
            type="text"
            name="industrialZone"
            className="form-input"
            placeholder="مثال: المنطقة الصناعية الثالثة B4"
            value={formData.industrialZone}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Section 3: Passwords */}
      <div className="section-divider">بيانات الدخول وكلمة المرور</div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="reg-password">
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
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              dir="ltr"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-confirmPassword">
            تأكيد كلمة المرور <span className="required">*</span>
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </span>
            <input
              id="reg-confirmPassword"
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              className="form-input"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              dir="ltr"
              required
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--neutral-600)',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-headline)',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {showPassword ? 'إخفاء كلمات المرور' : 'إظهار كلمات المرور'}
        </button>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            جاري إرسال طلب التسجيل...
          </>
        ) : (
          <>
            تقديم طلب إنشاء الحساب
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

      <div
        style={{
          marginTop: '16px',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'var(--neutral-600)',
          fontFamily: 'var(--font-headline)',
        }}
      >
        لديك حساب بالفعل؟{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
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
          تسجيل الدخول
        </button>
      </div>
    </form>
  );
}
