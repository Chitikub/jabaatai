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
  
  // สถานะจำลองสำหรับแอดมิน (ปกติควรดึงจาก API)
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [userList, setUserList] = useState([]);

  // Load Font & Initial State
  useEffect(() => {
    setIsVisible(true);
    // เพิ่ม Google Font Mali
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Mali:wght@300;400;500;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // Session Timeout
  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        Swal.fire({
          icon: 'warning',
          title: 'หมดเวลาการเชื่อมต่อ',
          text: 'กรุณาทำรายการใหม่อีกครั้ง',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#7c3aed',
        }).then(() => window.location.reload());
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
  }, []);

  const validate = () => {
    let tempErrors = {};
    if (!formData.firstName) tempErrors.firstName = 'กรุณาระบุชื่อ';
    if (!formData.lastName) tempErrors.lastName = 'กรุณาระบุนามสกุล';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = 'อีเมลไม่ถูกต้อง';
    if (!formData.password || formData.password.length < 6) tempErrors.password = 'รหัสผ่านต้องมี 6 ตัวขึ้นไป';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await Swal.fire({
      title: 'ยืนยันข้อมูล?',
      text: "ตรวจสอบความถูกต้องก่อนสมัครสมาชิก",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'แก้ไข',
      confirmButtonColor: '#7c3aed',
    });

    if (result.isConfirmed) {
      // จำลองการเพิ่มข้อมูล (ในแอปจริงจะยิง API)
      const newUser = { ...formData, id: Date.now() };
      setUserList(prev => [...prev, newUser]);
      
      Swal.fire('สำเร็จ!', 'สมัครสมาชิกเรียบร้อย', 'success');
      setIsDirty(false);
    }
  };

  // --- ส่วนหน้า Home ของแอดมิน ---
  if (isAdminMode) {
    return (
      <main style={{ ...mainBgStyle, fontFamily: '"Mali", cursive' }}>
        <div className="page-fade" style={{ ...containerStyle, maxWidth: '800px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ color: '#7c3aed', margin: 0 }}>แผงควบคุมแอดมิน 👑</h2>
            <button onClick={() => setIsAdminMode(false)} style={{ background: '#f1f5f9', border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontFamily: 'Mali' }}>
              กลับหน้าสมัคร
            </button>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  <th style={tableHeaderStyle}>ชื่อ-นามสกุล</th>
                  <th style={tableHeaderStyle}>อีเมล</th>
                  <th style={tableHeaderStyle}>เพศ</th>
                </tr>
              </thead>
              <tbody>
                {userList.length > 0 ? userList.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={tableCellStyle}>{user.firstName} {user.lastName}</td>
                    <td style={tableCellStyle}>{user.email}</td>
                    <td style={tableCellStyle}>{user.gender === 'male' ? 'ชาย' : 'หญิง'}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" style={{ ...tableCellStyle, textAlign: 'center', color: '#94a3b8' }}>ยังไม่มีข้อมูลผู้สมัคร</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    );
  }

  // --- ส่วนหน้าสมัครสมาชิกเดิม ---
  return (
    <main style={{ ...mainBgStyle, fontFamily: '"Mali", cursive' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .page-fade { animation: fadeIn 0.5s ease-out forwards; }
        .btn-hover:hover { transform: scale(1.02); filter: brightness(1.1); }
        .input-focus:focus-within { border-color: #C084FC !important; box-shadow: 0 0 0 4px rgba(192, 132, 252, 0.1); }
      `}</style>

      <div className={isVisible ? 'page-fade' : ''} style={containerStyle}>
        
        {/* ปุ่มลับเข้าหน้า Admin */}
        <div 
          onClick={() => setIsAdminMode(true)}
          style={{ position: 'absolute', top: '20px', right: '20px', cursor: 'pointer', opacity: 0.5, fontSize: '0.8rem' }}
        >
          🔐 Admin
        </div>

        <div style={{ ...toggleContainerStyle, margin: '0 auto' }}>
          <div style={{ ...slidingBgStyle, left: '4px', background: 'linear-gradient(90deg, #FCA5A5, #C084FC)' }}></div>
          <div style={{ ...toggleTextStyle, color: '#fff' }}>สมัครสมาชิก</div>
          <div onClick={() => router.push('/login')} style={{ ...toggleTextStyle, color: '#9ca3af', cursor: 'pointer' }}>เข้าสู่ระบบ</div>
        </div>

        <form onSubmit={handleSignup} style={{ ...formWrapperStyle, margin: '30px auto 0 auto' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>ชื่อ</label>
              <div className="input-focus" style={{ ...inputContainerStyle, borderColor: errors.firstName ? '#EF4444' : '#f1f5f9' }}>
                <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" style={inputFieldStyle} placeholder="ชื่อ" />
              </div>
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>นามสกุล</label>
              <div className="input-focus" style={{ ...inputContainerStyle, borderColor: errors.lastName ? '#EF4444' : '#f1f5f9' }}>
                <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" style={inputFieldStyle} placeholder="นามสกุล" />
              </div>
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email</label>
            <div className="input-focus" style={{ ...inputContainerStyle, borderColor: errors.email ? '#EF4444' : '#f1f5f9' }}>
              <input name="email" value={formData.email} onChange={handleChange} type="email" style={inputFieldStyle} placeholder="example@mail.com" />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <div className="input-focus" style={{ ...inputContainerStyle, borderColor: errors.password ? '#EF4444' : '#f1f5f9' }}>
              <input name="password" value={formData.password} onChange={handleChange} type="password" style={inputFieldStyle} placeholder="••••••••" />
            </div>
          </div>

          {/* Gender Toggle */}
          <div style={{ ...toggleContainerStyle, height: '50px', backgroundColor: '#f8fafc', maxWidth: '100%' }}>
            <div style={{
              ...slidingBgStyle,
              left: formData.gender === 'male' ? '4px' : '50%',
              background: formData.gender === 'male' ? '#3B82F6' : '#F472B6',
              width: 'calc(50% - 8px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}></div>
            <div onClick={() => setFormData({...formData, gender: 'male'})} style={{ ...toggleTextStyle, color: formData.gender === 'male' ? '#fff' : '#94a3b8' }}>ชาย</div>
            <div onClick={() => setFormData({...formData, gender: 'female'})} style={{ ...toggleTextStyle, color: formData.gender === 'female' ? '#fff' : '#94a3b8' }}>หญิง</div>
          </div>

          <button type="submit" className="btn-hover" style={submitButtonStyle}>
            ยืนยันสมัครสมาชิก
          </button>
        </form>
      </div>
    </main>
  );
}

// --- Styles (ปรับปรุงเพิ่มเติม) ---
const mainBgStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fdfcfe', padding: '40px 20px' };
const containerStyle = { backgroundColor: '#ffffff', width: '100%', maxWidth: '480px', borderRadius: '35px', padding: '40px', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9', position: 'relative' };
const toggleContainerStyle = { display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '20px', padding: '4px', position: 'relative', height: '54px', alignItems: 'center', width: '100%', maxWidth: '300px' };
const slidingBgStyle = { position: 'absolute', width: 'calc(50% - 8px)', height: 'calc(100% - 8px)', borderRadius: '16px', zIndex: 1, transition: 'all 0.3s' };
const toggleTextStyle = { flex: 1, zIndex: 2, fontWeight: '600', fontSize: '0.9rem', textAlign: 'center', cursor: 'pointer' };
const formWrapperStyle = { display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' };
const inputGroupStyle = { width: '100%', display: 'flex', flexDirection: 'column' };
const inputContainerStyle = { display: 'flex', alignItems: 'center', width: '100%', padding: '0 15px', borderRadius: '15px', border: '1.5px solid #f1f5f9', backgroundColor: '#f9fafb', height: '52px', transition: 'all 0.2s' };
const inputFieldStyle = { flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent', fontSize: '0.9rem', color: '#1e293b', fontFamily: 'Mali' };
const labelStyle = { fontSize: '0.85rem', fontWeight: '600', color: '#64748b', marginBottom: '6px', marginLeft: '4px' };
const submitButtonStyle = { width: '100%', padding: '16px', color: '#fff', border: 'none', borderRadius: '18px', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', boxShadow: '0 10px 20px rgba(124, 58, 237, 0.2)', transition: 'all 0.3s', marginTop: '10px', fontFamily: 'Mali' };
const tableHeaderStyle = { padding: '15px', color: '#64748b', fontWeight: '600', fontSize: '0.9rem' };
const tableCellStyle = { padding: '15px', fontSize: '0.9rem', color: '#1e293b' };