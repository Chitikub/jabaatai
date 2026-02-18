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
  return (
    <html lang="th">
      <body className={mali.className} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0 }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}