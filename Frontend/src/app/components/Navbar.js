'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasFavorites, setHasFavorites] = useState(false);
  const dropdownRef = useRef(null);

  // ฟังก์ชันดึงข้อมูลล่าสุด: เช็ค user_profile (ที่แก้ใหม่) ก่อน ถ้าไม่มีค่อยไปเช็ค user (ตอน Login)
  const checkUser = () => {
    if (typeof window !== 'undefined') {
      const updatedProfile = localStorage.getItem('user_profile');
      const loginData = localStorage.getItem('user');
      
      // เลือกเอาข้อมูลที่ใหม่ที่สุดมาแสดง (ข้อมูลจากการแก้ไขโปรไฟล์จะมีลำดับความสำคัญสูงกว่า)
      const latestData = updatedProfile ? JSON.parse(updatedProfile) : (loginData ? JSON.parse(loginData) : null);
      setUser(latestData);
      
      const savedFavs = localStorage.getItem('favorites');
      setHasFavorites(savedFavs ? JSON.parse(savedFavs).length > 0 : false);
    }
  };

  useEffect(() => {
    checkUser();
    
    // ฟัง Event 'storage' เพื่ออัปเดตชื่อและรูปทันทีที่หน้า Profile กดบันทึก (window.dispatchEvent)
    window.addEventListener('userLogin', checkUser);
    window.addEventListener('storage', checkUser); 
    window.addEventListener('favoriteUpdate', checkUser);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('userLogin', checkUser);
      window.removeEventListener('storage', checkUser);
      window.removeEventListener('favoriteUpdate', checkUser);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    window.location.href = '/'; 
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'ยืนยันการออกจากระบบ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#10B981',
      confirmButtonText: 'ออกจากระบบ',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true,
      customClass: { popup: 'swal-rounded' }
    }).then((result) => {
      if (result.isConfirmed) {
        // ล้างข้อมูลทุกอย่างป้องกันข้อมูลค้าง
        localStorage.removeItem('user');
        localStorage.removeItem('user_profile');
        setUser(null);
        setIsProfileOpen(false);
        router.push('/login');
      }
    });
  };

  return (
    <div style={wrapperStyle}>
      <style>{`
        .swal-rounded { border-radius: 30px !important; }
        .nav-btn:hover { background-color: #F3F4F6; transform: translateY(-1px); }
        .signup-purple-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(109, 40, 217, 0.3); }
        .logo-hover { transition: transform 0.3s ease; }
        .logo-hover:hover { transform: scale(1.05); }
        .heart-icon-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; transition: all 0.3s; position: relative; }
        .heart-icon-btn:hover { transform: scale(1.2); }
      `}</style>

      <nav style={navContainerStyle}>
        <div onClick={handleLogoClick} className="logo-hover" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <img src="/logo.png" alt="Logo" style={logoImgStyle} />
        </div>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <a href="/guide" style={navButtonStyle} className="nav-btn">คู่มือใช้งาน</a>
          <a href="/contact" style={navButtonStyle} className="nav-btn">ติดต่อ</a>
          <div style={dividerVerticalStyle}></div>

          {user ? (
            <div ref={dropdownRef} style={{ display: 'flex', alignItems: 'center', gap: '15px', position: 'relative' }}>
              <button onClick={() => router.push('/favorites?tab=favorites')} className="heart-icon-btn">
                <svg width="28" height="28" viewBox="0 0 24 24" fill={hasFavorites ? "#EF4444" : "none"} stroke={hasFavorites ? "#EF4444" : "#4B5563"} strokeWidth="2.2">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.51 4.05 3 5.5l7 7Z" />
                </svg>
                {hasFavorites && <span style={redDotStyle}></span>}
              </button>

              {/* ส่วนแสดงชื่อและรูปโปรไฟล์ที่อัปเดตตามสถานะล่าสุด */}
              <div onClick={() => setIsProfileOpen(!isProfileOpen)} style={{...profileTriggerStyle, backgroundColor: isProfileOpen ? '#EDE9FE' : '#F3F4F6'}}>
               <img 
  src={user.profileImage || "https://ui-avatars.com/api/?name=" + user.firstName + "&background=6D28D9&color=fff"} 
  alt="Profile" 
  style={avatarStyle} 
  onError={(e) => { 
    e.target.src = "https://ui-avatars.com/api/?name=" + user.firstName + "&background=6D28D9&color=fff"; 
  }}
/>
                <span style={{fontSize: '0.95rem', fontWeight: '700', color: '#4B5563'}}>
                    {user.firstName || 'สมาชิก'}
                </span>
              </div>

              {isProfileOpen && (
                <div style={dropdownMenuStyle}>
                  <div style={dropdownHeaderStyle}>
                    <img src={user.profileImage || '/avatar-placeholder.png'} alt="Profile" style={avatarLargeStyle} onError={(e) => { e.target.src = "/avatar-placeholder.png"; }} />
                    <div style={{ fontWeight: '800', marginTop: '10px', color: '#1E1B4B', fontSize: '1rem' }}>{user.firstName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{user.email}</div>
                  </div>
                  <hr style={dropdownDividerStyle} />
                  <div onClick={() => { router.push('/profile'); setIsProfileOpen(false); }} style={dropdownItemStyle}>โปรไฟล์</div>
                  <div onClick={() => { router.push('/history'); setIsProfileOpen(false); }} style={dropdownItemStyle}>ประวัติการใช้งาน</div>
                  <hr style={dropdownDividerStyle} />
                  <div onClick={handleLogout} style={{ ...dropdownItemStyle, color: '#EF4444' }}>ออกจากระบบ</div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '15px' }}>
              <a href="/login" style={loginLinkStyle}>Login</a>
              <a href="/signup" className="signup-purple-btn" style={signupBtnStyle}>Get Started</a>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

// --- Styles ปรับจูนให้คงเดิมที่สุด ---
const wrapperStyle = { position: 'fixed', top: '20px', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 1000, padding: '0 20px' };
const navContainerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 25px', backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(12px)', borderRadius: '60px', border: '1px solid rgba(109, 40, 217, 0.15)', boxShadow: '0 12px 40px rgba(0, 0, 0, 0.06)', width: '100%', maxWidth: '1100px' };
const logoImgStyle = { height: '75px', width: 'auto', cursor: 'pointer' };
const redDotStyle = { position: 'absolute', top: '0px', right: '0px', width: '10px', height: '10px', backgroundColor: '#EF4444', borderRadius: '50%', border: '2px solid #fff' };
const navButtonStyle = { textDecoration: 'none', color: '#4B5563', fontSize: '0.9rem', fontWeight: '600', padding: '10px 18px', borderRadius: '25px' };
const dividerVerticalStyle = { height: '24px', width: '1px', backgroundColor: '#E5E7EB', margin: '0 5px' };
const profileTriggerStyle = { display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 14px', borderRadius: '35px', cursor: 'pointer', border: '1px solid #E5E7EB', transition: '0.2s' };
const avatarStyle = { width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6D28D9' };
const avatarLargeStyle = { width: '55px', height: '55px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6D28D9' };
const loginLinkStyle = { textDecoration: 'none', color: '#4B5563', fontSize: '0.95rem', fontWeight: '700' };
const signupBtnStyle = { color: 'white', backgroundColor: '#6D28D9', padding: '12px 28px', borderRadius: '35px', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '700', boxShadow: '0 4px 15px rgba(109, 40, 217, 0.2)' };
const dropdownMenuStyle = { position: 'absolute', top: '75px', right: '0', width: '230px', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.12)', padding: '12px', border: '1px solid #F1F5F9' };
const dropdownHeaderStyle = { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px 0' };
const dropdownItemStyle = { padding: '12px', textDecoration: 'none', color: '#475569', fontSize: '0.9rem', fontWeight: '600', borderRadius: '14px', textAlign: 'center', display: 'block', cursor: 'pointer', transition: '0.2s' };
const dropdownDividerStyle = { border: 'none', borderTop: '1px solid #F1F5F9', margin: '8px 0' };