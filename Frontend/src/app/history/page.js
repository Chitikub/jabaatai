'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Clock, Heart, ChevronRight, Calendar, MapPin } from 'lucide-react';

function HistoryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');

  // ข้อมูลสถานที่ (Locations Data)
  const [locations, setLocations] = useState([
    { id: 1, name: 'ปะปานคร นครปฐม', date: '2026-02-17', time: '14:30', type: 'forest', isFavorite: false },
    { id: 2, name: 'สวนเบญจกิติ', date: '2026-02-10', time: '17:45', type: 'forest', isFavorite: true },
    { id: 3, name: 'เกาะล้าน', date: '2026-01-15', time: '09:15', type: 'sea', isFavorite: false },
    { id: 4, name: 'หัวหิน', date: '2025-06-20', time: '11:00', type: 'sea', isFavorite: true },
    { id: 5, name: 'สวนหลวง ร.9', date: '2024-10-10', time: '16:20', type: 'forest', isFavorite: false },
  ]);

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก LocalStorage
    const savedUser = localStorage.getItem('user_profile') || localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      router.push('/login');
    }
  }, [router]);

  // ฟังก์ชัน Toggle Favorite
  const toggleFavorite = (id) => {
    setLocations(prev => {
      const updated = prev.map(loc => 
        loc.id === id ? { ...loc, isFavorite: !loc.isFavorite } : loc
      );
      // อัปเดตลง LocalStorage เพื่อให้หน้า Favorites และ Navbar รับรู้
      const favoritesOnly = updated.filter(l => l.isFavorite);
      localStorage.setItem('favorites', JSON.stringify(favoritesOnly));
      return updated;
    });
    
    // ส่ง Event แจ้งเตือน Navbar
    window.dispatchEvent(new Event('favoriteUpdate'));
    window.dispatchEvent(new Event('storage'));
  };

  // ฟังก์ชันนำทางไปหน้าละเอียด
  const handleViewDetail = (id) => {
    router.push(`/location/${id}`);
  };

  // ฟังก์ชันกรองข้อมูลตามเวลา
  const filterByTime = (data) => {
    const now = new Date();
    return data.filter(item => {
      const itemDate = new Date(item.date);
      if (timeFilter === 'today') return itemDate.toDateString() === now.toDateString();
      if (timeFilter === 'last_week') {
        const lastWeek = new Date();
        lastWeek.setDate(now.getDate() - 7);
        return itemDate >= lastWeek && itemDate <= now;
      }
      if (timeFilter === 'last_month') {
        const lastMonth = new Date();
        lastMonth.setMonth(now.getMonth() - 1);
        return itemDate >= lastMonth && itemDate <= now;
      }
      return true;
    });
  };

  const filteredData = filterByTime(locations);

  if (!user) return null;

  return (
    <main style={containerStyle}>
      <div style={glassCard}>
        {/* Sidebar: ส่วนข้อมูลผู้ใช้และตัวกรอง */}
        <aside style={sidebar}>
          <div style={userSection}>
            <img 
              src={user.profileImage || '/avatar-placeholder.png'} 
              style={avatarStyle} 
              alt="User" 
              onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + user.firstName + "&background=6D28D9&color=fff"; }}
            />
            <h3 style={userName}>{user.firstName}</h3>
            <p style={userEmail}>{user.email}</p>
          </div>
          
          <div style={filterGroup}>
             <label style={labelStyle}><Clock size={16}/> ช่วงเวลา</label>
             <select 
                value={timeFilter} 
                onChange={(e) => setTimeFilter(e.target.value)} 
                style={selectStyle}
             >
                <option value="all">ทั้งหมดที่ผ่านมา</option>
                <option value="today">เฉพาะวันนี้</option>
                <option value="last_week">7 วันที่ผ่านมา</option>
                <option value="last_month">30 วันที่ผ่านมา</option>
             </select>
          </div>
        </aside>

        {/* Main Content: รายการประวัติ */}
        <section style={mainContent}>
          {/* Tab Switcher */}
          <div style={tabSwitcher}>
            <button style={activeTab}>ประวัติการใช้งาน</button>
            <button style={inactiveTab} onClick={() => router.push('/favorites')}>รายการโปรด</button>
          </div>

          <div style={listHeader}>
             <h2 style={titleStyle}>ประวัติการค้นหา</h2>
             <span style={countTag}>{filteredData.length} รายการ</span>
          </div>

          <div style={listScroll}>
            {filteredData.length > 0 ? filteredData.map((item) => (
              <div key={item.id} style={itemCard} onClick={() => handleViewDetail(item.id)}>
                <div style={flexCenter}>
                  <div style={item.type === 'forest' ? iconForest : iconSea}>
                    {item.type === 'forest' ? '🌳' : '🌊'}
                  </div>
                  <div>
                    <h4 style={nameStyle}>{item.name}</h4>
                    <div style={metaFlex}>
                      <span style={subStyle}><Calendar size={12}/> {item.date}</span>
                      <span style={subStyle}><Clock size={12}/> {item.time} น.</span>
                    </div>
                  </div>
                </div>
                
                <div style={flexCenter}>
                  <button 
                    style={favBtn} 
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                  >
                    <Heart 
                      size={20} 
                      fill={item.isFavorite ? "#EF4444" : "none"} 
                      color={item.isFavorite ? "#EF4444" : "#CBD5E1"} 
                    />
                  </button>
                  <ChevronRight size={18} color="#CBD5E1" style={{ marginLeft: '10px' }} />
                </div>
              </div>
            )) : (
              <div style={emptyState}>
                <Clock size={48} color="#CBD5E1" strokeWidth={1} />
                <p>ไม่พบประวัติการค้นหาในช่วงเวลานี้</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px' }}>กำลังโหลด...</div>}>
      <HistoryContent />
    </Suspense>
  );
}

// --- Styles (CSS-in-JS) ---
const containerStyle = { minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'center', padding: '120px 20px 40px', fontFamily: 'Anuphan, sans-serif' };
const glassCard = { background: 'white', width: '100%', maxWidth: '1000px', borderRadius: '32px', display: 'grid', gridTemplateColumns: '280px 1fr', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' };
const sidebar = { padding: '40px 30px', borderRight: '1px solid #F1F5F9', background: '#FFFFFF' };
const mainContent = { padding: '40px', display: 'flex', flexDirection: 'column' };
const tabSwitcher = { display: 'flex', background: '#F1F5F9', padding: '6px', borderRadius: '16px', marginBottom: '30px', width: 'fit-content', alignSelf: 'center' };
const activeTab = { border: 'none', padding: '10px 25px', borderRadius: '12px', background: '#1E1B4B', color: 'white', fontWeight: '700', cursor: 'default' };
const inactiveTab = { border: 'none', padding: '10px 25px', borderRadius: '12px', background: 'transparent', color: '#94A3B8', fontWeight: '700', cursor: 'pointer' };
const itemCard = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 25px', borderRadius: '22px', border: '1.5px solid #F1F5F9', marginBottom: '12px', cursor: 'pointer', transition: '0.3s' };
const userSection = { textAlign: 'center', marginBottom: '30px' };
const avatarStyle = { width: '80px', height: '80px', borderRadius: '25px', objectFit: 'cover', border: '3px solid #6366F1' };
const userName = { margin: '12px 0 0', color: '#1E293B', fontWeight: '800' };
const userEmail = { margin: '4px 0 0', color: '#94A3B8', fontSize: '0.85rem' };
const filterGroup = { marginTop: '20px' };
const labelStyle = { fontSize: '0.8rem', fontWeight: '700', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' };
const selectStyle = { width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #E2E8F0', outline: 'none', cursor: 'pointer', backgroundColor: '#F8FAFC' };
const iconForest = { width: '45px', height: '45px', borderRadius: '14px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', fontSize: '1.2rem' };
const iconSea = { ...iconForest, background: '#DBEAFE' };
const flexCenter = { display: 'flex', alignItems: 'center' };
const metaFlex = { display: 'flex', gap: '12px', marginTop: '4px' };
const nameStyle = { margin: 0, fontSize: '1.05rem', color: '#1E293B', fontWeight: '700' };
const subStyle = { fontSize: '0.85rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' };
const listScroll = { overflowY: 'auto', maxHeight: '550px', paddingRight: '10px' };
const titleStyle = { fontSize: '1.4rem', fontWeight: '800', color: '#1E293B', margin: 0 };
const listHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const countTag = { background: '#F1F5F9', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', color: '#64748B', fontWeight: '700' };
const favBtn = { border: 'none', background: 'none', cursor: 'pointer', padding: '5px' };
const emptyState = { textAlign: 'center', padding: '80px 0', color: '#CBD5E1' };