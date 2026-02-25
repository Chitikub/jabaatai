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

  const [errors, setErrors] = useState({});
  const [isSwitching, setIsSwitching] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // A5: Session Timeout (30 minutes)
  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isDirty) {
          Swal.fire({
            icon: 'warning',
            title: 'หมดเวลาการเชื่อมต่อ',
            text: 'กรุณาทำรายการใหม่อีกครั้ง',
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#7c3aed',
            allowOutsideClick: false
          }).then(() => {
            window.location.reload();
          });
        }
      }, 30 * 60 * 1000); 
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      clearTimeout(timeout);
    };
  }, [isDirty]);

  useEffect(() => { 
    setIsVisible(true); 
  }, []);

  // A1: Navigation Protection
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const validate = () => {
    let tempErrors = {};
    if (!formData.firstName) tempErrors.firstName = 'กรุณาระบุชื่อ';
    if (!formData.lastName) tempErrors.lastName = 'กรุณาระบุนามสกุล';
    if (!formData.email) {
      tempErrors.email = 'กรุณาระบุอีเมล';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'รูปแบบอีเมลไม่ถูกต้อง';
    }
    if (!formData.password) {
      tempErrors.password = 'กรุณาระบุรหัสผ่าน';
    } else if (formData.password.length < 6) {
      tempErrors.password = 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSwitchPage = (path) => {
    if (isDirty) {
      Swal.fire({
        title: 'ย้อนกลับ?',
        text: "ข้อมูลที่คุณกรอกจะไม่ถูกบันทึก ต้องการดำเนินการต่อหรือไม่?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7c3aed',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, ไปหน้าอื่น',
        cancelButtonText: 'ยกเลิก',
        customClass: { popup: 'swal-rounded' }
      }).then((result) => {
        if (result.isConfirmed) {
          setIsSwitching(true);
          setTimeout(() => { router.push(path); }, 150);
        }
      });
    } else {
      setIsSwitching(true);
      setTimeout(() => { router.push(path); }, 150);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) {
      Swal.fire({
        icon: 'error',
        title: 'ข้อมูลไม่ถูกต้อง',
        text: 'กรุณาตรวจสอบข้อมูลที่ระบุให้ถูกต้องครบถ้วน',
        confirmButtonColor: '#EF4444',
        customClass: { popup: 'swal-rounded' }
      });
      return;
    }

    const result = await Swal.fire({
      title: 'ยืนยันการสมัครสมาชิก?',
      text: "กรุณาตรวจสอบข้อมูลก่อนยืนยัน",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'แก้ไขข้อมูล',
      customClass: { popup: 'swal-rounded' }
    });

    if (!result.isConfirmed) return;

    try {
      // ปรับปรุง Path ให้ตรงกับ Backend ส่วนใหญ่
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsDirty(false);
        Swal.fire({
          icon: 'success',
          title: 'สมัครสมาชิกสำเร็จ! 🎉',
          text: data.message || 'สร้างบัญชีเรียบร้อยแล้ว กรุณาเข้าสู่ระบบ',
          timer: 2000,
          showConfirmButton: false,
          customClass: { popup: 'swal-rounded' }
        }).then(() => { router.push('/login'); });
      } else {
        if (response.status === 409) {
          Swal.fire({
            icon: 'warning',
            title: 'มีบัญชีนี้อยู่แล้ว',
            text: 'อีเมลนี้ถูกใช้งานแล้ว คุณต้องการเข้าสู่ระบบหรือไม่?',
            showCancelButton: true,
            confirmButtonText: 'เข้าสู่ระบบ',
            confirmButtonColor: '#7c3aed'
          }).then((res) => { if (res.isConfirmed) router.push('/login'); });
        } else {
          throw new Error(data.error || 'สมัครสมาชิกไม่สำเร็จ');
        }
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถเชื่อมต่อระบบได้',
        text: 'ตรวจสอบว่าคุณได้เปิด Backend (Port 5000) หรือยัง?',
        confirmButtonColor: '#7c3aed',
        customClass: { popup: 'swal-rounded' }
      });
    }
  };

  return (
    <main style={mainBgStyle}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&display=swap');
        * { font-family: 'IBM Plex Sans Thai', sans-serif; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .page-fade { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .btn-hover { transition: all 0.3s ease; }
        .btn-hover:hover { transform: translateY(-2px); filter: brightness(1.05); }
        .btn-hover:active { transform: translateY(0); }
        .input-focus:focus-within { border-color: #C084FC !important; box-shadow: 0 0 0 4px rgba(192, 132, 252, 0.1) !important; background-color: #ffffff !important; }
        .swal-rounded { border-radius: 30px !important; }
      `}</style>

      <div className={isVisible ? 'page-fade' : ''} style={containerStyle}>
        {/* Back Button */}
        <div style={backBtnStyle} onClick={() => handleSwitchPage('/')} className="btn-hover">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
        </div>

        {/* Toggle Switch */}
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

        {/* Social Buttons */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', marginTop: '30px', justifyContent: 'center', width: '100%' }}>
          {['f', 'G', 'A'].map((icon, i) => (
            <div key={i} className="btn-hover" style={socialButtonStyle}>{icon}</div>
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
            <div className="input-focus" style={{ ...inputContainerStyle, borderColor: errors.firstName ? '#EF4444' : '#f1f5f9' }}>
              <span style={{ marginRight: '10px' }}>👤</span>
              <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" style={inputFieldStyle} placeholder="ชื่อ" required />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>นามสกุล</label>
            <div className="input-focus" style={{ ...inputContainerStyle, borderColor: errors.lastName ? '#EF4444' : '#f1f5f9' }}>
              <span style={{ marginRight: '10px' }}>📛</span>
              <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" style={inputFieldStyle} placeholder="นามสกุล" required />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>อีเมล</label>
            <div className="input-focus" style={{ ...inputContainerStyle, borderColor: errors.email ? '#EF4444' : '#f1f5f9' }}>
              <span style={{ marginRight: '10px' }}>📧</span>
              <input name="email" value={formData.email} onChange={handleChange} type="email" style={inputFieldStyle} placeholder="example@mail.com" required />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>รหัสผ่าน</label>
            <div className="input-focus" style={{ ...inputContainerStyle, borderColor: errors.password ? '#EF4444' : '#f1f5f9' }}>
              <span style={{ marginRight: '10px' }}>🔒</span>
              <input name="password" value={formData.password} onChange={handleChange} type="password" style={{ ...inputFieldStyle, fontFamily: 'sans-serif' }} placeholder="••••••••" required />
            </div>
          </div>

          {/* Gender Switch */}
          <div style={{ ...genderToggleStyle, margin: '10px auto 0 auto' }}>
            <div style={{
              ...slidingBgStyle,
              left: formData.gender === 'male' ? '4px' : '50%',
              background: formData.gender === 'male' ? 'linear-gradient(135deg, #7DD3FC, #3B82F6)' : 'linear-gradient(135deg, #F9A8D4, #F472B6)',
              width: 'calc(50% - 8px)',
              transition: 'all 0.4s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}></div>
            <div onClick={() => setFormData({ ...formData, gender: 'male' })} style={{ ...toggleTextStyle, color: formData.gender === 'male' ? '#fff' : '#94a3b8', cursor: 'pointer' }}>ชาย</div>
            <div onClick={() => setFormData({ ...formData, gender: 'female' })} style={{ ...toggleTextStyle, color: formData.gender === 'female' ? '#fff' : '#94a3b8', cursor: 'pointer' }}>หญิง</div>
          </div>

          <button type="submit" className="btn-hover" style={submitButtonStyle}>
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

// --- Styles ---
const mainBgStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', backgroundImage: 'radial-gradient(at 0% 0%, rgba(226, 209, 249, 0.2) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(192, 132, 252, 0.05) 0, transparent 50%)', padding: '60px 20px' };
const containerStyle = { backgroundColor: '#ffffff', width: '100%', maxWidth: '500px', borderRadius: '40px', padding: '50px 40px', boxShadow: '0 25px 80px rgba(0, 0, 0, 0.07)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', position: 'relative' };
const backBtnStyle = { position: 'absolute', top: '25px', left: '25px', cursor: 'pointer', color: '#94a3b8', zIndex: 10 };
const toggleContainerStyle = { display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '25px', padding: '5px', position: 'relative', height: '56px', alignItems: 'center', width: '100%', maxWidth: '340px' };
const genderToggleStyle = { display: 'flex', backgroundColor: '#f8fafc', borderRadius: '20px', padding: '4px', position: 'relative', height: '54px', alignItems: 'center', width: '100%', maxWidth: '360px', border: '1px solid #f1f5f9' };
const slidingBgStyle = { position: 'absolute', width: 'calc(50% - 10px)', height: 'calc(100% - 10px)', borderRadius: '18px', zIndex: 1 };
const toggleTextStyle = { flex: 1, zIndex: 2, fontWeight: '700', fontSize: '0.95rem', textAlign: 'center' };
const formWrapperStyle = { display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '360px' };
const inputGroupStyle = { width: '100%', display: 'flex', flexDirection: 'column' };
const inputContainerStyle = { display: 'flex', alignItems: 'center', width: '100%', padding: '0 20px', borderRadius: '18px', border: '1.5px solid #f1f5f9', backgroundColor: '#f9fafb', height: '58px', transition: 'all 0.2s' };
const inputFieldStyle = { flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '0.95rem', color: '#1e293b' };
const labelStyle = { fontSize: '0.85rem', fontWeight: '700', color: '#475569', marginBottom: '8px', marginLeft: '5px' };
const socialButtonStyle = { width: '52px', height: '52px', borderRadius: '18px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', backgroundColor: '#fff' };
const submitButtonStyle = { width: '100%', maxWidth: '340px', padding: '18px', color: '#fff', background: 'linear-gradient(135deg, #C084FC, #7c3aed)', border: 'none', borderRadius: '20px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 25px rgba(124, 58, 237, 0.25)', marginTop: '20px', alignSelf: 'center' };
const dividerStyle = { display: 'flex', alignItems: 'center', margin: '25px 0', width: '100%' };
const lineStyle = { flex: 1, height: '1px', backgroundColor: '#f1f5f9' };