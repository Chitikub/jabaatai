// src/app/components/Footer.js
'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={footerStyle}>
      <style>{`
        .footer-link {
          text-decoration: none;
          color: #64748B;
          transition: all 0.2s ease;
          font-weight: 500;
        }
        .footer-link:hover {
          color: #0F172A;
          transform: translateY(-1px);
        }
        .social-icon {
          text-decoration: none;
          filter: grayscale(1);
          transition: all 0.3s ease;
          opacity: 0.7;
        }
        .social-icon:hover {
          filter: grayscale(0);
          opacity: 1;
          transform: scale(1.1);
        }
        @media (max-width: 640px) {
          .footer-content {
            flex-direction: column;
            text-align: center;
            gap: 25px !important;
          }
          .footer-right {
            align-items: center !important;
          }
        }
      `}</style>

      <div className="footer-content" style={containerStyle}>
        {/* ฝั่งซ้าย: Copyright และ Legal Links */}
        <div style={leftSectionStyle}>
          <span style={copyrightStyle}>© 2026 Mood Location Finder</span>
          <div style={linkGroupStyle}>
            <Link href="/terms" className="footer-link">Terms</Link>
            <Link href="/privacy" className="footer-link">Privacy</Link>
            <Link href="/cookies" className="footer-link">Cookies</Link>
          </div>
        </div>

        {/* ฝั่งขวา: Contact และ Social Icons */}
        <div className="footer-right" style={rightSectionStyle}>
          <Link href="/contact" style={contactLinkStyle}>
            Contact Us
          </Link>
          <div style={socialGroupStyle}>
            <Link href="#" className="social-icon" title="Call">📞</Link>
            <Link href="#" className="social-icon" style={{ fontSize: '0.9rem', color: '#1877F2' }}>Facebook</Link>
            <Link href="#" className="social-icon" style={{ fontSize: '0.9rem', color: '#E4405F' }}>Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// --- Styles ---
const footerStyle = {
  width: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  borderTop: '1px solid rgba(226, 232, 240, 0.8)',
  padding: '30px 0',
  marginTop: 'auto', // ช่วยให้ footer อยู่ล่างสุดเสมอถ้าใช้ flex ใน layout
};

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 8%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '20px',
};

const leftSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const copyrightStyle = {
  fontSize: '0.85rem',
  fontWeight: '600',
  color: '#1E293B',
  letterSpacing: '-0.01em',
};

const linkGroupStyle = {
  display: 'flex',
  gap: '15px',
  fontSize: '0.8rem',
};

const rightSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '12px',
};

const contactLinkStyle = {
  textDecoration: 'none',
  color: '#0F172A',
  fontWeight: '700',
  fontSize: '0.9rem',
  paddingBottom: '2px',
  borderBottom: '2px solid #0F172A',
};

const socialGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '18px',
  fontSize: '1.1rem',
};