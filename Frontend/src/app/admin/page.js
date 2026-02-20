"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function AdminHomePage() {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Sample data for stats
  const [stats, setStats] = useState({
    totalLocations: 28,
    activeUsers: 156,
    bannedUsers: 8,
    untaggedLocations: 5,
    remainingMessages: 3,
    totalMoodTags: 432
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'location_tagged', message: 'สวนป่าเบญจกิติ ได้รับการ Tag mood สำเร็จ', timestamp: '2 นาทีที่แล้ว', icon: '🎯' },
    { id: 2, type: 'user_joined', message: 'Somchai Raidee เข้าร่วมระบบ', timestamp: '1 ชั่วโมงที่แล้ว', icon: '👤' },
    { id: 3, type: 'user_banned', message: 'Mana Deeja ได้รับการระงับ', timestamp: '3 ชั่วโมงที่แล้ว', icon: '🚫' },
    { id: 4, type: 'message_received', message: 'ได้รับข้อความติดต่อจาก Somsri Happy', timestamp: '1 วันที่แล้ว', icon: '💬' },
    { id: 5, type: 'location_added', message: 'เพิ่มพิกัด "BACC หอศิลป์" ใหม่', timestamp: '2 วันที่แล้ว', icon: '📍' },
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "ยืนยันการออกจากระบบ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#10B981",
      confirmButtonText: "ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
      borderRadius: '20px'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        localStorage.removeItem("user_profile");
        setUser(null);
        setIsProfileOpen(false);
        router.push("/login");
      }
    });
  };

  const navigationCards = [
    { title: "📍 จัดการสถานที่", description: "เพิ่ม แก้ไข ลบพิกัด หรือเพิ่มแท็กอารมณ์", color: "#E0F2F1", border: "#00897B", link: "/admin/manage" },
    { title: "👥 บัญชีผู้ใช้งาน", description: "ระงับ ยกเลิก หรือลบบัญชีผู้ใช้", color: "#E3F2FD", border: "#1976D2", link: "/admin/manage" },
    { title: "📊 สถิติอารมณ์", description: "ดูสถิติและการวิเคราะห์อารมณ์ในแต่ละพิกัด", color: "#FCE4EC", border: "#C2185B", link: "/admin/analytics" },
    { title: "💬 ติดต่อจากผู้ใช้", description: "ดูข้อความติดต่อและตอบกลับผู้ใช้", color: "#F3E5F5", border: "#7B1FA2", link: "/admin/contact" }
  ];

  return (
    <div className="admin-home-wrapper" style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Kanit' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '280px', background: '#FFFFFF', borderRight: '1px solid #E2E8F0', padding: '30px 20px', position: 'fixed', height: '100vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', cursor: 'pointer' }} onClick={() => router.push('/admin')}>
          <div style={{ width: '40px', height: '40px', background: '#4F46E5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>M</div>
          <span style={{ fontWeight: 900, fontSize: '20px', color: '#1E293B' }}>MOOD</span>
        </div>

        <nav>
          <div 
            onClick={() => router.push('/admin')}
            style={{ 
              padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', marginBottom: '10px', transition: '0.2s',
              background: '#F1F5F9',
              color: '#4F46E5',
              fontWeight: 'bold',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}
          >
            <span style={{fontSize:'20px'}}>🏠</span> หน้าแรก
          </div>
          <div 
            onClick={() => router.push('/admin/manage')}
            style={{ 
              padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', marginBottom: '10px', transition: '0.2s',
              background: 'transparent',
              color: '#64748B',
              fontWeight: 'normal',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}
          >
            <span style={{fontSize:'20px'}}>📍</span> จัดการสถานที่
          </div>
          <div 
            onClick={() => router.push('/admin/manage')}
            style={{ 
              padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', marginBottom: '10px', transition: '0.2s',
              background: 'transparent',
              color: '#64748B',
              fontWeight: 'normal',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}
          >
            <span style={{fontSize:'20px'}}>👥</span> บัญชีผู้ใช้
          </div>
          <div 
            onClick={() => router.push("/admin/analytics")}
            style={{ 
              padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', marginBottom: '10px', transition: '0.2s',
              background: 'transparent',
              color: '#64748B',
              fontWeight: 'normal',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}
          >
            <span style={{fontSize:'20px'}}>📊</span> สถิติอารมณ์
          </div>
          <div 
            onClick={() => router.push("/admin/contact")}
            style={{ 
              padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', transition: '0.2s',
              background: 'transparent',
              color: '#64748B',
              fontWeight: 'normal',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}
          >
            <span style={{fontSize:'20px'}}>💬</span> ติดต่อจากผู้ใช้
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '280px', padding: '20px 60px', position: 'relative' }}>
        
        {/* Admin Header with Profile Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '60px', paddingTop: '20px', position: 'relative' }}>
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: isProfileOpen ? '#EDE9FE' : '#F3F4F6',
                border: '1px solid #E5E7EB',
                padding: '10px 16px',
                borderRadius: '35px',
                cursor: 'pointer',
                fontFamily: 'Kanit',
                fontWeight: '600',
                color: '#4B5563',
                transition: '0.2s'
              }}
            >
              <img
                src={user?.profileImage || "https://ui-avatars.com/api/?name=" + (user?.firstName || "Admin") + "&background=6D28D9&color=fff"}
                alt="Profile"
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6D28D9' }}
                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + (user?.firstName || "Admin") + "&background=6D28D9&color=fff"; }}
              />
              <span>{user?.firstName || "Admin"}</span>
              <span style={{ fontSize: '12px', marginLeft: '4px' }}>▼</span>
            </button>

            {isProfileOpen && (
              <div style={{
                position: 'absolute',
                top: '60px',
                right: '0',
                width: '220px',
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                padding: '12px',
                border: '1px solid #F1F5F9',
                zIndex: 1000
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <img
                    src={user?.profileImage || "https://ui-avatars.com/api/?name=" + (user?.firstName || "Admin") + "&background=6D28D9&color=fff"}
                    alt="Profile"
                    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6D28D9', marginBottom: '10px' }}
                  />
                  <div style={{ fontWeight: '800', color: '#1E1B4B', fontSize: '1rem' }}>{user?.firstName || "Admin"}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{user?.email}</div>
                </div>

                <div
                  onClick={() => {
                    router.push("/profile");
                    setIsProfileOpen(false);
                  }}
                  style={{
                    padding: '12px',
                    textDecoration: 'none',
                    color: '#475569',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    borderRadius: '14px',
                    textAlign: 'center',
                    display: 'block',
                    cursor: 'pointer',
                    transition: '0.2s',
                    marginTop: '8px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  ✏️ แก้ไขโปรไฟล์
                </div>

                <div style={{ borderTop: '1px solid #F1F5F9', margin: '8px 0' }}></div>

                <div
                  onClick={handleLogout}
                  style={{
                    padding: '12px',
                    textDecoration: 'none',
                    color: '#EF4444',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    borderRadius: '14px',
                    textAlign: 'center',
                    display: 'block',
                    cursor: 'pointer',
                    transition: '0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#FEE2E2'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  ออกจากระบบ
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Welcome Section */}
        <div style={{ marginBottom: '60px' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 900, color: '#1E293B', margin: 0 }}>
            ยินดีต้อนรับกลับมา! 👋
          </h1>
          <p style={{ fontSize: '18px', color: '#64748B', margin: '12px 0 0 0' }}>
            ต่อไปนี้คือสรุปกิจกรรมและการจัดการระบบของคุณ
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '60px' }}>
          {/* Card 1: Total Locations */}
          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #E0F2F1 0%, #B2DFDB 100%)',
            borderRadius: '20px',
            padding: '28px',
            border: '2px solid #00897B',
            transition: '0.3s'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>📍</div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#00695C', marginBottom: '8px' }}>{stats.totalLocations}</div>
            <div style={{ color: '#00695C', fontWeight: 'bold', fontSize: '14px' }}>ทั้งหมด</div>
            <div style={{ color: '#004D40', fontSize: '12px', marginTop: '8px' }}>สถานที่ในระบบ</div>
          </div>

          {/* Card 2: Active Users */}
          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
            borderRadius: '20px',
            padding: '28px',
            border: '2px solid #1976D2',
            transition: '0.3s'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>👥</div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#1565C0', marginBottom: '8px' }}>{stats.activeUsers}</div>
            <div style={{ color: '#1565C0', fontWeight: 'bold', fontSize: '14px' }}>ใช้งานอยู่</div>
            <div style={{ color: '#0D47A1', fontSize: '12px', marginTop: '8px' }}>ผู้ใช้งานทั้งหมด</div>
          </div>

          {/* Card 3: Untagged Locations */}
          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
            borderRadius: '20px',
            padding: '28px',
            border: '2px solid #F57C00',
            transition: '0.3s'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚠️</div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#E65100', marginBottom: '8px' }}>{stats.untaggedLocations}</div>
            <div style={{ color: '#E65100', fontWeight: 'bold', fontSize: '14px' }}>ยังไม่ได้</div>
            <div style={{ color: '#BF360C', fontSize: '12px', marginTop: '8px' }}>Mood Tagging</div>
          </div>

          {/* Card 4: Messages */}
          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
            borderRadius: '20px',
            padding: '28px',
            border: '2px solid #7B1FA2',
            transition: '0.3s'
          }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>💬</div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#6A1B9A', marginBottom: '8px' }}>{stats.remainingMessages}</div>
            <div style={{ color: '#6A1B9A', fontWeight: 'bold', fontSize: '14px' }}>รอการตอบ</div>
            <div style={{ color: '#4A148C', fontSize: '12px', marginTop: '8px' }}>ข้อความติดต่อ</div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#1E293B', margin: '0 0 24px 0' }}>🚀 เข้าสู่ระบบจัดการ</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {navigationCards.map((card, idx) => (
              <div
                key={idx}
                onClick={() => router.push(card.link)}
                className="nav-card"
                style={{
                  background: card.color,
                  border: `2px solid ${card.border}`,
                  borderRadius: '20px',
                  padding: '28px',
                  cursor: 'pointer',
                  transition: '0.3s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '80px', opacity: '0.1' }}>➤</div>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: card.border, margin: '0 0 12px 0' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '14px', color: card.border, margin: 0, opacity: 0.8, lineHeight: '1.5' }}>
                  {card.description}
                </p>
                <div style={{ marginTop: '16px', fontSize: '14px', fontWeight: 'bold', color: card.border }}>
                  เข้าไป →
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#1E293B', margin: '0 0 24px 0' }}>📋 กิจกรรมล่าสุด</h2>
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            {recentActivity.map((activity, idx) => (
              <div
                key={activity.id}
                style={{
                  padding: '20px 28px',
                  borderBottom: idx !== recentActivity.length - 1 ? '1px solid #E2E8F0' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: '0.2s'
                }}
              >
                <div style={{
                  fontSize: '28px',
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#F1F5F9'
                }}>
                  {activity.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#1E293B', marginBottom: '4px' }}>
                    {activity.message}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                    {activity.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div style={{
          background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
          borderRadius: '20px',
          padding: '32px',
          textAlign: 'center',
          border: '1px solid #D4D4D8',
          marginBottom: '40px'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>✨</div>
          <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1E293B', margin: '0 0 8px 0' }}>
            ระบบกำลังทำงานในสภาวะปกติ
          </h3>
          <p style={{ color: '#64748B', margin: '0 0 16px 0' }}>
            ทั้งหมดของการตั้งค่าระบบ MOOD ยังคงทำงานได้อย่างเรียบร้อย
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', fontSize: '12px' }}>
            <span style={{ color: '#10B981', fontWeight: 'bold' }}>✅ Database: Normal</span>
            <span style={{ color: '#999' }}>|</span>
            <span style={{ color: '#10B981', fontWeight: 'bold' }}>✅ API: Active</span>
            <span style={{ color: '#999' }}>|</span>
            <span style={{ color: '#10B981', fontWeight: 'bold' }}>✅ Storage: OK</span>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;700;900&display=swap');
        
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .nav-card:hover {
          transform: translateX(8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08);
        }
        
        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
      `}</style>
    </div>
  );
}
