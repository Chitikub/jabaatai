'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2'; 

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    profileImage: ''
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setFormData({
        firstName: parsedUser.firstName || '',
        lastName: parsedUser.lastName || '',
        gender: parsedUser.gender || 'male',
        email: parsedUser.email || '',
        profileImage: parsedUser.profileImage || '/avatar-placeholder.png'
      });
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    try {
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      
      window.dispatchEvent(new Event('userLogin'));
      window.dispatchEvent(new Event('storage'));

      Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ!',
        text: 'ข้อมูลโปรไฟล์ของคุณถูกอัปเดตเรียบร้อยแล้ว ✅',
        iconColor: '#10B981',
        confirmButtonColor: '#6366F1',
        customClass: { popup: 'swal-rounded' }
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง',
        iconColor: '#EF4444',
        confirmButtonColor: '#EF4444'
      });
    }
  };

  const handleDeleteImage = () => {
    setFormData(prev => ({ ...prev, profileImage: '/avatar-placeholder.png' }));
  };

  if (loading) return <div style={loadingWrapper}>กำลังโหลด...</div>;
  if (!user) return null;

  return (
    <main style={mainBgStyle}>
      <style>{`
        .swal-rounded { border-radius: 30px !important; }
        .btn-hover:hover { filter: brightness(1.1); transform: translateY(-1px); }
      `}</style>

      <div style={containerStyle}>
        <div style={headerSection}>
          <div style={userInfoHeader}>
            <div style={avatarLarge}>
              <img src={formData.profileImage} alt="Profile" style={avatarImg} />
            </div>
            {/* จุดที่เคยเกิด Error: แก้ไขโดยประกาศสไตล์ headerText ด้านล่าง */}
            <div style={headerText}>
              <h2 style={userNameTitle}>{user.firstName} {user.lastName || ''}</h2>
              <p style={subTitle}>Profile Setting</p>
            </div>
          </div>
          <button onClick={() => router.push('/')} style={backIconBtn}>↩</button>
        </div>

        <hr style={dividerLine} />

        <div style={sectionContent}>
          <div style={sectionHeader}>
            <h3 style={sectionTitle}>ข้อมูลส่วนตัว</h3>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="btn-hover" style={editSmallBtn}>แก้ไข</button>
            ) : (
              <button onClick={() => setIsEditing(false)} className="btn-hover" style={cancelSmallBtn}>ยกเลิก</button>
            )}
          </div>

          <div style={inputGrid}>
            <div style={inputItem}>
              <label style={inputLabel}>ชื่อ</label>
              <input name="firstName" type="text" readOnly={!isEditing} value={formData.firstName} onChange={handleChange} style={isEditing ? activeInputField : inputField} />
            </div>
            <div style={inputItem}>
              <label style={inputLabel}>นามสกุล</label>
              <input name="lastName" type="text" readOnly={!isEditing} value={formData.lastName} onChange={handleChange} style={isEditing ? activeInputField : inputField} />
            </div>
            <div style={inputItem}>
              <label style={inputLabel}>เพศ</label>
              <select name="gender" disabled={!isEditing} value={formData.gender} onChange={handleChange} style={isEditing ? activeInputField : inputField}>
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
              </select>
            </div>
            <div style={inputItem}>
              <label style={inputLabel}>Email</label>
              <input name="email" type="email" readOnly value={formData.email} style={inputField} />
            </div>
          </div>
        </div>

        {isEditing && (
          <>
            <hr style={dividerLine} />
            <div style={sectionContent}>
              <h3 style={sectionTitle}>รูปภาพ</h3>
              <div style={imageUploadArea}>
                <div style={imagePreviewBox}>
                   <img src={formData.profileImage} alt="Preview" style={avatarPreview} />
                </div>
                <div style={uploadActions}>
                  <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
                  <button onClick={() => fileInputRef.current.click()} className="btn-hover" style={uploadBtn}>📤 อัพโหลดรูปภาพใหม่</button>
                  <button onClick={handleDeleteImage} className="btn-hover" style={deleteBtn}>🗑️ ลบรูปภาพปัจจุบัน</button>
                </div>
              </div>
            </div>
          </>
        )}

        <div style={footerActions}>
           {isEditing && (
             <button onClick={handleSave} className="btn-hover" style={confirmBtn}>ยืนยันการแก้ไขข้อมูล</button>
           )}
        </div>
      </div>
    </main>
  );
}

// --- Styles (แก้ไขจุดที่ตกหล่น) ---
const mainBgStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3E8FF', padding: '20px' };
const containerStyle = { backgroundColor: '#fff', width: '100%', maxWidth: '850px', borderRadius: '40px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' };
const headerSection = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' };
const userInfoHeader = { display: 'flex', alignItems: 'center', gap: '20px' };
const avatarLarge = { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' };
const avatarImg = { width: '100%', height: '100%', objectFit: 'cover' };

// เพิ่มส่วนนี้เพื่อแก้ปัญหา Error
const headerText = { textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'center' };

const userNameTitle = { margin: 0, fontSize: '1.6rem', color: '#1F2937', fontWeight: '800' };
const subTitle = { margin: 0, fontSize: '0.9rem', color: '#9CA3AF' };
const backIconBtn = { background: '#f3f4f6', border: 'none', borderRadius: '10px', width: '40px', height: '40px', cursor: 'pointer', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const dividerLine = { border: 'none', borderTop: '1px solid #E5E7EB', margin: '30px 0' };
const sectionContent = { textAlign: 'left' };
const sectionHeader = { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' };
const sectionTitle = { fontSize: '1.3rem', fontWeight: '700', color: '#374151', margin: 0 };
const editSmallBtn = { padding: '5px 15px', backgroundColor: '#E5E7EB', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.2s' };
const cancelSmallBtn = { ...editSmallBtn, backgroundColor: '#fee2e2', color: '#ef4444' };
const inputGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 40px' };
const inputItem = { display: 'flex', flexDirection: 'column', gap: '8px' };
const inputLabel = { fontSize: '1.1rem', fontWeight: '700', color: '#1F2937' };
const inputField = { padding: '12px 15px', backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '10px', fontSize: '1rem', color: '#4B5563', outline: 'none' };
const activeInputField = { ...inputField, backgroundColor: '#fff', borderColor: '#6366F1', color: '#1F2937', boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)' };
const imageUploadArea = { display: 'flex', alignItems: 'center', gap: '30px', marginTop: '20px' };
const imagePreviewBox = { width: '150px', height: '150px', backgroundColor: '#F3F4F6', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' };
const avatarPreview = { width: '100%', height: '100%', objectFit: 'cover' };
const uploadActions = { display: 'flex', flexDirection: 'column', gap: '10px' };
const uploadBtn = { backgroundColor: '#6366F1', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' };
const deleteBtn = { backgroundColor: '#F87171', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' };
const footerActions = { display: 'flex', justifyContent: 'flex-end', marginTop: '30px', minHeight: '45px' };
const confirmBtn = { padding: '12px 40px', backgroundColor: '#6366F1', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.2)' };
const loadingWrapper = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' };