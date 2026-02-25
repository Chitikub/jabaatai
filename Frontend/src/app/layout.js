'use client';
import { usePathname } from 'next/navigation';
import './globals.css';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Mali } from 'next/font/google';

const mali = Mali({
  weight: ['200', '300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'thai'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // แก้ไขบรรทัดนี้: ลบ pathname === '/profile' ออก เพื่อให้หน้าโปรไฟล์แสดง Navbar/Footer
  const isAdminPage = pathname.startsWith('/admin');

  return (
    <html lang="th">
      <body className={mali.className} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0 }}>
        {/* ถ้าไม่ใช่หน้า Admin ให้แสดง Navbar */}
        {!isAdminPage && <Navbar />}
        
        <main style={{ flex: 1, marginTop: isAdminPage ? '0' : '120px' }}>
          {children}
        </main>

        {/* ถ้าไม่ใช่หน้า Admin ให้แสดง Footer */}
        {!isAdminPage && <Footer />}
      </body>
    </html>
  );
}