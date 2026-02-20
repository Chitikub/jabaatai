'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function LoginPage() {
  const router = useRouter();
  const [isSwitching, setIsSwitching] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => { setIsVisible(true); }, []);

  const handleSwitchPage = (path) => {
    setIsSwitching(true);
    setTimeout(() => { router.push(path); }, 150);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('userLogin'));
        window.dispatchEvent(new Event('storage'));

        // --- แจ้งเตือนสำเร็จ (สีเขียว) ---
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          text: 'ยินดีต้อนรับกลับมาครับ! 🔑',
          showConfirmButton: false,
          timer: 1500,
          iconColor: '#10B981', // สีเขียว
          customClass: {
            popup: 'rounded-card'
          }
        });

        // ตรวจสอบว่าเป็น admin หรือไม่
        const isAdmin = data.user?.role === "admin" || data.user?.email === "admin@gmail.com";

        setTimeout(() => {
          if (isAdmin) {
            router.push('/admin');
          } else {
            router.push('/');
          }
        }, 1500);

      } else {
        // --- แจ้งเตือนไม่สำเร็จ (สีแดง) ---
        Swal.fire({
          icon: 'error',
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          text: data.error || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
          confirmButtonColor: '#EF4444', // สีแดง
          iconColor: '#EF4444',
        });
      }
    } catch (error) {
      // --- แจ้งเตือน Error ระบบ (สีแดง) ---  
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้',
        confirmButtonColor: '#EF4444',
      });
    }
  };

  return (
    <main style={mainBgStyle}>
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .profile-container { 
          animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        .btn-hover { transition: all 0.3s ease; }
        .btn-hover:hover { transform: translateY(-2px); filter: brightness(1.1); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .swal-rounded { border-radius: 30px !important; }
      `}</style>

      <div className={isVisible ? 'page-fade' : ''} style={containerStyle}>
        <div style={toggleContainerStyle}>
          <div style={{
            ...slidingBgStyle,
            left: isSwitching ? '4px' : '50%',
            background: 'linear-gradient(90deg, #FCA5A5, #F87171)',
            transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 15px rgba(248, 113, 113, 0.3)'
          }}></div>
          <div onClick={() => handleSwitchPage('/signup')} style={{ ...toggleTextStyle, color: '#9ca3af', cursor: 'pointer' }}>สมัครสมาชิก</div>
          <div style={{ ...toggleTextStyle, color: '#fff' }}>เข้าสู่ระบบ</div>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '32px', marginTop: '10px' }}>
          {['G', 'f', 'A'].map((icon, i) => (
            <div key={i} className="btn-hover" style={socialButtonStyle}>{icon}</div>
          ))}
        </div>

        <div style={dividerStyle}>
          <div style={lineStyle}></div>
          <span style={{ padding: '0 15px', color: '#cbd5e1', fontSize: '0.8rem' }}>หรือเข้าสู่ระบบด้วย Email</span>
          <div style={lineStyle}></div>
        </div>

        <form onSubmit={handleLogin} style={formWrapperStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email Address</label>
            <div className="input-focus" style={inputContainerStyle}>
              <span style={{ color: '#9ca3af', marginRight: '10px' }}>📧</span>
              <input type="email" style={inputFieldStyle} placeholder="example@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <div className="input-focus" style={inputContainerStyle}>
              <span style={{ color: '#9ca3af', marginRight: '10px' }}>🔒</span>
              <input type="password" style={{ ...inputFieldStyle, fontFamily: 'sans-serif' }} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          <div style={optionsStyle}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', color: '#6b7280' }}>
              <input type="checkbox" style={{ accentColor: '#F87171' }} /> จดจำฉันไว้
            </label>
            <span onClick={() => router.push('/forgot-password')} style={{ fontSize: '0.85rem', color: '#F87171', fontWeight: '600', cursor: 'pointer' }}>ลืมรหัสผ่าน?</span>
          </div>

          <button type="submit" className="btn-hover" style={{ ...submitButtonStyle, background: 'linear-gradient(135deg, #FCA5A5, #F87171)', marginTop: '20px' }}>เข้าสู่ระบบ</button>
        </form>

        <p style={{ marginTop: '25px', fontSize: '0.9rem', color: '#94a3b8' }}>ยังไม่มีบัญชี? <span onClick={() => handleSwitchPage('/signup')} style={{ color: '#F87171', fontWeight: '700', cursor: 'pointer' }}>สร้างบัญชีใหม่</span></p>
      </div>
    </main>
  );
}

// --- Styles (คงเดิม) ---
const mainBgStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', padding: '40px 20px' };
const containerStyle = { backgroundColor: '#ffffff', width: '100%', maxWidth: '480px', borderRadius: '40px', padding: '50px 40px', boxShadow: '0 25px 80px rgba(0, 0, 0, 0.07)', border: '1px solid #f8f9fa', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const toggleContainerStyle = { display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '25px', padding: '5px', position: 'relative', cursor: 'pointer', height: '56px', alignItems: 'center', width: '100%', maxWidth: '340px', marginBottom: '30px' };
const slidingBgStyle = { position: 'absolute', width: 'calc(50% - 10px)', height: 'calc(100% - 10px)', borderRadius: '20px', zIndex: 1 };
const toggleTextStyle = { flex: 1, zIndex: 2, fontWeight: '700', fontSize: '0.95rem', textAlign: 'center' };
const formWrapperStyle = { display: 'flex', flexDirection: 'column', gap: '22px', width: '100%', marginBottom: '20px' };
const inputGroupStyle = { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' };
const inputContainerStyle = { display: 'flex', alignItems: 'center', width: '90%', padding: '0 20px', borderRadius: '18px', border: '1.5px solid #f1f5f9', backgroundColor: '#f9fafb', height: '60px' };
const inputFieldStyle = { flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '1rem', color: '#1e293b' };
const labelStyle = { fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '10px', marginLeft: '5px' };
const optionsStyle = { display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '15px', padding: '0 5px' };
const submitButtonStyle = { width: '100%', padding: '18px', color: '#fff', border: 'none', borderRadius: '20px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 25px rgba(248, 113, 113, 0.25)' };
const socialButtonStyle = { width: '54px', height: '54px', borderRadius: '18px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#fff' };
const dividerStyle = { display: 'flex', alignItems: 'center', margin: '25px 0', width: '100%' };
const lineStyle = { flex: 1, height: '1px', backgroundColor: '#f1f5f9' };