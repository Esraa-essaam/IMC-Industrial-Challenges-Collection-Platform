import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { requestsAPI } from '../../services/api';
import CustomSelect from '../common/CustomSelect';
import {
  REQUEST_TYPES,
  CHALLENGE_AREAS,
  CHALLENGE_SYMPTOMS,
  CHALLENGE_SYMPTOM_DETAILS,
  IMPROVE_AREAS,
  IMPROVE_SYMPTOMS,
  IMPROVE_SYMPTOM_DETAILS,
  IDEA_OPPORTUNITY_TYPES,
  LOCALIZE_OPPORTUNITY_TYPES,
  LAB_KNOWLEDGE_OPTIONS,
  LAB_TEST_AREAS,
  LAB_TESTS_BY_AREA,
  LAB_GENERAL_GOALS,
  LAB_GOALS_BY_AREA,
  LAB_SUBJECT_MODES,
  LAB_MATERIAL_FAMILIES,
  LAB_MATERIAL_TYPES,
  LAB_PRODUCT_FAMILIES,
  LAB_PRODUCT_TYPES,
  LAB_USAGES,
  CHALLENGE_IMPACTS,
  EXPECTED_BENEFITS,
  DESIRED_OUTCOMES,
  FREQUENCY_OPTIONS,
  AFFECTED_SCOPE_OPTIONS,
  METRIC_CONFIG,
} from '../../data/formQuestionsData';

export default function ProblemSubmissionForm({ onCancel, onSuccess }) {
  const { user, token } = useAuth();

  // Current Step: 1 | 2 | 3 | 4
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submittedResult, setSubmittedResult] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    // Page 1: Request Type
    requestType: 'challenge', // default

    // Page 2: Request Details
    // Challenge / Improve
    reportedAreaCode: '',
    reportedAreaLabel: '',
    reportedSymptomCode: '',
    reportedSymptomLabel: '',
    symptomDetail: '',
    freeDescription: '',

    // Idea / Localize
    opportunityType: '',
    opportunityTypeLabel: '',
    subjectName: '',

    // Lab
    labKnowledge: 'exact',
    labTestAreaCode: '',
    labTestAreaLabel: '',
    labTestCode: '',
    labTestLabel: '',
    labTestName: '',
    labGoalCode: '',
    labGoalLabel: '',
    labSubjectMode: 'product',
    labMaterialFamily: '',
    labMaterialType: '',
    labProductFamily: '',
    labProductType: '',
    labOtherSubject: '',
    labStandard: '',
    labUsage: '',
    labUsageLabel: '',
    labSampleCount: '',

    // Page 3: Impact & Outcome
    frequency: '',
    frequencyLabel: '',
    affectedScope: 'line',
    affectedScopeLabel: 'خط إنتاج محدد',
    impactCodes: [],
    impactLabels: [],
    expectedBenefitCodes: [],
    expectedBenefitLabels: [],
    desiredOutcome: '',
    desiredOutcomeLabel: '',

    // Metrics (Optional)
    enableMetric: false,
    metricType: '',
    metricTypeLabel: '',
    metricValue: '',
    metricUnit: '',
    metricPeriod: '',

    // Multi-factory
    additionalFactories: [],

    // Page 4: Consent
    consent: false,
  });

  // Helper updater
  const updateForm = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    if (submitError) setSubmitError('');
  };

  // Toggle multi-select impacts/benefits
  const toggleImpact = (code, label) => {
    const list = formData.impactCodes.includes(code)
      ? formData.impactCodes.filter((c) => c !== code)
      : [...formData.impactCodes, code];
    const labels = formData.impactLabels.includes(label)
      ? formData.impactLabels.filter((l) => l !== label)
      : [...formData.impactLabels, label];
    updateForm({ impactCodes: list, impactLabels: labels });
  };

  const toggleBenefit = (code, label) => {
    const list = formData.expectedBenefitCodes.includes(code)
      ? formData.expectedBenefitCodes.filter((c) => c !== code)
      : [...formData.expectedBenefitCodes, code];
    const labels = formData.expectedBenefitLabels.includes(label)
      ? formData.expectedBenefitLabels.filter((l) => l !== label)
      : [...formData.expectedBenefitLabels, label];
    updateForm({ expectedBenefitCodes: list, expectedBenefitLabels: labels });
  };

  // Step Validation
  const validateStep = (step) => {
    setSubmitError('');

    if (step === 1) {
      if (!formData.requestType) {
        setSubmitError('يرجى اختيار نوع الطلب الصناعي للاستمرار.');
        return false;
      }
      return true;
    }

    if (step === 2) {
      const type = formData.requestType;
      if (type === 'challenge') {
        if (!formData.reportedAreaCode) {
          setSubmitError('يرجى تحديد مجال التحدي أو المشكلة المتأثرة.');
          return false;
        }
        if (formData.reportedAreaCode === 'unclear') {
          if (!formData.freeDescription || formData.freeDescription.trim().length < 12) {
            setSubmitError('يرجى كتابة وصف المشكلة بوضوح (12 حرفاً على الأقل) للمساعدة في التشخيص.');
            return false;
          }
        } else {
          if (!formData.reportedSymptomCode) {
            setSubmitError('يرجى تحديد مظهر العطل أو العرض الفني.');
            return false;
          }
        }
      } else if (type === 'improve') {
        if (!formData.reportedAreaCode) {
          setSubmitError('يرجى تحديد مجال التحسين المستهدف.');
          return false;
        }
        if (!formData.reportedSymptomCode) {
          setSubmitError('يرجى تحديد هدف التحسين المطلوب.');
          return false;
        }
      } else if (type === 'idea') {
        if (!formData.opportunityType) {
          setSubmitError('يرجى اختيار تصنيف الفكرة التطويرية.');
          return false;
        }
        if (!formData.subjectName || formData.subjectName.trim().length < 4) {
          setSubmitError('يرجى كتابة اسم الفكرة أو المنتج المقترح (4 أحرف على الأقل).');
          return false;
        }
        if (!formData.freeDescription || formData.freeDescription.trim().length < 10) {
          setSubmitError('يرجى توضيح تفاصيل وميزات الفكرة (10 أحرف على الأقل).');
          return false;
        }
      } else if (type === 'localize') {
        if (!formData.opportunityType) {
          setSubmitError('يرجى اختيار نوع المكوّن أو البديل المراد تعميقه محلياً.');
          return false;
        }
        if (!formData.subjectName || formData.subjectName.trim().length < 3) {
          setSubmitError('يرجى تحديد اسم القطعة / الخامة / الماكينة المستهدفة.');
          return false;
        }
      } else if (type === 'lab') {
        if (!formData.labTestAreaCode) {
          setSubmitError('يرجى تحديد مجال الفحص أو المعمل المطلوب.');
          return false;
        }
      }
      return true;
    }

    if (step === 3) {
      if (formData.requestType === 'challenge') {
        if (!formData.frequency) {
          setSubmitError('يرجى اختيار وتيرة حدوث التحدي الفني.');
          return false;
        }
        if (formData.impactCodes.length === 0) {
          setSubmitError('يرجى تحديد أثر تشغيلي واحد على الأقل ناتج عن المشكلة.');
          return false;
        }
      }

      if (['improve', 'idea', 'localize'].includes(formData.requestType)) {
        if (formData.expectedBenefitCodes.length === 0) {
          setSubmitError('يرجى تحديد عائد أو ميزة مرجوة واحدة على الأقل من الطلب.');
          return false;
        }
      }

      if (formData.enableMetric) {
        if (!formData.metricType) {
          setSubmitError('يرجى تحديد نوع المؤشر الكمي أو إلغاء تفعيل القياس الكمي.');
          return false;
        }
        if (!formData.metricValue) {
          setSubmitError('يرجى إدخال القيمة العددية للمؤشر.');
          return false;
        }
      }
      return true;
    }

    if (step === 4) {
      if (!formData.consent) {
        setSubmitError('يجب الإقرار بصحة البيانات المسجلة لإرسال الطلب.');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setSubmitError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Final Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        ...formData,
        companyName: user?.factoryName,
        factoryName: user?.factoryName,
        factoryId: user?.taxId || user?._id,
        industrialSector: user?.industrialSector || 'قطاع الصناعات الهندسية',
        region: user?.location?.region || 'المنطقة الصناعية',
        governorate: user?.location?.governorate || 'القاهرة',
        city: user?.location?.city || 'مدينة بدر',
        factorySize: user?.factorySize || 'متوسطة',
      };

      const res = await requestsAPI.submitRequest(payload, token);
      setSubmittedResult(res.data);
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      console.error('Error submitting form:', err);
      setSubmitError(err.message || 'فشل إرسال الطلب الصناعي. يرجى مراجعة الاتصال وإعادة المحاولة.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success view
  if (submittedResult) {
    return (
      <div
        className="profile-cover-card"
        style={{
          width: '100%',
          maxWidth: '1000px',
          margin: '30px auto',
          padding: '48px 36px',
          textAlign: 'center',
        }}
      >
        <div style={{ width: '74px', height: '74px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.12)', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#10b981' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 style={{ fontFamily: 'var(--font-headline)', color: 'var(--primary)', fontSize: '1.7rem', marginBottom: '8px' }}>
          تم تسجيل الطلب الصناعي بنجاح
        </h2>
        <p style={{ color: 'var(--neutral-600)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto 24px' }}>
          تم حفظ كافة تفاصيل الطلب وتوجيهها إلى فريق الخبراء والاستشاريين المختصين بمركز تحديث الصناعة لدراسة الحالة الفنية.
        </p>

        <div style={{ background: '#f8fafc', border: '1.5px dashed #cbd5e1', borderRadius: '12px', padding: '18px 24px', display: 'inline-block', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--neutral-500)', display: 'block', marginBottom: '4px' }}>
            الرقم المرجعي الرسمي للبلاغ / الطلب
          </span>
          <span style={{ fontFamily: 'var(--font-headline)', fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '1px' }}>
            {submittedResult.requestId}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onCancel}
            className="navbar-nav-pill active"
            style={{ padding: '12px 28px', fontSize: '0.95rem' }}
          >
            العودة إلى سجل التحديات الصناعية
          </button>

          <button
            type="button"
            onClick={() => {
              setSubmittedResult(null);
              setCurrentStep(1);
              setFormData((prev) => ({ ...prev, consent: false, freeDescription: '', subjectName: '' }));
            }}
            className="btn-back-landing"
            style={{ padding: '12px 24px', fontSize: '0.95rem' }}
          >
            + تسجيل طلب صناعي آخر
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="profile-cover-card"
      style={{
        width: '100%',
        margin: '0 auto 32px',
        padding: 0,
        overflow: 'hidden',
      }}
    >
      {/* Form Stepper Header (Matching Profile Banner Dimensions & Style) */}
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
        }}
      >
        <div className="profile-banner-mesh"></div>
        <div className="profile-banner-glow"></div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '14px', position: 'relative', zIndex: 2 }}>
          <div>
            <span style={{ color: '#FDB813', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.5px' }}>
              منظومة تقديم الدعم والتحديات الصناعية
            </span>
            <h2 style={{ fontFamily: 'var(--font-headline)', margin: '4px 0 0', fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
              تسجيل طلب / تحدٍ صناعي جديد
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#fff',
              padding: '8px 18px',
              borderRadius: '9999px',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font-headline)',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(8px)',
            }}
          >
            إلغاء والعودة
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 2, flexWrap: 'wrap', gap: '10px' }}>
          {[
            { step: 1, label: 'المصنع والطلب' },
            { step: 2, label: 'تفاصيل الطلب' },
            { step: 3, label: 'الأثر والنتيجة' },
            { step: 4, label: 'مراجعة وإرسال' },
          ].map((item) => {
            const isActive = currentStep === item.step;
            const isCompleted = currentStep > item.step;
            return (
              <div
                key={item.step}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: isActive || isCompleted ? 1 : 0.6,
                  cursor: isCompleted ? 'pointer' : 'default',
                }}
                onClick={() => {
                  if (isCompleted) setCurrentStep(item.step);
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: isActive ? '#FDB813' : isCompleted ? '#10b981' : 'rgba(255,255,255,0.2)',
                    color: isActive ? '#002b54' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                  }}
                >
                  {isCompleted ? '✓' : item.step}
                </div>
                <span style={{ fontSize: '0.88rem', fontWeight: isActive ? 700 : 500 }}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error notification banner */}
      {submitError && (
        <div style={{ background: '#fef2f2', borderBottom: '1px solid #fee2e2', color: '#b91c1c', padding: '12px 24px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>⚠️</span>
          <span>{submitError}</span>
        </div>
      )}

      {/* Body Content */}
      <div style={{ padding: '36px' }}>
        {/* ============================================================== */}
        {/* STEP 1: المصنع والطلب */}
        {/* ============================================================== */}
        {currentStep === 1 && (
          <div>
            {/* Facility Profile Overview Banner */}
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px 20px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FDB813' }} />
                <h4 style={{ fontFamily: 'var(--font-headline)', margin: 0, color: 'var(--primary)', fontSize: '1rem' }}>
                  بيانات المنشأة الصناعية مقدمة الطلب (معتمدة تلقائياً)
                </h4>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '0.86rem' }}>
                <div>
                  <span style={{ color: 'var(--neutral-500)', display: 'block' }}>اسم المنشأة:</span>
                  <strong style={{ color: 'var(--neutral-800)' }}>{user?.factoryName || 'المنشأة الصناعية'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--neutral-500)', display: 'block' }}>السجل التجاري / الضريبي:</span>
                  <strong style={{ color: 'var(--neutral-800)' }}>{user?.taxId || 'مسجل ومعتمد'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--neutral-500)', display: 'block' }}>الموقع الجغرافي:</span>
                  <strong style={{ color: 'var(--neutral-800)' }}>
                    {[user?.location?.governorate, user?.location?.city].filter(Boolean).join(' - ') || 'جمهورية مصر العربية'}
                  </strong>
                </div>
                <div>
                  <span style={{ color: 'var(--neutral-500)', display: 'block' }}>عميل سابق لـ IMC:</span>
                  <strong style={{ color: '#0055A5' }}>{user?.imcClientId ? 'نعم - عميل معتمد' : 'تسجيل أول مرة'}</strong>
                </div>
              </div>
            </div>

            {/* Request Type Selection (5 interactive cards) */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-headline)', color: 'var(--primary)', fontSize: '1.15rem', marginBottom: '8px' }}>
                ما هو نوع التحدي الصناعي الذي تواجهه؟
              </h3>
              <p style={{ color: 'var(--neutral-600)', fontSize: '0.88rem', marginBottom: '18px' }}>
                اختر التصنيف الأنسب لحالتك الصناعية لتوجيه الأسئلة والفريق الفني المختص بدقة:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                {REQUEST_TYPES.map((type) => {
                  const isSelected = formData.requestType === type.code;
                  return (
                    <div
                      key={type.code}
                      onClick={() => updateForm({ requestType: type.code })}
                      className="choice-card-interactive"
                      style={{
                        padding: '18px 20px',
                        borderRadius: '16px',
                        border: isSelected ? '2px solid #0055A5' : '1.5px solid #e2e8f0',
                        background: isSelected ? 'rgba(0, 85, 165, 0.05)' : '#fff',
                        boxShadow: isSelected ? '0 6px 20px rgba(0, 85, 165, 0.16)' : '0 2px 6px rgba(0,0,0,0.03)',
                        cursor: 'pointer',
                        position: 'relative',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '1.6rem' }}>{type.icon}</span>
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: isSelected ? '6px solid #0055A5' : '2px solid #cbd5e1',
                            background: '#fff',
                          }}
                        />
                      </div>
                      <h4 style={{ fontFamily: 'var(--font-headline)', margin: '0 0 6px', color: isSelected ? '#0055A5' : 'var(--neutral-800)', fontSize: '1.02rem' }}>
                        {type.label}
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--neutral-500)', lineHeight: 1.5 }}>
                        {type.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 2: تفاصيل الطلب (Dynamic per Request Type) */}
        {/* ============================================================== */}
        {currentStep === 2 && (
          <div className="form-step-container">
            {/* Branch 1: Challenge (تحدٍ فني / عطل / هادر) */}
            {formData.requestType === 'challenge' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                    1. ما هو الجزء أو المجال الفني المتأثر بالمشكلة؟ <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <CustomSelect
                    value={formData.reportedAreaCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      const area = CHALLENGE_AREAS.find((a) => a.code === code);
                      updateForm({
                        reportedAreaCode: code,
                        reportedAreaLabel: area ? area.label : '',
                        reportedSymptomCode: '',
                        reportedSymptomLabel: '',
                        symptomDetail: '',
                      });
                    }}
                  >
                    <option value="">-- اختر المجال المتأثر --</option>
                    {CHALLENGE_AREAS.map((a) => (
                      <option key={a.code} value={a.code}>
                        {a.icon} {a.label}
                      </option>
                    ))}
                  </CustomSelect>
                </div>

                {formData.reportedAreaCode && formData.reportedAreaCode !== 'unclear' && (
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                      2. ما هو مظهر أو عرض المشكلة الفنية الرئيسي؟ <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <CustomSelect
                      value={formData.reportedSymptomCode}
                      onChange={(e) => {
                        const code = e.target.value;
                        const symptoms = CHALLENGE_SYMPTOMS[formData.reportedAreaCode] || [];
                        const sym = symptoms.find((s) => s.code === code);
                        updateForm({
                          reportedSymptomCode: code,
                          reportedSymptomLabel: sym ? sym.label : '',
                          symptomDetail: '',
                        });
                      }}
                    >
                      <option value="">-- اختر مظهر العطل أو المشكلة --</option>
                      {(CHALLENGE_SYMPTOMS[formData.reportedAreaCode] || []).map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.label}
                        </option>
                      ))}
                    </CustomSelect>
                  </div>
                )}

                {/* Symptom Details Dropdown (if available for selected symptom) */}
                {formData.reportedSymptomCode && CHALLENGE_SYMPTOM_DETAILS[formData.reportedSymptomCode] && (
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                      3. تفصيل العطل / محددات إضافية (اختياري):
                    </label>
                    <CustomSelect
                      value={formData.symptomDetail}
                      onChange={(e) => updateForm({ symptomDetail: e.target.value })}
                    >
                      <option value="">-- اختر تفصيل أدق إذا رغبت --</option>
                      {CHALLENGE_SYMPTOM_DETAILS[formData.reportedSymptomCode].map((det) => (
                        <option key={det.code} value={det.label}>
                          {det.label}
                        </option>
                      ))}
                    </CustomSelect>
                  </div>
                )}

                {/* Free description */}
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                    {formData.reportedAreaCode === 'unclear' ? (
                      <>
                        وصف المشكلة وحالة خط التشغيل بالتفصيل <span style={{ color: '#dc2626' }}>* (مطلوب)</span>
                      </>
                    ) : (
                      'وصف إضافي حر لحالة الماكينة أو الخط (اختياري):'
                    )}
                  </label>
                  <textarea
                    rows={4}
                    value={formData.freeDescription}
                    onChange={(e) => updateForm({ freeDescription: e.target.value })}
                    placeholder="اشرح ظروف حدوث المشكلة، الماكينة المعنية، أو أي ملاحظات فنية قد تساعد فريق الدعم..."
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', fontFamily: 'inherit' }}
                  />
                </div>
              </div>
            )}

            {/* Branch 2: Improve (تحسين كفاءة التشغيل) */}
            {formData.requestType === 'improve' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                    1. ما هو المجال الذي ترغب في تحسينه وتطويره؟ <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <CustomSelect
                    value={formData.reportedAreaCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      const area = IMPROVE_AREAS.find((a) => a.code === code);
                      updateForm({
                        reportedAreaCode: code,
                        reportedAreaLabel: area ? area.label : '',
                        reportedSymptomCode: '',
                        reportedSymptomLabel: '',
                        symptomDetail: '',
                      });
                    }}
                  >
                    <option value="">-- اختر مجال التطوير المستهدف --</option>
                    {IMPROVE_AREAS.map((a) => (
                      <option key={a.code} value={a.code}>
                        {a.icon} {a.label}
                      </option>
                    ))}
                  </CustomSelect>
                </div>

                {formData.reportedAreaCode && (
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                      2. ما هو هدف التحسين الرئيسي؟ <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <CustomSelect
                      value={formData.reportedSymptomCode}
                      onChange={(e) => {
                        const code = e.target.value;
                        const symptoms = IMPROVE_SYMPTOMS[formData.reportedAreaCode] || [];
                        const sym = symptoms.find((s) => s.code === code);
                        updateForm({
                          reportedSymptomCode: code,
                          reportedSymptomLabel: sym ? sym.label : '',
                          symptomDetail: '',
                        });
                      }}
                    >
                      <option value="">-- اختر الهدف الفني المحدد --</option>
                      {(IMPROVE_SYMPTOMS[formData.reportedAreaCode] || []).map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.label}
                        </option>
                      ))}
                    </CustomSelect>
                  </div>
                )}

                {formData.reportedSymptomCode && IMPROVE_SYMPTOM_DETAILS[formData.reportedSymptomCode] && (
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                      3. تفصيل إضافي لوسيلة التحسين المقترحة:
                    </label>
                    <CustomSelect
                      value={formData.symptomDetail}
                      onChange={(e) => updateForm({ symptomDetail: e.target.value })}
                    >
                      <option value="">-- اختر وسيلة التحسين --</option>
                      {IMPROVE_SYMPTOM_DETAILS[formData.reportedSymptomCode].map((det) => (
                        <option key={det.code} value={det.label}>
                          {det.label}
                        </option>
                      ))}
                    </CustomSelect>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                    تفاصيل وملاحظات إضافية عن الوضع الراهن والمستهدف (اختياري):
                  </label>
                  <textarea
                    rows={4}
                    value={formData.freeDescription}
                    onChange={(e) => updateForm({ freeDescription: e.target.value })}
                    placeholder="وضح ما تأمل تحقيقه من رفع للكفاءة أو التوفير..."
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', fontFamily: 'inherit' }}
                  />
                </div>
              </div>
            )}

            {/* Branch 3: Idea (فكرة منتج أو تطوير ابتكاري) */}
            {formData.requestType === 'idea' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                    1. تصنيف الفرصة الابتكارية <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <CustomSelect
                    value={formData.opportunityType}
                    onChange={(e) => {
                      const code = e.target.value;
                      const opt = IDEA_OPPORTUNITY_TYPES.find((o) => o.code === code);
                      updateForm({ opportunityType: code, opportunityTypeLabel: opt ? opt.label : '' });
                    }}
                  >
                    <option value="">-- اختر نوع الفكرة --</option>
                    {IDEA_OPPORTUNITY_TYPES.map((o) => (
                      <option key={o.code} value={o.code}>
                        {o.label}
                      </option>
                    ))}
                  </CustomSelect>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                    2. اسم المنتج أو الفكرة المقترحة <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.subjectName}
                    onChange={(e) => updateForm({ subjectName: e.target.value })}
                    placeholder="مثال: عبوات صديقة للبيئة قابلة للتحلل الحيوي"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.92rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                    3. شرح الفكرة والجدوى المرجوة منها <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.freeDescription}
                    onChange={(e) => updateForm({ freeDescription: e.target.value })}
                    placeholder="اشرح الميزات التنافسية للفكرة، الخامات المقترحة، أو الدعم الفني المطلوب من IMC لإجراء البحوث والتجارب..."
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', fontFamily: 'inherit' }}
                  />
                </div>
              </div>
            )}

            {/* Branch 4: Localize (تعميق تصنيع بديل مستورد) */}
            {formData.requestType === 'localize' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                    1. نوع المكوّن المستورد المراد تصنيعه محلياً <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <CustomSelect
                    value={formData.opportunityType}
                    onChange={(e) => {
                      const code = e.target.value;
                      const opt = LOCALIZE_OPPORTUNITY_TYPES.find((o) => o.code === code);
                      updateForm({ opportunityType: code, opportunityTypeLabel: opt ? opt.label : '' });
                    }}
                  >
                    <option value="">-- اختر نوع البديل --</option>
                    {LOCALIZE_OPPORTUNITY_TYPES.map((o) => (
                      <option key={o.code} value={o.code}>
                        {o.label}
                      </option>
                    ))}
                  </CustomSelect>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                    2. اسم المكوّن / قطعة الغيار / الخامة المستهدفة <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.subjectName}
                    onChange={(e) => updateForm({ subjectName: e.target.value })}
                    placeholder="مثال: تروس دقيقة من سبائك خاصة لماكينات الغزل"
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.92rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                    3. المواصفات الفنية أو التحديات في التصنيع المحلي (اختياري):
                  </label>
                  <textarea
                    rows={4}
                    value={formData.freeDescription}
                    onChange={(e) => updateForm({ freeDescription: e.target.value })}
                    placeholder="اذكر بلد المنشأ الأصلي، الكميات المستهلكة سنوياً، أو العقبات التي تواجه تصنيعها محلياً..."
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.9rem', fontFamily: 'inherit' }}
                  />
                </div>
              </div>
            )}

            {/* Branch 5: Lab (خدمات معامل واختبارات فنية) */}
            {formData.requestType === 'lab' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                    1. مستوى معرفتك بالاختبار المطلوب
                  </label>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {LAB_KNOWLEDGE_OPTIONS.map((opt) => (
                      <button
                        type="button"
                        key={opt.code}
                        onClick={() => updateForm({ labKnowledge: opt.code })}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: formData.labKnowledge === opt.code ? '2px solid #0055A5' : '1.5px solid #cbd5e1',
                          background: formData.labKnowledge === opt.code ? '#eff6ff' : '#fff',
                          fontWeight: formData.labKnowledge === opt.code ? 700 : 500,
                          color: formData.labKnowledge === opt.code ? '#0055A5' : '#334155',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          fontSize: '0.88rem',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                    2. مجال الفحص المعملي <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <CustomSelect
                    value={formData.labTestAreaCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      const area = LAB_TEST_AREAS.find((a) => a.code === code);
                      updateForm({
                        labTestAreaCode: code,
                        labTestAreaLabel: area ? area.label : '',
                        labTestCode: '',
                        labTestLabel: '',
                        labGoalCode: '',
                      });
                    }}
                  >
                    <option value="">-- اختر مجال المعمل --</option>
                    {LAB_TEST_AREAS.map((a) => (
                      <option key={a.code} value={a.code}>
                        {a.icon} {a.label}
                      </option>
                    ))}
                  </CustomSelect>
                </div>

                {formData.labTestAreaCode && LAB_TESTS_BY_AREA[formData.labTestAreaCode] && (
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                      3. الاختبار المحدد (من قائمة الاختبارات القياسية):
                    </label>
                    <CustomSelect
                      value={formData.labTestCode}
                      onChange={(e) => {
                        const code = e.target.value;
                        const tests = LAB_TESTS_BY_AREA[formData.labTestAreaCode] || [];
                        const t = tests.find((item) => item.code === code);
                        updateForm({ labTestCode: code, labTestLabel: t ? t.label : '' });
                      }}
                    >
                      <option value="">-- اختر الفحص المعملي المحدد --</option>
                      {LAB_TESTS_BY_AREA[formData.labTestAreaCode].map((t) => (
                        <option key={t.code} value={t.code}>
                          {t.label}
                        </option>
                      ))}
                    </CustomSelect>
                  </div>
                )}

                {/* Lab Goal */}
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                    4. الهدف من إجراء الفحص أو الاختبار:
                  </label>
                  <CustomSelect
                    value={formData.labGoalCode}
                    onChange={(e) => {
                      const code = e.target.value;
                      const goals = (formData.labTestAreaCode && LAB_GOALS_BY_AREA[formData.labTestAreaCode]) || LAB_GENERAL_GOALS;
                      const g = goals.find((item) => item.code === code);
                      updateForm({ labGoalCode: code, labGoalLabel: g ? g.label : '' });
                    }}
                  >
                    <option value="">-- اختر الهدف الفني من الفحص --</option>
                    {((formData.labTestAreaCode && LAB_GOALS_BY_AREA[formData.labTestAreaCode]) || LAB_GENERAL_GOALS).map((g) => (
                      <option key={g.code} value={g.code}>
                        {g.label}
                      </option>
                    ))}
                  </CustomSelect>
                </div>

                {/* Sample Mode */}
                <div>
                  <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                    5. نوع العينة المراد فحصها:
                  </label>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    {LAB_SUBJECT_MODES.map((mode) => (
                      <label key={mode.code} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
                        <input
                          type="radio"
                          name="labSubjectMode"
                          value={mode.code}
                          checked={formData.labSubjectMode === mode.code}
                          onChange={() => updateForm({ labSubjectMode: mode.code })}
                        />
                        <span>{mode.label}</span>
                      </label>
                    ))}
                  </div>

                  {formData.labSubjectMode === 'material' && (
                    <CustomSelect
                      value={formData.labMaterialFamily}
                      onChange={(e) => updateForm({ labMaterialFamily: e.target.value })}
                    >
                      <option value="">-- اختر عائلة الخامة --</option>
                      {LAB_MATERIAL_FAMILIES.map((f) => (
                        <option key={f.code} value={f.code}>
                          {f.label}
                        </option>
                      ))}
                    </CustomSelect>
                  )}

                  {formData.labSubjectMode === 'product' && (
                    <CustomSelect
                      value={formData.labProductFamily}
                      onChange={(e) => updateForm({ labProductFamily: e.target.value })}
                    >
                      <option value="">-- اختر عائلة المنتج --</option>
                      {LAB_PRODUCT_FAMILIES.map((f) => (
                        <option key={f.code} value={f.code}>
                          {f.label}
                        </option>
                      ))}
                    </CustomSelect>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 3: الأثر والنتيجة (Impact & Outcome) */}
        {/* ============================================================== */}
        {currentStep === 3 && (
          <div className="form-step-container" style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
            {/* Frequency - Challenge Only */}
            {formData.requestType === 'challenge' && (
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                  1. وتيرة وتكرار حدوث المشكلة / العطل <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  {FREQUENCY_OPTIONS.map((f) => {
                    const isSelected = formData.frequency === f.code;
                    return (
                      <button
                        type="button"
                        key={f.code}
                        onClick={() => updateForm({ frequency: f.code, frequencyLabel: f.label })}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid #0055A5' : '1.5px solid #cbd5e1',
                          background: isSelected ? '#eff6ff' : '#fff',
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? '#0055A5' : 'var(--neutral-800)',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          fontSize: '0.88rem',
                          textAlign: 'center',
                        }}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Affected Scope */}
            <div>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                نطاق التأثير في المنشأة الصناعية
              </label>
              <CustomSelect
                value={formData.affectedScope}
                onChange={(e) => {
                  const code = e.target.value;
                  const opt = AFFECTED_SCOPE_OPTIONS.find((s) => s.code === code);
                  updateForm({ affectedScope: code, affectedScopeLabel: opt ? opt.label : '' });
                }}
              >
                {AFFECTED_SCOPE_OPTIONS.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.label}
                  </option>
                ))}
              </CustomSelect>
            </div>

            {/* Multi-select Impacts for Challenge */}
            {formData.requestType === 'challenge' && (
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                  الآثار التشغيلية والاقتصادية المترتبة على المشكلة (اختر كل ما ينطبق) <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                  {CHALLENGE_IMPACTS.map((imp) => {
                    const isChecked = formData.impactCodes.includes(imp.code);
                    return (
                      <div
                        key={imp.code}
                        onClick={() => toggleImpact(imp.code, imp.label)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '8px',
                          border: isChecked ? '1.5px solid #0055A5' : '1.5px solid #e2e8f0',
                          background: isChecked ? '#eff6ff' : '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '0.88rem',
                          fontWeight: isChecked ? 600 : 400,
                          color: isChecked ? '#0055A5' : 'var(--neutral-700)',
                        }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>{isChecked ? '☑️' : '◻️'}</span>
                        <span>{imp.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Multi-select Benefits for Improve / Idea / Localize */}
            {['improve', 'idea', 'localize'].includes(formData.requestType) && EXPECTED_BENEFITS[formData.requestType] && (
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                  المزايا والعوائد المتوقعة من تنفيذ الطلب (اختر كل ما ينطبق) <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                  {EXPECTED_BENEFITS[formData.requestType].map((ben) => {
                    const isChecked = formData.expectedBenefitCodes.includes(ben.code);
                    return (
                      <div
                        key={ben.code}
                        onClick={() => toggleBenefit(ben.code, ben.label)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '8px',
                          border: isChecked ? '1.5px solid #0055A5' : '1.5px solid #e2e8f0',
                          background: isChecked ? '#eff6ff' : '#fff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontSize: '0.88rem',
                          fontWeight: isChecked ? 600 : 400,
                          color: isChecked ? '#0055A5' : 'var(--neutral-700)',
                        }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>{isChecked ? '☑️' : '◻️'}</span>
                        <span>{ben.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Desired Outcome */}
            {DESIRED_OUTCOMES[formData.requestType] && (
              <div>
                <label style={{ display: 'block', fontWeight: 700, marginBottom: '8px', color: 'var(--neutral-800)' }}>
                  ما هي النتيجة أو المخرج الفني النهائي الذي تتوقعه من IMC؟
                </label>
                <CustomSelect
                  value={formData.desiredOutcome}
                  onChange={(e) => {
                    const code = e.target.value;
                    const list = DESIRED_OUTCOMES[formData.requestType] || [];
                    const opt = list.find((o) => o.code === code);
                    updateForm({ desiredOutcome: code, desiredOutcomeLabel: opt ? opt.label : '' });
                  }}
                >
                  <option value="">-- اختر المخرج المتوقع --</option>
                  {DESIRED_OUTCOMES[formData.requestType].map((o) => (
                    <option key={o.code} value={o.code}>
                      {o.label}
                    </option>
                  ))}
                </CustomSelect>
              </div>
            )}

            {/* Optional Quantitative Metric Section (Pixel-matched to user specification) */}
            {(() => {
              const availableMetrics =
                formData.requestType === 'challenge'
                  ? [...(METRIC_CONFIG.challenge || []), ...(METRIC_CONFIG.benefit || [])]
                  : [...(METRIC_CONFIG.benefit || []), ...(METRIC_CONFIG.challenge || [])];

              if (!formData.enableMetric) {
                return (
                  <div
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '0.98rem', color: '#002B54' }}>
                        {formData.requestType === 'challenge'
                          ? 'هل يتوفر لديك قياس كمي للأثر أو التوقف؟'
                          : 'هل عندك رقم مستهدف للتحسن؟'}
                      </span>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          color: '#64748b',
                          background: '#f1f5f9',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 600,
                        }}
                      >
                        اختياري
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const defaultMetric =
                          formData.requestType === 'challenge'
                            ? availableMetrics[0]
                            : availableMetrics.find((m) => m.code === 'target_energy_saving') || availableMetrics[0];

                        updateForm({
                          enableMetric: true,
                          metricType: defaultMetric?.code || 'target_energy_saving',
                          metricTypeLabel: defaultMetric?.label || 'خفض مستهدف لاستهلاك الطاقة',
                          metricUnit: defaultMetric?.units?.[0] || '%',
                        });
                      }}
                      style={{
                        padding: '7px 16px',
                        borderRadius: '8px',
                        border: '1.5px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#0055A5',
                        fontFamily: 'var(--font-headline)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#0055A5';
                        e.currentTarget.style.background = '#f0f7ff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.background = '#ffffff';
                      }}
                    >
                      <span style={{ fontSize: '1rem', fontWeight: 800 }}>+</span>
                      <span>إضافة رقم أو مستهدف كمي</span>
                    </button>
                  </div>
                );
              }

              return (
                <div
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '20px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  }}
                >
                  {/* Top Bar matching screenshot */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-headline)',
                          fontWeight: 800,
                          fontSize: '1rem',
                          color: '#002B54',
                        }}
                      >
                        {formData.requestType === 'challenge'
                          ? 'هل يتوفر لديك قياس كمي للأثر أو التوقف؟'
                          : 'هل عندك رقم مستهدف للتحسن؟'}
                      </span>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          color: '#64748b',
                          background: '#f1f5f9',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 600,
                        }}
                      >
                        اختياري
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        updateForm({
                          enableMetric: false,
                          metricType: '',
                          metricTypeLabel: '',
                          metricValue: '',
                          metricUnit: '',
                          metricPeriod: '',
                        });
                      }}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: '1.5px solid #cbd5e1',
                        background: '#ffffff',
                        color: '#0055A5',
                        fontFamily: 'var(--font-headline)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#dc2626';
                        e.currentTarget.style.color = '#dc2626';
                        e.currentTarget.style.background = '#fef2f2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#cbd5e1';
                        e.currentTarget.style.color = '#0055A5';
                        e.currentTarget.style.background = '#ffffff';
                      }}
                    >
                      <span style={{ fontSize: '0.9rem' }}>✕</span>
                      <span>إلغاء القياس ومسح الرقم</span>
                    </button>
                  </div>

                  {/* Row 1: Dropdown (Right) & Number Value (Left) */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
                    <div>
                      <CustomSelect
                        value={formData.metricType}
                        onChange={(e) => {
                          const code = e.target.value;
                          const m = availableMetrics.find((x) => x.code === code);
                          updateForm({
                            metricType: code,
                            metricTypeLabel: m ? m.label : '',
                            metricUnit: m?.units?.[0] || '%',
                          });
                        }}
                      >
                        <option value="">-- اختر نوع المؤشر أو المستهدف --</option>
                        {availableMetrics.map((m) => (
                          <option key={m.code} value={m.code}>
                            {m.label}
                          </option>
                        ))}
                      </CustomSelect>
                    </div>

                    <div>
                      <input
                        type="number"
                        step="any"
                        value={formData.metricValue}
                        onChange={(e) => updateForm({ metricValue: e.target.value })}
                        placeholder="11"
                        style={{
                          width: '100%',
                          padding: '12px 14px',
                          borderRadius: '14px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.95rem',
                          fontFamily: 'inherit',
                          color: '#1e293b',
                          background: '#fff',
                          textAlign: 'left',
                        }}
                      />
                    </div>
                  </div>

                  {/* Row 2: Label + Full Width Unit Select (as in user screenshot) */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <label style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1e293b' }}>
                        وحدة القياس
                      </label>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#dc2626',
                          background: '#fee2e2',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 700,
                        }}
                      >
                        مطلوب
                      </span>
                    </div>

                    <CustomSelect
                      value={formData.metricUnit || '%'}
                      onChange={(e) => updateForm({ metricUnit: e.target.value })}
                    >
                      <option value="%">%</option>
                      <option value="ساعة">ساعة</option>
                      <option value="دقيقة">دقيقة</option>
                      <option value="طن">طن</option>
                      <option value="كجم">كجم</option>
                      <option value="لتر">لتر</option>
                      <option value="متر">متر</option>
                      <option value="قطعة">قطعة</option>
                      <option value="عبوة">عبوة</option>
                      <option value="جنيه">جنيه</option>
                      <option value="kWh">kWh</option>
                      <option value="MWh">MWh</option>
                    </CustomSelect>
                  </div>

                  {/* Bottom Caption matching screenshot */}
                  <p
                    style={{
                      margin: '2px 0 0',
                      fontSize: '0.82rem',
                      color: '#64748b',
                      textAlign: 'right',
                      lineHeight: 1.5,
                    }}
                  >
                    يتم حفظ القيمة والوحدة والفترة كحقول مستقلة لقياسها وتحليلها بدقة.
                  </p>
                </div>
              );
            })()}
          </div>
        )}

        {/* ============================================================== */}
        {/* STEP 4: مراجعة وإرسال (Review & Consent) */}
        {/* ============================================================== */}
        {currentStep === 4 && (
          <div className="form-step-container">
            <h3 style={{ fontFamily: 'var(--font-headline)', color: 'var(--primary)', fontSize: '1.2rem', marginBottom: '16px' }}>
              مراجعة وتأكيد بيانات الطلب الصناعي قبل الإرسال
            </h3>

            {/* Summary Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              {/* Card 1: Factory & Request Type */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px 20px', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ fontFamily: 'var(--font-headline)', margin: 0, color: 'var(--primary)', fontSize: '0.98rem' }}>
                    1. بيانات المنشأة ونوع الطلب
                  </h4>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    style={{ background: 'none', border: 'none', color: '#0055A5', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    تعديل
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', fontSize: '0.86rem' }}>
                  <div>المنشأة: <strong>{user?.factoryName}</strong></div>
                  <div>نوع الطلب: <strong>{REQUEST_TYPES.find((r) => r.code === formData.requestType)?.label}</strong></div>
                  <div>نطاق التأثير: <strong>{formData.affectedScopeLabel || 'خط إنتاج محدد'}</strong></div>
                </div>
              </div>

              {/* Card 2: Request Details */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px 20px', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ fontFamily: 'var(--font-headline)', margin: 0, color: 'var(--primary)', fontSize: '0.98rem' }}>
                    2. التفاصيل الفنية المسجلة
                  </h4>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    style={{ background: 'none', border: 'none', color: '#0055A5', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    تعديل
                  </button>
                </div>
                <div style={{ fontSize: '0.86rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {formData.reportedAreaLabel && <div>المجال الفني: <strong>{formData.reportedAreaLabel}</strong></div>}
                  {formData.reportedSymptomLabel && <div>المظهر / الهدف: <strong>{formData.reportedSymptomLabel}</strong></div>}
                  {formData.symptomDetail && <div>التفصيل: <strong>{formData.symptomDetail}</strong></div>}
                  {formData.subjectName && <div>اسم المكوّن / الفكرة: <strong>{formData.subjectName}</strong></div>}
                  {formData.freeDescription && <div>الوصف التفصيلي: <span style={{ color: 'var(--neutral-600)' }}>{formData.freeDescription}</span></div>}
                </div>
              </div>

              {/* Card 3: Impact & Outcome */}
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px 20px', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ fontFamily: 'var(--font-headline)', margin: 0, color: 'var(--primary)', fontSize: '0.98rem' }}>
                    3. الأثر والمخرجات المرجوة
                  </h4>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    style={{ background: 'none', border: 'none', color: '#0055A5', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    تعديل
                  </button>
                </div>
                <div style={{ fontSize: '0.86rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {formData.frequencyLabel && <div>وتيرة التكرار: <strong>{formData.frequencyLabel}</strong></div>}
                  {formData.impactLabels.length > 0 && <div>الآثار المترتبة: <strong>{formData.impactLabels.join('، ')}</strong></div>}
                  {formData.expectedBenefitLabels.length > 0 && <div>المزايا المتوقعة: <strong>{formData.expectedBenefitLabels.join('، ')}</strong></div>}
                  {formData.desiredOutcomeLabel && <div>المخرج المرجو من IMC: <strong>{formData.desiredOutcomeLabel}</strong></div>}
                  {formData.enableMetric && formData.metricValue && (
                    <div>القياس الكمي: <strong>{formData.metricValue} {formData.metricUnit} ({formData.metricTypeLabel})</strong></div>
                  )}
                </div>
              </div>
            </div>

            {/* Mandatory Consent Checkbox */}
            <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '10px', padding: '16px 20px', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => updateForm({ consent: e.target.checked })}
                  style={{ width: '20px', height: '20px', marginTop: '2px', accentColor: '#0055A5' }}
                />
                <span style={{ fontSize: '0.88rem', color: 'var(--neutral-800)', lineHeight: 1.6 }}>
                  <strong>إقرار وتفويض: </strong>
                  أقر بصحة البيانات المسجلة أعلاه، وأوافق على مشاركتها مع المختصين واستشاريي مركز تحديث الصناعة لدراسة الحالة الفنية والتواصل مع المنشأة لتقديم الدعم والحلول المناسبة.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* Navigation Buttons */}
        {/* ============================================================== */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="btn-back-landing"
              style={{ padding: '10px 22px', fontSize: '0.9rem' }}
            >
              السابق
            </button>
          ) : (
            <button
              type="button"
              onClick={onCancel}
              className="btn-back-landing"
              style={{ padding: '10px 22px', fontSize: '0.9rem' }}
            >
              إلغاء
            </button>
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="navbar-nav-pill active"
              style={{ padding: '10px 26px', fontSize: '0.92rem' }}
            >
              التالي ➔
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.consent}
              className="navbar-nav-pill active"
              style={{
                padding: '12px 32px',
                fontSize: '0.95rem',
                opacity: isSubmitting || !formData.consent ? 0.6 : 1,
                cursor: isSubmitting || !formData.consent ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? 'جاري حفظ الطلب في قاعدة البيانات...' : '✓ تأكيد وإرسال الطلب رسمياً'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

