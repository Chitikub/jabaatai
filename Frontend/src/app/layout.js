// src/app/layout.js
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', margin: 0 }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}