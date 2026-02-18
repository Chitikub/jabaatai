'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function SignupPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: 'male'
  });

  const [isSwitching, setIsSwitching] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => { setIsVisible(true); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchPage = (path) => {
    setIsSwitching(true); 
    setTimeout(() => { router.push(path); }, 150);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: 'success',
          title: 'สมัครสมาชิกสำเร็จ! 🎉',
          text: data.message || 'สร้างบัญชีเรียบร้อยแล้ว กรุณาเข้าสู่ระบบ',
          iconColor: '#10B981',
          confirmButtonColor: '#7c3aed',
          customClass: { popup: 'swal-rounded' }
        }).then(() => { router.push('/login'); });
      } else {
        // ดึง Error Message จากหลังบ้านมาแสดง เช่น "อีเมลนี้ถูกใช้งานไปแล้ว"
        Swal.fire({
          icon: 'error',
          title: 'สมัครสมาชิกไม่สำเร็จ',
          text: data.error || 'เกิดข้อผิดพลาดในการสมัคร',
          iconColor: '#EF4444',
          confirmButtonColor: '#EF4444',
          customClass: { popup: 'swal-rounded' }
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์หลังบ้านได้ กรุณาตรวจสอบการรัน Backend',
        iconColor: '#EF4444',
        confirmButtonColor: '#EF4444',
      });
    }
  };

  return (
    <main style={mainBgStyle}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .page-fade { animation: fadeIn 0.5s ease-out forwards; }
        .btn-hover:hover { transform: translateY(-2px); filter: brightness(1.1); }
        .btn-hover:active { transform: translateY(0); }
        .input-focus:focus-within { border-color: #C084FC !important; box-shadow: 0 0 0 4px rgba(192, 132, 252, 0.1); }
        .swal-rounded { border-radius: 30px !important; }
      `}</style>

      <div className={isVisible ? 'page-fade' : ''} style={containerStyle}>
        
        <div style={{ ...toggleContainerStyle, margin: '0 auto' }}>
          <div style={{
            ...slidingBgStyle,
            left: isSwitching ? '50%' : '4px', 
            background: 'linear-gradient(90deg, #FCA5A5, #C084FC)', 
            transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 4px 15px rgba(192, 132, 252, 0.3)'
          }}></div>
          <div style={{ ...toggleTextStyle, color: '#fff' }}>สมัครสมาชิก</div>
          <div onClick={() => handleSwitchPage('/login')} style={{ ...toggleTextStyle, color: '#9ca3af', cursor: 'pointer' }}>เข้าสู่ระบบ</div>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '32px', marginTop: '30px', justifyContent: 'center', width: '100%' }}>
          {['f', 'G', 'A'].map((icon, i) => (
            <div key={i} className="btn-hover" style={{ ...socialButtonStyle, alignItems: 'center', display: 'flex' }}>
              {icon}
            </div>
          ))}
        </div>

        <div style={dividerStyle}>
          <div style={lineStyle}></div>
          <span style={{ padding: '0 15px', color: '#cbd5e1', fontSize: '0.8rem' }}>ระบุข้อมูลของคุณ</span>
          <div style={lineStyle}></div>
        </div>

        <form onSubmit={handleSignup} style={{ ...formWrapperStyle, margin: '0 auto' }}>
           <div style={inputGroupStyle}>
             <label style={labelStyle}>ชื่อ</label>
             <div className="input-focus" style={inputContainerStyle}>
               <span style={{ marginRight: '10px' }}>👤</span>
               <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" style={inputFieldStyle} placeholder="ระบุชื่อของคุณ" required />
             </div>
           </div>
           
           <div style={inputGroupStyle}>
             <label style={labelStyle}>นามสกุล</label>
             <div className="input-focus" style={inputContainerStyle}>
               <span style={{ marginRight: '10px' }}>📛</span>
               <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" style={inputFieldStyle} placeholder="ระบุนามสกุลของคุณ" required />
             </div>
           </div>

           <div style={inputGroupStyle}>
             <label style={labelStyle}>Email</label>
             <div className="input-focus" style={inputContainerStyle}>
               <span style={{ marginRight: '10px' }}>📧</span>
               <input name="email" value={formData.email} onChange={handleChange} type="email" style={inputFieldStyle} placeholder="example@mail.com" required />
             </div>
           </div>

           <div style={inputGroupStyle}>
             <label style={labelStyle}>Password</label>
             <div className="input-focus" style={inputContainerStyle}>
               <span style={{ marginRight: '10px' }}>🔒</span>
               <input name="password" value={formData.password} onChange={handleChange} type="password" style={inputFieldStyle} placeholder="••••••••" required />
             </div>
           </div>

          <div style={{ ...toggleContainerStyle, marginTop: '10px', height: '54px', backgroundColor: '#f8fafc', maxWidth: '100%', border: '1px solid #f1f5f9', margin: '0 auto' }}>
            <div style={{
              ...slidingBgStyle,
              left: formData.gender === 'male' ? '4px' : '50%', 
              background: formData.gender === 'male' ? 'linear-gradient(135deg, #7DD3FC, #3B82F6)' : 'linear-gradient(135deg, #F9A8D4, #F472B6)',
              width: 'calc(50% - 8px)',
              transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
              boxShadow: formData.gender === 'male' ? '0 6px 15px rgba(59, 130, 246, 0.35)' : '0 6px 15px rgba(244, 114, 182, 0.35)'
            }}></div>
            <div onClick={() => setFormData({...formData, gender: 'male'})} style={{ ...toggleTextStyle, color: formData.gender === 'male' ? '#fff' : '#94a3b8', cursor: 'pointer' }}>ชาย</div>
            <div onClick={() => setFormData({...formData, gender: 'female'})} style={{ ...toggleTextStyle, color: formData.gender === 'female' ? '#fff' : '#94a3b8', cursor: 'pointer' }}>หญิง</div>
          </div>

          <button type="submit" className="btn-hover" style={{...submitButtonStyle, background: 'linear-gradient(135deg, #C084FC, #7c3aed)', marginTop: '25px', textAlign: 'center', margin: '25px auto 0 auto'}}>
            สมัครสมาชิก
          </button>
        </form>

        <p style={{ marginTop: '25px', fontSize: '0.9rem', color: '#94a3b8', textAlign: 'center' }}>
          มีบัญชีอยู่แล้ว? <span onClick={() => handleSwitchPage('/login')} style={{ color: '#7c3aed', fontWeight: '700', cursor: 'pointer' }}>เข้าสู่ระบบที่นี่</span>
        </p>
      </div>
    </main>
  );
}

const mainBgStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', backgroundImage: 'radial-gradient(at 0% 0%, rgba(226, 209, 249, 0.2) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(192, 132, 252, 0.05) 0, transparent 50%)', padding: '100px 20px 40px 20px' };
const containerStyle = { backgroundColor: '#ffffff', width: '100%', maxWidth: '500px', borderRadius: '40px', padding: '50px 40px', boxShadow: '0 25px 80px rgba(0, 0, 0, 0.07)', border: '1px solid #f8f9fa', display: 'flex', flexDirection: 'column', alignItems: 'stretch', transition: 'all 0.3s' };
const toggleContainerStyle = { display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '25px', padding: '5px', position: 'relative', cursor: 'pointer', height: '56px', alignItems: 'center', width: '100%', maxWidth: '340px' };
const slidingBgStyle = { position: 'absolute', width: 'calc(50% - 10px)', height: 'calc(100% - 10px)', borderRadius: '20px', zIndex: 1 };
const toggleTextStyle = { flex: 1, zIndex: 2, fontWeight: '700', fontSize: '0.95rem', textAlign: 'center' };
const formWrapperStyle = { display: 'flex', flexDirection: 'column', gap: '22px', width: '100%', maxWidth: '360px' };
const inputGroupStyle = { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' };
const inputContainerStyle = { display: 'flex', alignItems: 'center', width: '100%', padding: '0 20px', borderRadius: '18px', border: '1.5px solid #f1f5f9', backgroundColor: '#f9fafb', height: '58px', transition: 'all 0.2s' };
const inputFieldStyle = { flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '0.95rem', color: '#1e293b' };
const labelStyle = { fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '8px', marginLeft: '4px' };
const socialButtonStyle = { width: '52px', height: '52px', borderRadius: '18px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#fff', boxShadow: '0 5px 15px rgba(0,0,0,0.02)', transition: 'all 0.2s' };
const submitButtonStyle = { width: '100%', maxWidth: '340px', padding: '18px', color: '#fff', border: 'none', borderRadius: '20px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 25px rgba(124, 58, 237, 0.25)', transition: 'all 0.3s', display: 'block' };
const dividerStyle = { display: 'flex', alignItems: 'center', margin: '25px 0', width: '100%' };
const lineStyle = { flex: 1, height: '1px', backgroundColor: '#f1f5f9' };