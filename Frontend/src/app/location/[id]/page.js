'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MapPin, Clock, Star, Navigation2, Heart, ArrowLeft } from 'lucide-react';

export default function LocationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [location, setLocation] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const mockDetails = {
      id: id,
      name: id === '1' ? 'ปะปานคร นครปฐม' : 'Common Room Library',
      images: [
        'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80',
        'https://images.unsplash.com/photo-1511497584788-876760111969?q=80',
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80'
      ],
      dist: '1.2 กม.',
      rating: '4.9',
      openTime: '09:00 - 18:00 น.',
      fullDetail: 'สถานที่พักผ่อนที่ออกแบบมาเพื่อความผ่อนคลายโดยเฉพาะ บรรยากาศเงียบสงบพร้อมวิวธรรมชาติที่สวยงาม',
      tags: ['เงียบสงบ', 'ธรรมชาติ', 'ยอดนิยม'],
      type: id === '1' ? 'forest' : 'sea'
    };
    setLocation(mockDetails);

    // ตรวจสอบสถานะหัวใจจาก LocalStorage
    const savedFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(savedFavs.some(item => item.id === id));
  }, [id]);

  const toggleFavorite = () => {
    const savedFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
    let updatedFavs;

    if (isFavorite) {
      updatedFavs = savedFavs.filter(item => item.id !== id);
    } else {
      updatedFavs = [...savedFavs, {
        id: location.id,
        name: location.name,
        date: new Date().toLocaleDateString('th-TH'),
        type: location.type,
        isFavorite: true
      }];
    }

    localStorage.setItem('favorites', JSON.stringify(updatedFavs));
    setIsFavorite(!isFavorite);
    window.dispatchEvent(new Event('storage')); // แจ้งเตือนหน้าอื่น
  };

  if (!location) return <div style={loadingStyle}>กำลังโหลดข้อมูล...</div>;

  return (
    <main style={mainWrapper}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anuphan:wght@300;400;600;700&display=swap');
        .action-btn { transition: all 0.2s ease; cursor: pointer; border: none; outline: none; }
        .action-btn:active { transform: scale(0.9); }
      `}</style>

      <div style={layoutContainer}>
        <div style={backContainer}>
          <button onClick={() => router.back()} className="action-btn" style={backBtnStyle}>
            <ArrowLeft size={20} /> ย้อนกลับ
          </button>
        </div>

        <div style={detailCardStyle}>
          <div style={{ position: 'relative', height: '350px', display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '10px', padding: '12px' }}>
            {/* ปุ่มกดใจ */}
            <button 
              style={{...favBtnInside, color: isFavorite ? "#EF4444" : "#1E1B4B"}} 
              onClick={toggleFavorite} 
              className="action-btn"
            >
              <Heart size={22} fill={isFavorite ? "#EF4444" : "none"} />
            </button>

            <img src={location.images[0]} style={{...imgCover, borderRadius: '20px'}} alt="main" />
            <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: '10px' }}>
              <img src={location.images[1]} style={imgCover} alt="sub1" />
              <img src={location.images[2]} style={imgCover} alt="sub2" />
            </div>
          </div>

          <div style={contentBody}>
            <h1 style={titleStyle}>{location.name}</h1>
            <div style={infoGrid}>
              <div style={infoItem}><MapPin size={18} color="#6366F1" /> <div><b>ระยะทาง</b><br/>{location.dist}</div></div>
              <div style={infoItem}><Clock size={18} color="#6366F1" /> <div><b>เวลาทำการ</b><br/>{location.openTime}</div></div>
            </div>
            <p style={descText}>{location.fullDetail}</p>
            <button style={mapBtnStyle} className="action-btn"> <Navigation2 size={18} fill="white" /> นำทางไปพิกัดนี้ </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// --- Styles (ตัดมาเฉพาะส่วนสำคัญ) ---
const mainWrapper = { minHeight: '100vh', backgroundColor: '#F1F5F9', display: 'flex', justifyContent: 'center', padding: '140px 20px', fontFamily: "'Anuphan', sans-serif" };
const layoutContainer = { width: '100%', maxWidth: '700px' };
const backContainer = { marginBottom: '15px' };
const backBtnStyle = { background: 'none', color: '#64748B', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' };
const detailCardStyle = { backgroundColor: 'white', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', position: 'relative' };
const favBtnInside = { position: 'absolute', top: '25px', right: '25px', zIndex: 10, width: '45px', height: '45px', borderRadius: '50%', background: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
const imgCover = { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '15px' };
const contentBody = { padding: '30px 40px' };
const titleStyle = { fontSize: '1.8rem', fontWeight: '800', color: '#1E1B4B' };
const infoGrid = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', margin: '20px 0' };
const infoItem = { display: 'flex', alignItems: 'center', gap: '10px', background: '#F8FAFC', padding: '15px', borderRadius: '20px' };
const descText = { color: '#64748B', lineHeight: '1.8', marginBottom: '25px' };
const mapBtnStyle = { width: '100%', background: '#1E1B4B', color: 'white', padding: '18px', borderRadius: '22px', fontWeight: '700' };
const loadingStyle = { textAlign: 'center', padding: '100px' };