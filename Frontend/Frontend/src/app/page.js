'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function HomePage() {
  const router = useRouter();
  const [displayData, setDisplayData] = useState({
    mood: null,
    personality: '',
    show: false
  });
  const resultsRef = useRef(null);

  const moods = [
    { name: 'สดใส', emoji: '😊' },
    { name: 'หัวร้อน', emoji: '🔥' },
    { name: 'เบื่อๆ', emoji: '😴' },
    { name: 'เหงา', emoji: '💜' },
    { name: 'เศร้า', emoji: '😢' }
  ];

  const moodLocations = {
    'สดใส': {
      introvert: [{ id: '101', name: 'สวนพฤกษศาสตร์', info: 'สงบ เป็นส่วนตัว', rating: '4.8', mainImg: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1000' }],
      extrovert: [{ id: '104', name: 'เทศกาลดนตรี', info: 'สนุกกับฝูงชน', rating: '4.9', mainImg: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000' }],
      ambivert: [{ id: '107', name: 'คาเฟ่แมว', info: 'เล่นกับน้องแมว', rating: '4.7', mainImg: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1000' }]
    },
    'หัวร้อน': {
      introvert: [{ id: '201', name: 'น้ำตกลับกลางป่า', info: 'แช่น้ำเย็นหลบความวุ่นวาย', rating: '4.9', mainImg: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000' }],
      extrovert: [{ id: '204', name: 'สวนน้ำสไลเดอร์', info: 'ระบายอารมณ์', rating: '4.8', mainImg: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?q=80&w=1000' }],
      ambivert: [{ id: '207', name: 'ลานไอซ์สเก็ต', info: 'ลื่นไหลไปกับความเย็น', rating: '4.2', mainImg: 'https://images.unsplash.com/photo-1517177326540-866403d9860b?q=80&w=1000' }]
    },
    'เบื่อๆ': {
      introvert: [{ id: '301', name: 'ท้องฟ้าจำลอง', info: 'นอนดูดาวลืมความเบื่อ', rating: '4.7', mainImg: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1000' }],
      extrovert: [{ id: '304', name: 'ห้องเกม VR', info: 'แก้เซ็งในโลกเสมือน', rating: '4.6', mainImg: 'https://images.unsplash.com/photo-1611388581142-11f6fbc266cf?q=80&w=1000' }],
      ambivert: [{ id: '307', name: 'คาเฟ่บอร์ดเกม', info: 'เล่นเกมกับเพื่อน', rating: '4.5', mainImg: 'https://images.unsplash.com/photo-1610890732551-f8389b657497?q=80&w=1000' }]
    },
    'เหงา': {
      introvert: [{ id: '401', name: 'ดาดฟ้ารับลม', info: 'ชมวิวเมืองคนเดียว', rating: '4.3', mainImg: 'https://images.unsplash.com/photo-1449156059431-787c5b769242?q=80&w=1000' }],
      extrovert: [{ id: '404', name: 'บาร์ลับดนตรีแจ๊ส', info: 'ฟังเพลงพบเพื่อนใหม่', rating: '4.5', mainImg: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a9?q=80&w=1000' }],
      ambivert: [{ id: '407', name: 'สวนริมน้ำสะพานพุทธ', info: 'เดินเล่นรับลม', rating: '4.4', mainImg: 'https://images.unsplash.com/photo-1536431311719-398b6704d40f?q=80&w=1000' }]
    },
    'เศร้า': {
      introvert: [{ id: '501', name: 'ชายหาดเงียบสงบ', info: 'ฟังเสียงคลื่นปลอบโยน', rating: '4.8', mainImg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000' }],
      extrovert: [{ id: '504', name: 'ปาร์ตี้คาราโอเกะ', info: 'ร้องเพลงระบายความเศร้า', rating: '4.6', mainImg: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1000' }],
      ambivert: [{ id: '507', name: 'คาเฟ่ระบายสี', info: 'วาดภาพระบายอารมณ์', rating: '4.7', mainImg: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000' }]
    }
  };

  const startSearch = async (moodObj) => {
    Swal.fire({
      title: 'วิเคราะห์สำเร็จ!',
      html: `อารมณ์ของคุณ: <b style="color: #6D28D9;">"${moodObj.name}"</b>`,
      icon: 'success',
      timer: 800,
      showConfirmButton: false,
      customClass: { popup: 'swal-rounded' }
    });

    const { value: person } = await Swal.fire({
      title: 'สไตล์ของคุณคือ?',
      html: `
        <div style="display: grid; grid-template-columns: 1fr; gap: 12px; margin-top: 15px;">
          <div id="p-intro" class="sel-box">🌿 Introvert (ไปคนเดียว)</div>
          <div id="p-extro" class="sel-box">🥳 Extrovert (ไปเจอคน)</div>
          <div id="p-ambi" class="sel-box">⚖️ Ambivert (กึ่งกลาง)</div>
        </div>
      `,
      showConfirmButton: false,
      didOpen: () => {
        document.getElementById('p-intro').onclick = () => Swal.clickConfirm('introvert');
        document.getElementById('p-extro').onclick = () => Swal.clickConfirm('extrovert');
        document.getElementById('p-ambi').onclick = () => Swal.clickConfirm('ambivert');
      },
      customClass: { popup: 'swal-rounded' }
    });

    if (person) {
      setDisplayData({ mood: moodObj, personality: person, show: true });
    }
  };

  // แก้ปัญหา useEffect changed size: ล็อก Dependency ให้คงที่
  useEffect(() => {
    if (displayData.show) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayData.show]); 

  // ป้องกัน Error และดึงข้อมูลสถานที่
  const currentMood = displayData.mood?.name || '';
  const currentPerson = String(displayData.personality || '');
  const locationsToShow = moodLocations[currentMood]?.[currentPerson] || [];

  return (
    <main style={mainStyle}>
      <style>{`
        .swal-rounded { border-radius: 40px !important; font-family: inherit; }
        .mood-btn { padding: 25px; background: #fff; border: none; border-radius: 35px; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .mood-btn:hover { transform: translateY(-8px); box-shadow: 0 12px 25px rgba(109, 40, 217, 0.12); }
        .sel-box { padding: 18px 25px; border: 2px solid #F1F5F9; border-radius: 20px; cursor: pointer; transition: 0.3s; text-align: left; font-weight: 700; color: #4B5563; }
        .sel-box:hover { border-color: #6D28D9; background: #F5F3FF; transform: translateX(5px); }
        .card-premium { background: #fff; border-radius: 45px; padding: 35px; margin-bottom: 25px; border: 1px solid #F1F5F9; transition: 0.4s; cursor: pointer; animation: fadeIn 0.6s ease-out; }
        .card-premium:hover { transform: scale(1.02); box-shadow: 0 20px 45px rgba(0,0,0,0.06); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* เลือกอารมณ์ */}
      <section style={headerSection}>
        <h1 style={titleStyle}>วันนี้พิกัดไหนดี?</h1>
        <div style={moodGrid}>
          {moods.map((m) => (
            <button key={m.name} onClick={() => startSearch(m)} className="mood-btn">
              <div style={{ fontSize: '3.5rem' }}>{m.emoji}</div>
              <div style={{ fontWeight: '800', color: '#1F2937', marginTop: '12px' }}>{m.name}</div>
            </button>
          ))}
        </div>
      </section>

      {/* แสดงผลลัพธ์ */}
      <section ref={resultsRef} style={resultsWrapper}>
        <div style={dashedBox}>
          {displayData.show ? (
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
                <div style={{ fontSize: '3.5rem', background: '#FFD93D', padding: '15px', borderRadius: '25px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                    {displayData.mood?.emoji}
                </div>
                <div>
                    <h2 style={{ fontSize: '2.4rem', fontWeight: '900', margin: 0 }}>
                        พิกัดสำหรับสาย <span style={{color: '#6D28D9'}}>{currentPerson.toUpperCase()}</span>
                    </h2>
                    <p style={{ color: '#666', fontWeight: '700', fontSize: '1.2rem' }}>อารมณ์ตอนนี้: {currentMood}</p>
                </div>
              </div>

              {locationsToShow.length > 0 ? (
                locationsToShow.map((loc) => (
                  <div key={loc.id} onClick={() => router.push(`/details/${loc.id}`)} className="card-premium">
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
                      <div>
                        <img src={loc.mainImg} style={mainImgStyle} alt={loc.name} />
                        <h4 style={{ margin: '20px 0 8px', fontSize: '2.2rem', fontWeight: '900' }}>{loc.name}</h4>
                        <div style={{ fontWeight: '800', fontSize: '1.2rem' }}>{loc.rating} <span style={{color: '#FBBF24'}}>★</span></div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={subImgGrid}>
                          <div style={subBox}>🖼️</div>
                          <div style={subBox}>📷</div>
                        </div>
                        <div style={infoRow}><span>{loc.info}</span> <span>📍</span></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '50px' }}>
                  <p style={{ fontSize: '1.8rem', fontWeight: '700', color: '#999' }}>ขออภัย ไม่พบข้อมูลสถานที่ในหมวดนี้ 😢</p>
                </div>
              )}
            </div>
          ) : (
            <div style={{ opacity: 0.3, textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🧭</div>
              <p style={{ fontSize: '1.5rem', fontWeight: '700' }}>เลือกอารมณ์เพื่อเริ่มปักหมุด</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

// --- Styles ---
const mainStyle = { paddingTop: '80px', minHeight: '100vh', background: 'radial-gradient(at top, #F5F3FF, #FFFFFF)', padding: '40px' };
const headerSection = { textAlign: 'center', maxWidth: '1000px', margin: '0 auto 80px' };
const titleStyle = { fontSize: '3.5rem', fontWeight: '900', color: '#111827', marginBottom: '60px' };
const moodGrid = { display: 'flex', justifyContent: 'center', gap: '25px', flexWrap: 'wrap' };
const resultsWrapper = { maxWidth: '1400px', margin: '0 auto', paddingBottom: '100px' };
const dashedBox = { padding: '80px 60px', borderRadius: '60px', border: '4px dashed #E9D5FF', background: 'rgba(255,255,255,0.7)', minHeight: '600px', display: 'flex', justifyContent: 'center', alignItems: 'center' };
const mainImgStyle = { width: '100%', height: '350px', borderRadius: '35px', objectFit: 'cover' };
const subImgGrid = { display: 'grid', gridTemplateRows: '1fr 1fr', gap: '20px', height: '350px' };
const subBox = { background: '#F3F4F6', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' };
const infoRow = { display: 'flex', justifyContent: 'space-between', padding: '30px 40px', background: '#F9FAFB', borderRadius: '22px', fontSize: '1.4rem', fontWeight: '700', color: '#374151' };