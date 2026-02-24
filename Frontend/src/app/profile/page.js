'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { 
  User, Mail, VenusAndMars, Camera, ShieldCheck, Edit3, Loader2, Save
} from 'lucide-react';

// 👇 อย่าลืม Import Navbar ให้ตรงกับโฟลเดอร์ของคุณ (เช่น '../components/Navbar')
import Navbar from '../components/Navbar'; 

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', gender: '', email: '', profileImage: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const savedAuth = localStorage.getItem('user'); 
        if (!savedAuth) {
          router.push('/login');
          return;
        }
        const authData = JSON.parse(savedAuth);
        if (!authData.id && !authData._id) {
          router.push('/login');
          return;
        }

        const token = localStorage.getItem('token') || authData.token;

        const response = await fetch(`http://localhost:5000/api/profile/${authData.id || authData._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });

        if (response.status === 401) {
          Swal.fire('เซสชันหมดอายุ', 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง', 'warning').then(() => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            router.push('/login');
          });
          return;
        }

        if (response.ok) {
          const dbData = await response.json();
          setUser(dbData);
          setFormData({
            firstName: dbData.firstName || '',
            lastName: dbData.lastName || '',
            gender: dbData.gender || '',
            email: dbData.email || '',
            profileImage: dbData.profileImage || ''
          });
        } else {
          Swal.fire('Error', 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้', 'error');
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return Swal.fire('ไฟล์ใหญ่เกินไป', 'กรุณาเลือกรูปขนาดไม่เกิน 2MB', 'error');
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.firstName) {
        return Swal.fire('ข้อมูลไม่ครบ', 'กรุณากรอกชื่อจริงอย่างน้อย 1 ตัวอักษร', 'warning');
      }

      const savedAuth = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token') || savedAuth.token;

      const response = await fetch(`http://localhost:5000/api/profile/${user._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      if (response.status === 401) {
        return Swal.fire('ไม่มีสิทธิ์', 'เซสชันของคุณหมดอายุ กรุณาล็อกอินใหม่', 'error');
      }

      if (response.ok) {
        const updated = await response.json();
        setUser(updated);
        setFormData(updated);
        setIsEditing(false);
        
        const authInfo = { ...savedAuth, id: updated._id, firstName: updated.firstName, email: updated.email };
        localStorage.setItem('user', JSON.stringify(authInfo));
        localStorage.setItem('user_profile', JSON.stringify(updated));

        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('userLogin'));

        Swal.fire({ 
          icon: 'success', 
          title: 'บันทึกสำเร็จ ✓', 
          text: 'ข้อมูลโปรไฟล์ถูกอัปเดตแล้ว',
          timer: 1500, 
          showConfirmButton: false,
          customClass: { popup: 'swal-rounded' }
        });
      } else {
        const error = await response.json();
        Swal.fire('ข้อผิดพลาด', error.error || 'ไม่สามารถบันทึกข้อมูลได้', 'error');
      }
    } catch (err) {
      console.error('Save error:', err);
      Swal.fire('ข้อผิดพลาด', 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้', 'error');
    }
  };

  if (loading || !user) return (
    <>
      <Navbar /> {/* ใส่ Navbar ตอนโหลดด้วย */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f4f7ff' }}>
        <Loader2 className="spinner" size={40} color="#0F172A" style={{ marginBottom: '15px' }} />
        <p style={{ fontWeight: 'bold', color: '#64748B', fontFamily: 'sans-serif' }}>กำลังดึงข้อมูล...</p>
        <style>{`
          @keyframes spin { 100% { transform: rotate(360deg); } }
          .spinner { animation: spin 1s linear infinite; }
        `}</style>
      </div>
    </>
  );

  return (
    <>
      {/* เรียกใช้งาน Navbar ด้านบนสุด */}
      <Navbar />
      
      <main className="page-container">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&display=swap');
          
          .page-container { 
            min-height: 100vh; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            background-color: #f4f7ff;
            background-image: 
              radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.15) 0px, transparent 50%);
            /* ปรับ Padding ด้านบนให้หลบ Navbar ที่ถูก Fixed ไว้ (120px) */
            padding: 120px 20px 40px; 
            font-family: 'IBM Plex Sans Thai', 'Plus Jakarta Sans', sans-serif; 
          }
          
          .profile-card { 
            background: rgba(255, 255, 255, 0.85); 
            backdrop-filter: blur(20px);
            width: 100%; 
            max-width: 500px; 
            border-radius: 30px; 
            padding: 40px 35px; 
            box-shadow: 0 20px 40px rgba(15, 23, 42, 0.05); 
            border: 1px solid rgba(255, 255, 255, 0.5);
            animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }

          .avatar-section { display: flex; flex-direction: column; align-items: center; margin-bottom: 30px; }
          .avatar-wrapper { 
            position: relative; width: 120px; height: 120px; border-radius: 50%; overflow: hidden; 
            margin-bottom: 15px; border: 4px solid #fff; box-shadow: 0 10px 25px rgba(0,0,0,0.1); 
            transition: all 0.3s ease; 
          }
          .avatar-wrapper.editable { cursor: pointer; }
          .avatar-wrapper.editable:hover { transform: scale(1.05); border-color: #E2E8F0; }
          .avatar-wrapper img { width: 100%; height: 100%; object-fit: cover; display: block; }
          .upload-overlay { 
            position: absolute; inset: 0; background: rgba(15, 23, 42, 0.6); 
            display: flex; align-items: center; justify-content: center; color: white; 
            opacity: 0; transition: opacity 0.3s; pointer-events: none; 
          }
          .avatar-wrapper.editable:hover .upload-overlay { opacity: 1; }
          
          .field { margin-bottom: 18px; }
          .field-label { font-size: 0.85rem; font-weight: 700; color: #475569; margin-bottom: 8px; display: block; padding-left: 5px; }
          .input-box { 
            display: flex; align-items: center; gap: 12px; padding: 14px 18px; 
            border-radius: 16px; border: 2px solid #E2E8F0; background: rgba(255,255,255,0.9); transition: 0.3s; 
          }
          .input-box.editing { border-color: #0F172A; background: white; box-shadow: 0 4px 15px rgba(15, 23, 42, 0.05); }
          .input-box input, .input-box select { 
            border: none; outline: none; width: 90%; background: transparent; 
            font-size: 1rem; color: #1E293B; font-family: inherit; font-weight: 500;
          }
          .input-box input:disabled, .input-box select:disabled { color: #94A3B8; cursor: not-allowed; }
          
          .btn-group { display: flex; gap: 15px; margin-top: 35px; }
          .btn { 
            flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; 
            padding: 15px; border-radius: 16px; font-weight: 700; cursor: pointer; border: none; 
            font-family: inherit; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
          }
          .btn-primary { background: #0F172A; color: white; box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.3); }
          .btn-primary:hover { transform: translateY(-2px); background: #334155; box-shadow: 0 15px 25px -5px rgba(15, 23, 42, 0.4); }
          .btn-secondary { background: #F1F5F9; color: #475569; }
          .btn-secondary:hover { background: #E2E8F0; transform: translateY(-2px); }
          
          .swal-rounded { border-radius: 24px !important; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15) !important; }

          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div className="profile-card">
          <div className="avatar-section">
            <div className={`avatar-wrapper ${isEditing ? 'editable' : ''}`} onClick={() => isEditing && fileInputRef.current?.click()}>
              <img src={formData.profileImage || `https://ui-avatars.com/api/?name=${user?.firstName || 'User'}&background=0F172A&color=fff&bold=true`} alt="Profile" />
              {isEditing && <div className="upload-overlay"><Camera size={32} strokeWidth={1.5} /></div>}
            </div>
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.5px' }}>
              {user?.firstName} {user?.lastName}
            </h2>
            <div style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <ShieldCheck size={16} color="#10B981" /> Verified Member
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="field"><span className="field-label">ชื่อจริง</span>
              <div className={`input-box ${isEditing ? 'editing' : ''}`}><User size={18} color="#94A3B8" />
                <input value={formData.firstName} readOnly={!isEditing} onChange={(e) => setFormData({...formData, firstName: e.target.value})} placeholder="First name" />
              </div>
            </div>
            <div className="field"><span className="field-label">นามสกุล</span>
              <div className={`input-box ${isEditing ? 'editing' : ''}`}><User size={18} color="#94A3B8" />
                <input value={formData.lastName} readOnly={!isEditing} onChange={(e) => setFormData({...formData, lastName: e.target.value})} placeholder="Last name" />
              </div>
            </div>
          </div>

          <div className="field"><span className="field-label">ระบุเพศ</span>
            <div className={`input-box ${isEditing ? 'editing' : ''}`}><VenusAndMars size={18} color="#94A3B8" />
              <select value={formData.gender} disabled={!isEditing} onChange={(e) => setFormData({...formData, gender: e.target.value})} style={{ cursor: isEditing ? 'pointer' : 'not-allowed' }}>
                <option value="">-- เลือกเพศ --</option>
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>
          </div>

          <div className="field"><span className="field-label">อีเมลติดต่อ</span>
            <div className="input-box" style={{ opacity: 0.7, backgroundColor: '#F8FAFC' }}><Mail size={18} color="#94A3B8" />
              <input value={formData.email} readOnly disabled style={{ cursor: 'not-allowed' }} placeholder="your@email.com" />
            </div>
          </div>

          {!isEditing ? (
            <div className="btn-group">
              <button onClick={() => setIsEditing(true)} className="btn btn-primary"><Edit3 size={18} /> แก้ไขโปรไฟล์</button>
              <button onClick={() => router.push('/')} className="btn btn-secondary">กลับหน้าหลัก</button>
            </div>
          ) : (
            <div className="btn-group">
              <button onClick={handleSave} className="btn btn-primary"><Save size={18} /> บันทึกข้อมูล</button>
              <button onClick={() => { setIsEditing(false); setFormData(user); }} className="btn btn-secondary" style={{ color: '#EF4444', backgroundColor: '#FEF2F2' }}>ยกเลิก</button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}