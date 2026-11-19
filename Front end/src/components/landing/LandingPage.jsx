import Footer from '../common/Footer';

export default function LandingPage({ onNavigateToAuth = () => {} }) {
  const scrollToYellowCards = () => {
    const el = document.getElementById('yellow-cards-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page">
      {/* ========================================================= */}
      {/* 1. HERO SECTION (شكل مميز وعبارة موجهة)                   */}
      {/* ========================================================= */}
      <section className="landing-hero" id="hero-section">
        <div className="landing-hero-backdrop">
          <div className="hero-glow hero-glow-1"></div>
          <div className="hero-glow hero-glow-2"></div>
          <div className="hero-grid-pattern"></div>
        </div>

        <div className="landing-hero-container">
          {/* Main User Requested Headline */}
          <h1 className="hero-main-title">
            هل تواجه منشأتك تحديات تؤثر على الإنتاج أو تعيق تطورها؟{' '}
            <span className="hero-highlight-phrase">
              اعرض تحديك، وابدأ رحلة الوصول إلى الحل.
            </span>
          </h1>

          {/* Subtitle / Explanatory Copy */}
          <p className="hero-lead-text">
            تتيح لك منصة تحديات الصناعة عرض التحديات التي تواجه منشأتك وتوثيقها، لتتم دراستها وتحليلها بواسطة المتخصصين، وتحديد الحلول المناسبة لكل حالة، مع إمكانية المساهمة في تنفيذها ومتابعة تطبيقها وفقًا لطبيعة التحدي ونتائج الدراسة.
          </p>

          {/* Action Boxes / Buttons (2 فقط كما طُلب) */}
          <div className="hero-cta-group hero-cta-two-boxes">
            {/* زر 1: تسجيل المشكلة «سجّل منشأتك وابدأ بعرض تحدياتها» */}
            <button
              type="button"
              className="hero-action-card hero-action-card-gold"
              onClick={() => onNavigateToAuth('register')}
            >
              <div className="hero-action-card-icon">
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
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
              </div>
              <div className="hero-action-card-text">
                <span className="hero-action-card-title">تسجيل المشكلة</span>
                <span className="hero-action-card-subtitle">«سجّل منشأتك وابدأ بعرض تحدياتها»</span>
              </div>
              <div className="hero-action-card-arrow">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transform: 'scaleX(-1)' }}
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </button>

            {/* زر 2: تسجيل المنشأة «تسجيل الدخول» */}
            <button
              type="button"
              className="hero-action-card hero-action-card-blue"
              onClick={() => onNavigateToAuth('login')}
            >
              <div className="hero-action-card-icon">
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
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" x2="3" y1="12" y2="12" />
                </svg>
              </div>
              <div className="hero-action-card-text">
                <span className="hero-action-card-title">تسجيل الدخول</span>
                <span className="hero-action-card-subtitle">«تسجيل المنشأة»</span>
              </div>
              <div className="hero-action-card-arrow">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transform: 'scaleX(-1)' }}
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </button>
          </div>

          {/* Quick Metrics / Institutional Trust Metrics */}
          <div className="hero-trust-metrics">
            <div className="trust-metric-box">
              <span className="metric-number">16+</span>
              <span className="metric-label">قطاعاً صناعياً مدعوماً</span>
            </div>
            <div className="trust-metric-divider"></div>
            <div className="trust-metric-box">
              <span className="metric-number">100%</span>
              <span className="metric-label">استشارات معتمدة مجانية</span>
            </div>
            <div className="trust-metric-divider"></div>
            <div className="trust-metric-box">
              <span className="metric-number">سرية تامة</span>
              <span className="metric-label">حماية مطلقة لبيانات منشأتك</span>
            </div>
            <div className="trust-metric-divider"></div>
            <div className="trust-metric-box">
              <span className="metric-number">دعم حكومي</span>
              <span className="metric-label">ذراع وزارة التجارة والصناعة</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. THE TWO YELLOW CARDS (كارتين باللون الأصفر الخاص بالهوية) */}
      {/* ========================================================= */}
      <section className="landing-yellow-section" id="yellow-cards-section">
        <div className="yellow-cards-grid">
          {/* ---------------- CARD 1: فهم وتشخيص التحديات الصناعية ---------------- */}
          <div className="yellow-card yellow-card-owner">
            <div className="yellow-card-header">
              <div className="yellow-card-icon-wrap">
                <span className="yellow-card-emoji">⚙️</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="yellow-card-title">
              كل تحدٍ صناعي يستحق أن يُفهم قبل البحث عن حل.
            </h3>

            <p className="yellow-card-body">
              قد تواجه منشأتك تحديات تؤثر على كفاءة الإنتاج، أو استخدام الموارد، أو جودة المنتجات، أو قدرتها على التطور. ومن خلال منصة تحديات الصناعة، يمكنك توثيق هذه التحديات وإتاحتها للدراسة والتحليل من خلال المتخصصين، للوصول إلى توصيات وحلول تتناسب مع طبيعة كل حالة.
            </p>

            <div className="yellow-card-features">
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--blue-950)', marginBottom: '4px' }}>
                ما الذي يمكن دراسته؟
              </div>
              <div className="yellow-feature-item">
                <span className="yellow-check-circle">✓</span>
                <span>تحديات العمليات والإنتاج</span>
              </div>
              <div className="yellow-feature-item">
                <span className="yellow-check-circle">✓</span>
                <span>تحديات استخدام الخامات والموارد</span>
              </div>
              <div className="yellow-feature-item">
                <span className="yellow-check-circle">✓</span>
                <span>تحديات الجودة والكفاءة الصناعية</span>
              </div>
              <div className="yellow-feature-item">
                <span className="yellow-check-circle">✓</span>
                <span>تحديات التطوير والتوسع الصناعي</span>
              </div>
            </div>

            <div className="yellow-card-action">
              <button
                type="button"
                className="yellow-card-btn dark"
                onClick={() => onNavigateToAuth('register')}
              >
                <span>سجّل منشأتك وابدأ بعرض تحدياتها</span>
                <span className="btn-arrow" style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>➔</span>
              </button>
            </div>
          </div>

          {/* ---------------- CARD 2: خبرات متخصصة لدراسة التحديات ---------------- */}
          <div className="yellow-card yellow-card-support">
            <div className="yellow-card-header">
              <div className="yellow-card-icon-wrap">
                <span className="yellow-card-emoji">🛡️</span>
              </div>
            </div>

            <h3 className="yellow-card-title">
              خبرات متخصصة لدراسة التحديات الصناعية
            </h3>

            <p className="yellow-card-body">
              تتيح المنصة للمنشآت الصناعية عرض التحديات التي تواجهها، لتتم دراستها والاستفادة من الخبرات المتخصصة في تحليل أسبابها وتحديد فرص التحسين والحلول المناسبة، وفقًا لطبيعة كل تحدٍ واحتياجات المنشأة.
            </p>

            <div className="yellow-card-features">
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--blue-950)', marginBottom: '4px' }}>
                ما الذي تسعى المنصة إلى تقديمه؟
              </div>
              <div className="yellow-feature-item">
                <span className="yellow-check-circle">✓</span>
                <span>دراسة التحديات وتحليل أسبابها</span>
              </div>
              <div className="yellow-feature-item">
                <span className="yellow-check-circle">✓</span>
                <span>الاستفادة من الخبرات المتخصصة</span>
              </div>
              <div className="yellow-feature-item">
                <span className="yellow-check-circle">✓</span>
                <span>تحديد فرص التحسين والحلول المناسبة</span>
              </div>
              <div className="yellow-feature-item">
                <span className="yellow-check-circle">✓</span>
                <span>دعم المنشآت في مسارات المعالجة والتطوير</span>
              </div>
            </div>

            <div className="yellow-card-action">
              <button
                type="button"
                className="yellow-card-btn dark"
                onClick={() => onNavigateToAuth('register')}
              >
                <span>انضم لمنظومة المنشآت الصناعية المعتمدة</span>
                <span className="btn-arrow" style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>➔</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. HOW IT WORKS / 4-STEP FACTORY JOURNEY                  */}
      {/* ========================================================= */}
      <section className="landing-steps-section" id="steps-section">
        <div className="steps-container">
          <div className="steps-header">
            <span className="steps-badge">
              <span className="steps-badge-sparkle">✦</span> رحلة التحديات الصناعية
            </span>
            <h2 className="steps-title">كيف تساعدك منصة IMC في دراسة التحديات الصناعية؟</h2>
            <p className="steps-subtitle">
              رحلة تبدأ بعرض التحدي، وتمتد إلى دراسته وتحديد المسار المناسب للتعامل معه.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-card-glass-glow"></div>
              <div className="step-number">01</div>
              <h4 className="step-title">تسجيل حساب المنشأة</h4>
              <p className="step-desc">
                أنشئ حسابًا لمنشأتك على المنصة، وأدخل البيانات الأساسية المطلوبة لبدء الاستفادة من خدماتها.
              </p>
            </div>

            <div className="step-card">
              <div className="step-card-glass-glow"></div>
              <div className="step-number">02</div>
              <h4 className="step-title">عرض التحدي الصناعي</h4>
              <p className="step-desc">
                وضّح التحدي الذي تواجهه منشأتك من خلال نموذج مخصص لتسجيل تفاصيله والمعلومات المرتبطة به.
              </p>
            </div>

            <div className="step-card">
              <div className="step-card-glass-glow"></div>
              <div className="step-number">03</div>
              <h4 className="step-title">دراسة التحدي وتحليله</h4>
              <p className="step-desc">
                تتم دراسة التحدي وتحليل أسبابه بواسطة المتخصصين، لفهم طبيعته وتحديد فرص التحسين المناسبة.
              </p>
            </div>

            <div className="step-card">
              <div className="step-card-glass-glow"></div>
              <div className="step-number">04</div>
              <h4 className="step-title">تحديد الحلول ومتابعة المعالجة</h4>
              <p className="step-desc">
                تُحدد التوصيات والحلول المناسبة وفقًا لنتائج الدراسة، وقد تشمل بعض الحالات المساهمة في التنفيذ ومتابعة النتائج.
              </p>
            </div>
          </div>

          <div className="steps-bottom-action">
            <button
              type="button"
              className="landing-btn-solid steps-cta-btn"
              onClick={() => onNavigateToAuth('register')}
            >
              <span>ابدأ تسجيل منشأتك الآن</span>
              <span style={{ display: 'inline-block', transform: 'scaleX(-1)', marginRight: '8px' }}>➔</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. OFFICIAL IMC FOOTER (بيانات مركز تحديث الصناعة الكاملة) */}
      {/* ========================================================= */}
      <Footer onNavigateToAuth={onNavigateToAuth} />
    </div>
  );
}

