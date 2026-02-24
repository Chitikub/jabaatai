'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, Heart, ChevronRight, Calendar, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

// 👇 อย่าลืมตรวจสอบ Path ของ Navbar ให้ตรงกับโปรเจกต์คุณ (เช่น '../components/Navbar' หรือ './Navbar')
import Navbar from '../components/Navbar'; 

function HistoryContent() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
          router.push('/login');
          return;
        }
        
        const userData = JSON.parse(savedUser);
        setUser(userData);
        
        // 🔑 ดึง Token เพื่อใช้ยืนยันตัวตน
        const token = localStorage.getItem('token') || userData.token;

        // 🚀 แนบ Token ไปกับ Header
        const response = await fetch(`http://localhost:5000/api/history/${userData.id || userData._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });

        // จัดการกรณี Token หมดอายุ (401)
        if (response.status === 401) {
          Swal.fire('เซสชันหมดอายุ', 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง', 'warning').then(() => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            router.push('/login');
          });
          return;
        }

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            // ดึงข้อมูล Favorites จาก LocalStorage มาเปรียบเทียบ
            const savedFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
            const favIds = new Set(savedFavs.map(f => f.id));

            // Merge ข้อมูล
            const mergedData = data.map(item => ({
              ...item,
              id: item.locationId, 
              isFavorite: favIds.has(item.locationId)
            }));

            setLocations(mergedData);
          }
        }
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

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

    // แจ้งเตือน Component อื่นๆ ให้ดึงข้อมูลใหม่
    window.dispatchEvent(new Event('favoriteUpdate'));
    window.dispatchEvent(new Event('storage'));
  };

  const handleViewDetail = (id) => {
    router.push(`/location/${id}`);
  };

  const filterByTime = (data) => {
    const now = new Date();
    return data.filter(item => {
      if (!item.date) return true; // กัน Error กรณีข้อมูลเก่าไม่มีวันที่
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

  // UI ตอนกำลังโหลดข้อมูล
  if (loading || !user) return (
    <>
      <Navbar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f4f7ff' }}>
        <Loader2 className="spinner" size={40} color="#0F172A" style={{ marginBottom: '15px' }} />
        <p style={{ fontWeight: 'bold', color: '#64748B', fontFamily: 'sans-serif' }}>กำลังโหลดประวัติ...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .spinner { animation: spin 1s linear infinite; }`}</style>
      </div>
    </>
  );

  return (
    <>
      <Navbar />

      <main className="page-container">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&display=swap');
          
          .page-container { 
            min-height: 100vh; 
            background-color: #f4f7ff;
            background-image: 
              radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.15) 0px, transparent 50%);
            display: flex; 
            justify-content: center; 
            padding: 120px 20px 40px; 
            font-family: 'IBM Plex Sans Thai', 'Plus Jakarta Sans', sans-serif; 
          }

          .glass-card { 
            background: rgba(255, 255, 255, 0.85); 
            backdrop-filter: blur(20px);
            width: 100%; 
            max-width: 1000px; 
            border-radius: 32px; 
            display: grid; 
            grid-template-columns: 280px 1fr; 
            overflow: hidden; 
            box-shadow: 0 20px 50px rgba(15, 23, 42, 0.05); 
            border: 1px solid rgba(255, 255, 255, 0.5);
            animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }

          /* Sidebar */
          .sidebar { 
            padding: 40px 30px; 
            border-right: 1px solid rgba(226, 232, 240, 0.8); 
            background: rgba(255, 255, 255, 0.4); 
          }

          .avatar-wrapper { 
            width: 85px; height: 85px; border-radius: 50%; overflow: hidden; 
            border: 3px solid #fff; margin: 0 auto 15px;
            box-shadow: 0 8px 20px rgba(15,23,42,0.1);
          }

          .select-style { 
            width: 100%; padding: 14px 16px; border-radius: 16px; 
            border: 2px solid #E2E8F0; outline: none; cursor: pointer; 
            background-color: rgba(255,255,255,0.9); font-family: inherit;
            color: #1E293B; font-weight: 500; transition: 0.3s;
          }
          .select-style:focus { border-color: #0F172A; box-shadow: 0 4px 15px rgba(15, 23, 42, 0.05); }

          /* Main Content */
          .main-content { padding: 40px; display: flex; flex-direction: column; }

          .tab-switcher { 
            display: flex; 
            background: rgba(241, 245, 249, 0.8); 
            padding: 6px; 
            border-radius: 100px; 
            margin-bottom: 35px; 
            width: fit-content; 
            align-self: center;
            border: 1px solid rgba(255,255,255,0.8);
          }

          .active-tab { 
            border: none; padding: 12px 28px; border-radius: 100px; 
            background: #0F172A; color: white; font-weight: 700; cursor: default; 
            box-shadow: 0 8px 15px -5px rgba(15, 23, 42, 0.3);
            transition: 0.3s;
          }

          .inactive-tab { 
            border: none; padding: 12px 28px; border-radius: 100px; 
            background: transparent; color: #64748B; font-weight: 600; cursor: pointer; 
            transition: all 0.3s;
          }
          .inactive-tab:hover { color: #0F172A; background: rgba(255,255,255,0.5); }

          /* List Items */
          .item-card { 
            display: flex; justify-content: space-between; align-items: center; 
            padding: 20px 25px; border-radius: 20px; border: 1.5px solid #F1F5F9; 
            margin-bottom: 12px; cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            background: rgba(255,255,255,0.7);
          }
          .item-card:hover { 
            transform: translateY(-4px) scale(1.01); 
            border-color: #E2E8F0; 
            box-shadow: 0 12px 25px -5px rgba(15, 23, 42, 0.08); 
            background: #ffffff;
          }

          .icon-box { 
            width: 50px; height: 50px; border-radius: 16px; 
            display: flex; align-items: center; justify-content: center; 
            margin-right: 18px; font-size: 1.3rem; 
            box-shadow: inset 0 2px 4px rgba(255,255,255,0.5);
          }

          .fav-btn { 
            border: none; background: #F8FAFC; border-radius: 50%; 
            padding: 10px; cursor: pointer; transition: all 0.3s; 
            display: flex; align-items: center; justify-content: center;
          }
          .fav-btn:hover { background: #FEF2F2; transform: scale(1.15); }

          /* Scrollbar */
          .list-scroll { 
            overflow-y: auto; max-height: 550px; padding-right: 10px; 
          }
          .list-scroll::-webkit-scrollbar { width: 6px; }
          .list-scroll::-webkit-scrollbar-track { background: transparent; }
          .list-scroll::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
          .list-scroll::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }

          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }

          /* Responsive */
          @media (max-width: 768px) {
            .glass-card { grid-template-columns: 1fr; border-radius: 24px; }
            .sidebar { border-right: none; border-bottom: 1px solid rgba(226, 232, 240, 0.8); padding: 30px 20px; }
            .main-content { padding: 30px 20px; }
            .tab-switcher { width: 100%; display: flex; justify-content: center; }
            .item-card { flex-direction: column; align-items: flex-start; gap: 15px; }
            .item-card > div:last-child { align-self: flex-end; }
          }
        `}</style>

        <div className="glass-card">
          {/* Sidebar */}
          <aside className="sidebar">
            <div style={{ textAlign: 'center', marginBottom: '35px' }}>
              <div className="avatar-wrapper">
                <img
                  src={user.profileImage || `https://ui-avatars.com/api/?name=${user.firstName || 'User'}&background=0F172A&color=fff&bold=true`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  alt="User"
                />
              </div>
              <h3 style={{ margin: '0', color: '#0F172A', fontWeight: '800', fontSize: '1.3rem', letterSpacing: '-0.5px' }}>
                {user.firstName} {user.lastName}
              </h3>
              <p style={{ margin: '4px 0 0', color: '#64748B', fontSize: '0.9rem' }}>{user.email}</p>
            </div>

            <div style={{ marginTop: '20px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px', paddingLeft: '5px' }}>
                <Clock size={16} /> กรองช่วงเวลา
              </label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="select-style"
              >
                <option value="all">ทั้งหมดที่ผ่านมา</option>
                <option value="today">เฉพาะวันนี้</option>
                <option value="last_week">7 วันที่ผ่านมา</option>
                <option value="last_month">30 วันที่ผ่านมา</option>
              </select>
            </div>
          </aside>

          {/* Main Content */}
          <section className="main-content">
            {/* Tab Switcher */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="tab-switcher">
                <button className="active-tab">ประวัติการใช้งาน</button>
                <button className="inactive-tab" onClick={() => router.push('/favorites')}>รายการโปรด</button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '25px' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0F172A', margin: 0, letterSpacing: '-0.5px' }}>
                ประวัติการค้นหา
              </h2>
              <span style={{ background: '#F1F5F9', padding: '6px 16px', borderRadius: '100px', fontSize: '0.85rem', color: '#475569', fontWeight: '700' }}>
                {filteredData.length} รายการ
              </span>
            </div>

            <div className="list-scroll">
              {filteredData.length > 0 ? filteredData.map((item) => (
                <div key={item.id} className="item-card" onClick={() => handleViewDetail(item.id)}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="icon-box" style={{ background: item.type === 'forest' ? '#DCFCE7' : item.type === 'cafe' ? '#FEF3C7' : '#DBEAFE' }}>
                      {item.type === 'forest' ? '🌳' : item.type === 'cafe' ? '☕' : '🌊'}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#1E293B', fontWeight: '700' }}>{item.name}</h4>
                      <div style={{ display: 'flex', gap: '15px', marginTop: '6px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Calendar size={14} /> {item.date || 'ไม่ระบุวันที่'}
                        </span>
                        <span style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Clock size={14} /> {item.time || '-'} น.
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                      className="fav-btn"
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(item.id); }}
                    >
                      <Heart
                        size={20}
                        fill={item.isFavorite ? "#EF4444" : "none"}
                        color={item.isFavorite ? "#EF4444" : "#94A3B8"}
                      />
                    </button>
                    <ChevronRight size={20} color="#CBD5E1" style={{ marginLeft: '12px' }} />
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '80px 0', color: '#94A3B8' }}>
                  <Clock size={64} color="#E2E8F0" strokeWidth={1.5} style={{ margin: '0 auto 20px' }} />
                  <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#475569' }}>ไม่พบประวัติการค้นหาในช่วงเวลานี้</p>
                  <p style={{ fontSize: '0.95rem', marginTop: '8px' }}>ลองปรับช่วงเวลา หรือกลับไปค้นหาสถานที่ใหม่กันเลย!</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f4f7ff' }}>
        <Loader2 className="spinner" size={40} color="#0F172A" />
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } } .spinner { animation: spin 1s linear infinite; }`}</style>
      </div>
    }>
      <HistoryContent />
    </Suspense>
  );
}