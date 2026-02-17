'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Star, ChevronRight, Calendar, Trash2, MapPin, Clock } from 'lucide-react';

export default function FavoritesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // ดึงข้อมูล User ใช้ Logic เดียวกับหน้า History
    const savedUser = localStorage.getItem('user_profile') || localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      router.push('/login');
    }

    const loadFavs = () => {
      const data = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(data);
    };

    loadFavs();
    window.addEventListener('storage', loadFavs);
    window.addEventListener('favoriteUpdate', loadFavs);
    return () => {
      window.removeEventListener('storage', loadFavs);
      window.removeEventListener('favoriteUpdate', loadFavs);
    };
  }, [router]);

  const removeFavorite = (e, id) => {
    e.stopPropagation();
    const updatedFavs = favorites.filter(item => item.id !== id);
    localStorage.setItem('favorites', JSON.stringify(updatedFavs));
    setFavorites(updatedFavs);
    window.dispatchEvent(new Event('favoriteUpdate'));
  };

  if (!user) return null;

  return (
    <main style={containerStyle}>
      <style>{`
        .fav-card { transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
        .fav-card:hover { transform: translateY(-4px); box-shadow: 0 12px 20px rgba(0,0,0,0.08); border-color: #6366F1 !important; }
      `}</style>

      <div style={glassCard}>
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
             <div style={sidebarInfoBox}>
                <div style={statCircle}>{favorites.length}</div>
                <p style={statLabel}>สถานที่โปรด</p>
             </div>
          </div>
        </aside>

        <section style={mainContent}>
          {/* Tab Switcher: ปรับขนาดและความกว้างให้เท่ากับหน้า History เป๊ะ */}
          <div style={tabSwitcher}>
            <div style={{...tabSlider, transform: 'translateX(100%)'}} /> 
            <button style={inactiveTab} onClick={() => router.push('/history')}>ประวัติการใช้งาน</button>
            <button style={activeTab}>รายการโปรด</button>
          </div>

          <div style={listHeader}>
             <h2 style={titleStyle}>รายการโปรด</h2>
             <span style={countTag}>{favorites.length} รายการ</span>
          </div>

          <div style={listScroll}>
            {favorites.length > 0 ? favorites.map((item) => (
              <div key={item.id} className="fav-card" style={itemCard} onClick={() => router.push(`/location/${item.id}`)}>
                <div style={flexCenter}>
                  <div style={item.type === 'forest' ? iconForest : iconSea}>
                    {item.type === 'forest' ? '🌳' : '🌊'}
                  </div>
                  <div>
                    <h4 style={nameStyle}>{item.name}</h4>
                    <div style={metaFlex}>
                      <span style={subStyle}><Calendar size={12}/> {item.date}</span>
                      <span style={subStyle}><MapPin size={12}/> {item.type === 'forest' ? 'ธรรมชาติ' : 'ทะเล'}</span>
                    </div>
                  </div>
                </div>
                
                <div style={flexCenter}>
                  <button 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }} 
                    onClick={(e) => removeFavorite(e, item.id)}
                  >
                    <Trash2 size={18} color="#EF4444" />
                  </button>
                  <ChevronRight size={18} color="#CBD5E1" style={{ marginLeft: '10px' }} />
                </div>
              </div>
            )) : (
              <div style={emptyState}>
                <Heart size={48} color="#E2E8F0" style={{ marginBottom: '15px' }} />
                <p>ยังไม่มีรายการโปรด</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

// --- Styles: ใช้ตัวแปรเดียวกับหน้า History เพื่อให้ขนาดเท่ากันทั้งหมด ---
const containerStyle = { minHeight: '100vh', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'center', padding: '120px 20px 40px', fontFamily: 'Anuphan, sans-serif' };
const glassCard = { background: 'white', width: '100%', maxWidth: '1000px', borderRadius: '32px', display: 'grid', gridTemplateColumns: '280px 1fr', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' };
const sidebar = { padding: '40px 30px', borderRight: '1px solid #F1F5F9', background: '#FFFFFF' };
const mainContent = { padding: '40px', display: 'flex', flexDirection: 'column' };

const tabSwitcher = { display: 'flex', background: '#F1F5F9', padding: '6px', borderRadius: '16px', marginBottom: '30px', width: 'fit-content', alignSelf: 'center', position: 'relative' };
const tabSlider = { position: 'absolute', top: '6px', left: '6px', width: 'calc(50% - 6px)', height: 'calc(100% - 12px)', background: '#1E1B4B', borderRadius: '12px', transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', zIndex: 1 };
const activeTab = { border: 'none', padding: '10px 25px', borderRadius: '12px', background: 'transparent', color: 'white', fontWeight: '700', position: 'relative', zIndex: 2, cursor: 'default' };
const inactiveTab = { border: 'none', padding: '10px 25px', borderRadius: '12px', background: 'transparent', color: '#94A3B8', fontWeight: '700', position: 'relative', zIndex: 2, cursor: 'pointer' };

const itemCard = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 25px', borderRadius: '22px', border: '1.5px solid #F1F5F9', marginBottom: '12px', cursor: 'pointer', backgroundColor: 'white' };
const userSection = { textAlign: 'center', marginBottom: '30px' };
const avatarStyle = { width: '80px', height: '80px', borderRadius: '25px', objectFit: 'cover', border: '3px solid #6366F1' };
const userName = { margin: '12px 0 0', color: '#1E293B', fontWeight: '800' };
const userEmail = { margin: '4px 0 0', color: '#94A3B8', fontSize: '0.85rem' };
const filterGroup = { marginTop: '20px' };
const sidebarInfoBox = { textAlign: 'center', background: '#F8FAFC', padding: '20px', borderRadius: '24px' };
const statCircle = { fontSize: '1.8rem', fontWeight: '800', color: '#6366F1' };
const statLabel = { fontSize: '0.85rem', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase', margin: 0 };

const iconForest = { width: '45px', height: '45px', borderRadius: '14px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '15px', fontSize: '1.2rem' };
const iconSea = { ...iconForest, background: '#DBEAFE' };
const flexCenter = { display: 'flex', alignItems: 'center' };
const metaFlex = { display: 'flex', gap: '12px', marginTop: '4px' };
const nameStyle = { margin: 0, fontSize: '1.05rem', color: '#1E293B', fontWeight: '700' };
const subStyle = { fontSize: '0.85rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' };
const listScroll = { overflowY: 'auto', maxHeight: '550px', paddingRight: '10px' };
const titleStyle = { fontSize: '1.4rem', fontWeight: '800', color: '#1E1B4B', margin: 0 };
const listHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const countTag = { background: '#F1F5F9', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', color: '#64748B', fontWeight: '700' };
const emptyState = { textAlign: 'center', padding: '80px 0', color: '#CBD5E1' };