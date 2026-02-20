'use client';
import './globals.css';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Mali } from 'next/font/google';
import { usePathname } from 'next/navigation';

const mali = Mali({
  weight: ['200', '300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin', 'thai'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isAdminPage = pathname === '/admin';

  return (
    <html lang="th">
      <body className={mali.className} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0 }}>
        {!isAdminPage && <Navbar />}
        <main style={{ flex: 1 }}>
          {children}
        </main>
        {!isAdminPage && <Footer />}
      </body>
    </html>
  );
}