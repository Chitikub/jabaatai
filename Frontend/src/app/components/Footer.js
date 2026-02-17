// src/app/components/Footer.js
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      backgroundColor: '#FFFFFF',
      padding: '20px 8%',
      borderTop: '1px solid #F3E8FF',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap', // รองรับมือถือให้ลงมาต่อแถวกัน
      gap: '15px',
      fontSize: '0.9rem',
      color: '#6B7280'
    }}>
      {/* ฝั่งซ้าย: Copyright และ Link พื้นฐาน */}
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <span>© 2026 Mood Location Finder</span>
        <Link href="/terms" style={{ textDecoration: 'none', color: '#6B7280' }}>Terms</Link>
        <Link href="/privacy" style={{ textDecoration: 'none', color: '#6B7280' }}>Privacy</Link>
        <Link href="/cookies" style={{ textDecoration: 'none', color: '#6B7280' }}>Cookies</Link>
      </div>

      {/* ฝั่งขวา: Contact และ Social Icons */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-end',
        gap: '5px' 
      }}>
        <Link href="/contact" style={{ 
          textDecoration: 'none', 
          color: '#374151', 
          fontWeight: '600',
          borderBottom: '1px solid #374151'
        }}>
          Contact
        </Link>
        <div style={{ display: 'flex', gap: '15px', marginTop: '5px', fontSize: '1.2rem' }}>
          <Link href="#" style={{ textDecoration: 'none', color: '#6D28D9' }}>📞</Link>
          <Link href="#" style={{ textDecoration: 'none', color: '#6D28D9' }}> Facebook </Link>
          <Link href="#" style={{ textDecoration: 'none', color: '#6D28D9' }}> Instragram </Link>
        </div>
      </div>
    </footer>
  );
}