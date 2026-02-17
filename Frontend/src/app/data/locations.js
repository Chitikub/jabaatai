'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

// --- รวมข้อมูลไว้ที่นี่เพื่อความชัวร์ (ไม่ต้อง Import จากไฟล์อื่น) ---
export const moods = [
  { id: 'happy', name: 'สดใส', emoji: '😊', color: '#FFD93D' },
  { id: 'angry', name: 'หัวร้อน', emoji: '😡', color: '#FF6B6B' },
  { id: 'bored', name: 'เบื่อๆ', emoji: '😑', color: '#A8A8A8' },
  { id: 'lonely', name: 'เหงา', emoji: '💜', color: '#6D28D9' },
  { id: 'sad', name: 'เศร้า', emoji: '😢', color: '#4D96FF' }
];

const demoPlaces = [
  { 
    id: '1', 
    name: 'กุ้งอบภูเขาไฟ', 
    info: 'พิกัดนครปฐม อาหารอร่อย บรรยากาศยอดฮิต', 
    rating: '4.1', 
    img: 'https://images.unsplash.com/photo-1559737558-2f5a35f4523b?q=80' 
  },
  { 
    id: '2', 
    name: 'สวนพฤกษศาสตร์', 
    info: 'เดินชมพรรณไม้ สูดอากาศบริสุทธิ์', 
    rating: '4.8', 
    img: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80' 
  }
];

export const allLocations = {
  'happy-introvert': demoPlaces,
  'happy-extrovert': demoPlaces,
  'happy-ambivert': demoPlaces,
  'angry-introvert': demoPlaces,
  'angry-extrovert': demoPlaces,
  'angry-ambivert': demoPlaces,
  'bored-introvert': demoPlaces,
  'bored-extrovert': demoPlaces,
  'bored-ambivert': demoPlaces,
  'lonely-introvert': demoPlaces,
  'lonely-extrovert': demoPlaces,
  'lonely-ambivert': demoPlaces,
  'sad-introvert': demoPlaces,
  'sad-extrovert': demoPlaces,
  'sad-ambivert': demoPlaces,
};

// --- จบส่วนข้อมูล ---

export default function HomePage() {
  const router = useRouter();
  const resultsRef = useRef(null);

  const [displayData, setDisplayData] = useState({ mood: null, personality: '', show: false });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  const startSearch = async (moodObj) => {
    setSearchTerm('');
    setCurrentPage(1);

    await Swal.fire({
      title: 'วิเคราะห์สำเร็จ!',
      html: `อารมณ์ของคุณคือ: <b style="color: ${moodObj.color}; font-size: 1.5rem;">${moodObj.emoji} ${moodObj.name}</b>`,
      icon: 'success',
      timer: 800,
      showConfirmButton: false,
      customClass: { popup: 'swal-rounded' },
    });

    const { value: person } = await Swal.fire({
      title: 'สไตล์การเดินทางของคุณ?',
      html: `
        <div style="display: grid; grid-template-columns: 1fr; gap: 12px; margin-top: 15px;">
          <button id="p-intro" class="sel-box-btn">🌿 Introvert (ไปคนเดียวเงียบๆ)</button>
          <button id="p-extro" class="sel-box-btn">🥳 Extrovert (ไปจอยกับผู้คน)</button>
          <button id="p-ambi" class="sel-box-btn">⚖️ Ambivert (แบบไหนก็ได้)</button>
        </div>
      `,
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        document.getElementById('p-intro').onclick = () => Swal.clickConfirm('introvert');
        document.getElementById('p-extro').onclick = () => Swal.clickConfirm('extrovert');
        document.getElementById('p-ambi').onclick = () => Swal.clickConfirm('ambivert');
      },
      customClass: { popup: 'swal-rounded' },
    });

    if (person) {
      setDisplayData({ mood: moodObj, personality: person, show: true });
    }
  };

  useEffect(() => {
    if (displayData.show) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [displayData.show]);

  const currentMoodId = displayData.mood?.id || '';
  const currentPersonKey = displayData.personality || '';
  const dataKey = `${currentMoodId}-${currentPersonKey}`;
  const locationsList = allLocations[dataKey] || [];
  
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentItems = locationsList.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(locationsList.length / cardsPerPage);

  const personalityLabels = { introvert: 'INTROVERT 🌿', extrovert: 'EXTROVERT 🥳', ambivert: 'AMBIVERT ⚖️' };

  return (
    <main style={mainStyle}>
      <style>{`
        .swal-rounded { border-radius: 40px !important; }
        .mood-btn { padding: 25px; background: #fff; border: none; border-radius: 35px; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.05); width: 140px; }
        .mood-btn:hover { transform: translateY(-8px); box-shadow: 0 12px 25px rgba(109, 40, 217, 0.12); }
        .sel-box-btn { padding: 18px 25px; border: 2px solid #F1F5F9; border-radius: 20px; cursor: pointer; transition: 0.3s; text-align: left; font-weight: 700; color: #4B5563; background: white; width: 100%; font-family: inherit; }
        .sel-box-btn:hover { border-color: #6D28D9; background: #F5F3FF; transform: translateX(5px); }
        .grid-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; width: 100%; margin-top: 20px; }
        .location-card { background: white; border-radius: 30px; overflow: hidden; border: 1px solid #F1F5F9; transition: 0.3s; cursor: pointer; }
        .location-card:hover { transform: translateY(-10px); box-shadow: 0 15px 35px rgba(109, 40, 217, 0.12); }
        @media (max-width: 1024px) { .grid-container { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px) { .grid-container { grid-template-columns: 1fr; } }
      `}</style>

      <section style={headerSection}>
        <h1 style={titleStyle}>วันนี้พิกัดไหนดี?</h1>
        <div style={moodGrid}>
          {moods.map((m) => (
            <button key={m.id} onClick={() => startSearch(m)} className="mood-btn" style={{ borderBottom: `5px solid ${m.color}` }}>
              <div style={{ fontSize: '2.5rem' }}>{m.emoji}</div>
              <div style={{ fontWeight: '800', marginTop: '10px' }}>{m.name}</div>
            </button>
          ))}
        </div>
      </section>

      <section ref={resultsRef} style={resultsWrapper}>
        <div style={dashedBox}>
          {displayData.show ? (
            <div style={{ width: '100%' }}>
              <div style={{ textAlign: 'left', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: '900', color: '#1F2937' }}>
                  สาย {personalityLabels[currentPersonKey]} แนะนำให้คุณ:
                </h2>
              </div>
              <div className="grid-container">
                {currentItems.map((loc) => (
                  <div key={loc.id} className="location-card" onClick={() => router.push(`/details/${loc.id}`)}>
                    <img src={loc.img} style={{ width: '100%', height: '220px', objectFit: 'cover' }} alt={loc.name} />
                    <div style={{ padding: '20px' }}>
                      <span style={{ background: '#FEF3C7', color: '#D97706', padding: '4px 12px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: '800' }}>{loc.rating} ★</span>
                      <h4 style={{ margin: '10px 0 8px 0', fontSize: '1.3rem', fontWeight: '800' }}>{loc.name}</h4>
                      <p style={{ margin: 0, color: '#64748B', fontSize: '0.95rem' }}>{loc.info}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ opacity: 0.3, textAlign: 'center' }}>
              <div style={{ fontSize: '4rem' }}>🧭</div>
              <p style={{ fontSize: '1.4rem', fontWeight: '700' }}>เลือกอารมณ์ของคุณเพื่อเริ่มค้นหา</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

// Styles
const mainStyle = { paddingTop: '100px', minHeight: '100vh', background: '#FFFFFF', padding: '40px' };
const headerSection = { textAlign: 'center', maxWidth: '1000px', margin: '0 auto 80px' };
const titleStyle = { fontSize: '3rem', fontWeight: '900', color: '#111827', marginBottom: '40px' };
const moodGrid = { display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' };
const resultsWrapper = { maxWidth: '1200px', margin: '0 auto' };
const dashedBox = { padding: '60px 40px', borderRadius: '50px', border: '3px dashed #E9D5FF', background: 'rgba(255,255,255,0.6)', minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' };