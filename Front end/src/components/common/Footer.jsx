export default function Footer({ onNavigateToAuth = () => {} }) {
  return (
    <footer className="app-footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          {/* Column 1: Brand & About */}
          <div className="footer-col footer-col-brand">
            <div className="footer-logo-badge">
              <img
                src="/imc-logo-transparent.png"
                alt="مركز تحديث الصناعة - IMC"
                className="footer-logo-img"
              />
            </div>
            <h3 className="footer-brand-title">IMC</h3>
            <p className="footer-brand-desc">
              منصة لعرض ودراسة التحديات الصناعية ودعم المنشآت في تحديد فرص التحسين والتطوير.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col footer-col-links">
            <h4 className="footer-col-title">
              <span className="footer-title-bar"></span>
              روابط سريعة
            </h4>
            <ul className="footer-links-list">
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  الرئيسية
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => {
                    const el = document.getElementById('yellow-cards-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  عن المنصة
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => onNavigateToAuth('register')}
                >
                  تسجيل منشأة
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="footer-link-btn"
                  onClick={() => onNavigateToAuth('login')}
                >
                  تسجيل الدخول
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="footer-col footer-col-contact">
            <h4 className="footer-col-title">
              <span className="footer-title-bar"></span>
              تواصل معنا
            </h4>
            <div className="footer-contact-items">
              {/* Phone */}
              <div className="footer-contact-row">
                <div className="contact-icon-box">📞</div>
                <div>
                  <strong className="contact-label">هاتف:</strong>
                  <a
                    href="tel:+20225777777"
                    className="contact-val"
                    dir="ltr"
                    style={{ textAlign: 'right', display: 'inline-block', textDecoration: 'none', color: 'inherit' }}
                  >
                    +20 2 25777777
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="footer-contact-row">
                <div className="contact-icon-box">✉️</div>
                <div>
                  <strong className="contact-label">البريد:</strong>
                  <a
                    href="mailto:challenges@imc.gov.eg"
                    className="contact-val"
                    dir="ltr"
                    style={{ textAlign: 'right', display: 'inline-block', textDecoration: 'none', color: 'inherit' }}
                  >
                    challenges@imc.gov.eg
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-container" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <p className="footer-copyright" style={{ fontSize: '0.86rem' }}>
            © 2026 مركز تحديث الصناعة (IMC) – جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
}
