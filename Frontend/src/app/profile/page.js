'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; 
import Swal from 'sweetalert2';
import { 
  User, Mail, VenusAndMars, Camera, ShieldCheck, Edit3, Loader2, Save
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', gender: '', email: '', profileImage: ''
  });

  // 1. ดึงข้อมูลโปรไฟล์เมื่อโหลดหน้า
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const savedAuth = localStorage.getItem('user'); 
        if (!savedAuth) {
          router.push('/login');
          return;
        }

        const authData = JSON.parse(savedAuth);
        // เช็คทั้ง id หรือ _id และดึง Token มาใช้งาน
        const userId = authData.id || authData._id;
        const token = authData.token;

        if (!token) {
           console.error("Token not found in localStorage");
           router.push('/login');
           return;
        }

        const response = await fetch(`http://localhost:5000/api/profile/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // ส่ง Token ไปยืนยันตัวตน
          }
        });

        if (response.ok) {
          const dbData = await response.json();
          setUser(dbData);
          setFormData(dbData);
        } else if (response.status === 401) {
          // ถ้า Token หมดอายุ หรือไม่ถูกต้อง
          localStorage.removeItem('user');
          router.push('/login');
        } else {
          Swal.fire('Error', 'ไม่สามารถดึงข้อมูลจากเซิร์ฟเวอร์ได้', 'error');
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  // 2. จัดการเรื่องเปลี่ยนรูปภาพ
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

  // 3. บันทึกข้อมูลที่แก้ไข
  const handleSave = async () => {
    try {
      const savedAuth = JSON.parse(localStorage.getItem('user'));
      const userId = user._id || user.id;

      const response = await fetch(`http://localhost:5000/api/profile/${userId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${savedAuth?.token}` 
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updated = await response.json();
        setUser(updated);
        setIsEditing(false);
        
        // อัปเดตข้อมูลใน LocalStorage (รักษา Token เดิมไว้)
        const updatedAuth = { 
          ...savedAuth, 
          firstName: updated.firstName,
          lastName: updated.lastName,
          profileImage: updated.profileImage 
        };
        localStorage.setItem('user', JSON.stringify(updatedAuth));

        // ส่งสัญญาณให้ Navbar อัปเดตข้อมูลทันที
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('userLogin'));

        Swal.fire({ 
          icon: 'success', 
          title: 'บันทึกสำเร็จ', 
          text: 'ข้อมูลโปรไฟล์ของคุณถูกอัปเดตเรียบร้อยแล้ว',
          timer: 1500, 
          showConfirmButton: false,
          customClass: { popup: 'swal-rounded' }
        });
      } else {
        const errorData = await response.json();
        Swal.fire('Error', errorData.message || 'บันทึกไม่สำเร็จ', 'error');
      }
    } catch (err) {
      Swal.fire('Error', 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', 'error');
    }
  };

  if (loading || !user) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F1F5F9]">
      <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
      <p className="font-bold text-slate-500">กำลังโหลดข้อมูลโปรไฟล์...</p>
    </div>
  );

  return (
    <main className="page-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Mali:wght@400;700&display=swap');
        .page-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #F8F9FF; padding: 20px; font-family: 'Mali', sans-serif; }
        .profile-card { background: white; width: 100%; max-width: 500px; border-radius: 30px; padding: 35px; box-shadow: 0 15px 35px rgba(0,0,0,0.05); }
        .avatar-section { display: flex; flex-direction: column; align-items: center; margin-bottom: 25px; }
        .avatar-wrapper { position: relative; width: 120px; height: 120px; border-radius: 40px; overflow: hidden; margin-bottom: 15px; border: 4px solid #fff; box-shadow: 0 8px 25px rgba(0,0,0,0.1); cursor: ${isEditing ? 'pointer' : 'default'}; transition: 0.3s; }
        .avatar-wrapper:hover { transform: scale(1.02); }
        .upload-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; opacity: 0; transition: 0.3s; }
        .avatar-wrapper:hover .upload-overlay { opacity: ${isEditing ? '1' : '0'}; }
        .field { margin-bottom: 16px; }
        .field-label { font-size: 0.8rem; font-weight: 700; color: #64748B; margin-bottom: 6px; display: block; }
        .input-box { display: flex; align-items: center; gap: 12px; padding: 13px 16px; border-radius: 15px; border: 1.5px solid #E2E8F0; background: #F8FAFC; transition: 0.2s; }
        .input-box.editing { border-color: #6366F1; background: white; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.08); }
        .input-box input, .input-box select { border: none; outline: none; width: 100%; background: transparent; font-size: 1rem; color: #1E293B; }
        .btn-group { display: flex; gap: 12px; margin-top: 30px; }
        .btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px; border-radius: 15px; font-weight: 700; cursor: pointer; border: none; transition: 0.2s; }
        .btn-primary { background: #1E1B4B; color: white; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-2px); }
        .btn-secondary { background: #F1F5F9; color: #475569; }
        .swal-rounded { border-radius: 20px !important; }
      `}</style>

      <div className="profile-card">
        <div className="avatar-section">
          <div className="avatar-wrapper" onClick={() => isEditing && fileInputRef.current.click()}>
            <Image 
              src={formData.profileImage || '/avatar-placeholder.png'} 
              alt="Profile" 
              fill 
              className="object-cover" 
              priority 
            />
            {isEditing && <div className="upload-overlay"><Camera size={24} /></div>}
          </div>
          <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B' }}>{user?.firstName} {user?.lastName}</h2>
          <div style={{ color: '#6366F1', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={16} /> บัญชีได้รับการยืนยัน
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div className="field"><span className="field-label">ชื่อจริง</span>
            <div className={`input-box ${isEditing ? 'editing' : ''}`}><User size={18} color="#94A3B8" /><input value={formData.firstName} readOnly={!isEditing} onChange={(e) => setFormData({...formData, firstName: e.target.value})} /></div>
          </div>
          <div className="field"><span className="field-label">นามสกุล</span>
            <div className={`input-box ${isEditing ? 'editing' : ''}`}><User size={18} color="#94A3B8" /><input value={formData.lastName} readOnly={!isEditing} onChange={(e) => setFormData({...formData, lastName: e.target.value})} /></div>
          </div>
        </div>

        <div className="field"><span className="field-label">ระบุเพศ</span>
          <div className={`input-box ${isEditing ? 'editing' : ''}`}><VenusAndMars size={18} color="#94A3B8" />
            <select value={formData.gender} disabled={!isEditing} onChange={(e) => setFormData({...formData, gender: e.target.value})} style={{ appearance: 'none' }}>
              <option value="male">ชาย</option>
              <option value="female">หญิง</option>
              <option value="other">อื่นๆ</option>
            </select>
          </div>
        </div>

        <div className="field"><span className="field-label">อีเมลติดต่อ (ไม่สามารถแก้ไขได้)</span>
          <div className="input-box" style={{ opacity: 0.7, backgroundColor: '#EDF2F7' }}><Mail size={18} color="#94A3B8" />
            <input value={formData.email} readOnly disabled style={{ cursor: 'not-allowed' }} />
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
            <button onClick={() => { setIsEditing(false); setFormData(user); }} className="btn btn-secondary" style={{ color: '#E11D48' }}>ยกเลิก</button>
          </div>
        )}
      </div>
    </main>
  );
}