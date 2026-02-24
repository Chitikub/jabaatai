"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

// --- DATA SECTION ---
const moods = [
  {
    id: "happy",
    name: "สดใส",
    emoji: "😊",
    color: "#FEF3C7",
    keywords: ["ดีใจ", "แฮปปี้", "ถูกหวย", "ชนะ", "สนุก", `ร่าเริง`],
  },
  {
    id: "angry",
    name: "หัวร้อน",
    emoji: "🔥",
    color: "#FEE2E2",
    keywords: ["โมโห", "หงุดหงิด", "รถติด", "ร้อน", "โกรธ"],
  },
  {
    id: "bored",
    name: "เบื่อๆ",
    emoji: "😴",
    color: "#F3F4F6",
    keywords: ["เซ็ง", "ขี้เกียจ", "ว่าง", "ไม่มีไรทำ"],
  },
  {
    id: "lonely",
    name: "เหงา",
    emoji: "💜",
    color: "#F5F3FF",
    keywords: ["คนเดียว", "คิดถึง", "โสด", "ไม่มีใครคุย"],
  },
  {
    id: "sad",
    name: "เศร้า",
    emoji: "😢",
    color: "#DBEAFE",
    keywords: ["ปวดท้อง", "งานเยอะ", "สอบตก", "ร้องไห้", "นอยด์", "ปวดหัว"],
  },
];

const allLocations = {
  introvert: {
    green: [
      {
        id: "in_g1",
        name: "Forest Walkway",
        info: "เส้นทางศึกษาธรรมชาติ เดินเงียบๆ ฟังเสียงนก ชมไม้",
        img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80",
        dist: "5.5 กม.",
        rating: "4.7",
      },
    ],
    water: [
      {
        id: "in_w1",
        name: "Hidden Lake Pier",
        info: "ท่าเรือริมทะเลสาบลับๆ ลมเย็นสบาย ไม่มีคนรบกวน",
        img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80",
        dist: "7.1 กม.",
        rating: "4.9",
      },
    ],
    cafe: [
      {
        id: "in_c1",
        name: "Common Room Library",
        info: "ห้องสมุดคาเฟ่สุดเงียบ จิบกาแฟอ่านหนังสือได้ยาวๆ",
        img: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80",
        dist: "1.2 กม.",
        rating: "4.9",
      },
    ],
  },
  extrovert: {
    green: [
      {
        id: "ex_g1",
        name: "Zood Music Festival Park",
        info: "สวนสาธารณะที่มีดนตรีสดและกิจกรรมกลุ่ม คึกคักสุดๆ",
        img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80",
        dist: "4.0 กม.",
        rating: "4.6",
      },
    ],
    water: [
      {
        id: "ex_w1",
        name: "Splash Water Park",
        info: "สวนน้ำใจกลางเมือง สนุกสุดเหวี่ยงกับแก๊งเพื่อน",
        img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80",
        dist: "8.5 กม.",
        rating: "4.8",
      },
    ],
    cafe: [
      {
        id: "ex_c1",
        name: "Party Cafe & Bar",
        info: "คาเฟ่ที่มีบอร์ดเกมและเพลงดัง เหมาะกับการนัดรวมตัว",
        img: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?q=80",
        dist: "2.1 กม.",
        rating: "4.5",
      },
    ],
  },
  ambivert: {
    green: [
      {
        id: "am_g1",
        name: "Art in the Park",
        info: "สวนศิลปะ มีคนบ้างแต่ไม่วุ่นวาย เดินดูงานอาร์ตเพลินๆ",
        img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80",
        dist: "1.5 กม.",
        rating: "4.8",
      },
    ],
    water: [
      {
        id: "am_w1",
        name: "Canal Walking Street",
        info: "ทางเดินริมคลองที่มีร้านค้าเล็กๆ บรรยากาศกำลังดี",
        img: "https://images.unsplash.com/photo-1533167649158-6d508895b980?q=80",
        dist: "2.8 กม.",
        rating: "4.4",
      },
    ],
    cafe: [
      {
        id: "am_c1",
        name: "Workshop Cafe",
        info: "คาเฟ่ที่มีกิจกรรมให้ทำร่วมกับคนอื่นแต่ก็มีมุมส่วนตัว",
        img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80",
        dist: "3.0 กม.",
        rating: "4.7",
      },
    ],
  },
};

export default function HomePage() {
  const router = useRouter();
  const resultsRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [displayData, setDisplayData] = useState({
    mood: null,
    personality: "",
    category: "",
    show: false,
  });

  // หากเป็น admin ให้เปลี่ยนเส้นทางไปหน้า /admin ทันที (ไม่แสดงหน้าค้นหา/ความรู้สึก)
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const userData =
          localStorage.getItem("user_profile") || localStorage.getItem("user");
        const user = userData ? JSON.parse(userData) : null;
        if (user && user.role === "admin") {
          router.push("/admin");
        }
      } catch (e) {
        // ignore
      }
    }
  }, [router]);

  // ปรับปรุงการแจ้งเตือนให้น่าใช้งานขึ้น (HCI: Aesthetic and Consistency)
  const handleProcessSearch = async () => {
    const input = searchTerm.trim().toLowerCase();
    if (!input) return;

    const detectedMood = moods.find(
      (m) =>
        m.keywords.some((kw) => input.includes(kw)) ||
        input.includes(m.name.toLowerCase()),
    );

    if (detectedMood) {
      const { isConfirmed } = await Swal.fire({
        title: `ดูเหมือนคุณจะรู้สึก <span style="color:#6366F1">${detectedMood.name}</span>`,
        html: `ให้ <b>พิกัดไหนดี</b> ช่วยหาที่พักใจให้คุณนะ?`,
        iconHtml: `<span style="font-size: 3rem">${detectedMood.emoji}</span>`,
        showCancelButton: true,
        confirmButtonText: "หาพิกัดให้เลย!",
        cancelButtonText: "พิมพ์ใหม่",
        confirmButtonColor: "#6366F1", // ปรับสีปุ่ม Swal ให้ดูมีชีวิตชีวาเข้ากับธีม
        borderRadius: "25px",
      });
      if (isConfirmed) startSearch(detectedMood);
    } else {
      Swal.fire({
        title: "ลองใหม่อีกครั้ง?",
        text: 'ลองบอกความรู้สึก เช่น "เครียดจัง" หรือ "มีความสุข"',
        icon: "question",
        confirmButtonColor: "#6366F1",
        borderRadius: "25px",
      });
    }
  };

  const startSearch = async (moodObj) => {
    setSearchTerm("");
    // HCI: Step-by-step Selection (Reducing Cognitive Load)
    const { value: person } = await Swal.fire({
      title: "บุคลิกของคุณเป็นแบบไหน?",
      html: `
        <div class="swal-custom-options">
          <button class="mega-option" data-value="introvert">
            <div class="option-icon">🌿</div>
            <div class="option-text"><b>Introvert</b><br><small>ชอบความเงียบ สงบ</small></div>
          </button>
          <button class="mega-option" data-value="extrovert">
            <div class="option-icon">🥳</div>
            <div class="option-text"><b>Extrovert</b><br><small>ชอบความสนุก คึกคัก</small></div>
          </button>
          <button class="mega-option" data-value="ambivert">
            <div class="option-icon">⚖️</div>
            <div class="option-text"><b>Ambivert</b><br><small>ชอบบรรยากาศกลางๆ</small></div>
          </button>
        </div>
      `,
      showConfirmButton: false,
      width: "500px",
      borderRadius: "30px",
      didOpen: (popup) => {
        popup.querySelectorAll(".mega-option").forEach((btn) => {
          btn.onclick = () => {
            popup.setAttribute("data-val", btn.getAttribute("data-value"));
            Swal.clickConfirm();
          };
        });
      },
      preConfirm: () => Swal.getPopup().getAttribute("data-val"),
    });

    if (!person) return;

    const { value: category } = await Swal.fire({
      title: "อยากไปที่ไหนดี?",
      html: `
        <div class="swal-custom-options">
          <button class="mega-option" data-value="green">🌳 พื้นที่สีเขียว</button>
          <button class="mega-option" data-value="water">🌊 แหล่งน้ำ</button>
          <button class="mega-option" data-value="cafe">☕ คาเฟ่</button>
        </div>
      `,
      showConfirmButton: false,
      width: "500px",
      borderRadius: "30px",
      didOpen: (popup) => {
        popup.querySelectorAll(".mega-option").forEach((btn) => {
          btn.onclick = () => {
            popup.setAttribute("data-val", btn.getAttribute("data-value"));
            Swal.clickConfirm();
          };
        });
      },
      preConfirm: () => Swal.getPopup().getAttribute("data-val"),
    });

    if (category) {
      setDisplayData({
        mood: moodObj,
        personality: person,
        category: category,
        show: true,
      });
    }
  };

  const handleGoToDetail = (id) => {
    router.push(`/location/${id}`);
  };

  useEffect(() => {
    if (displayData.show)
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayData.show]);

  const locationsList =
    allLocations[displayData.personality]?.[displayData.category] || [];

  return (
    <main className="main-container">
      <style>{`
        /* =========================================
           เปลี่ยนแปลงเฉพาะส่วน CSS พื้นหลัง และ ปุ่ม
           ========================================= */

        /* พื้นหลัง: ไล่สีอ่อนๆ มีความฟุ้งแบบ Soft Mesh Gradient */
        .main-container { 
          padding: 100px 20px; 
          min-height: 100vh; 
          background-color: #f4f7ff;
          background-image: 
            radial-gradient(at 10% 20%, rgba(99, 102, 241, 0.12) 0px, transparent 50%),
            radial-gradient(at 90% 80%, rgba(236, 72, 153, 0.12) 0px, transparent 50%);
          animation: floatBg 15s ease-in-out infinite alternate;
        }

        @keyframes floatBg {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }

        .hero-section { text-align: center; margin-bottom: 60px; }
        .hero-title { font-size: 3.5rem; font-weight: 900; color: #1E1B4B; margin-bottom: 15px; letter-spacing: -1px; }
        .hero-subtitle { color: #6B7280; font-size: 1.1rem; }

        /* กล่องค้นหา: ดูใสๆ แบบ Glassmorphism เบาๆ */
        .search-wrapper { 
          max-width: 650px; margin: 40px auto; display: flex; gap: 10px; 
          background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(10px);
          padding: 10px; border-radius: 100px; 
          box-shadow: 0 15px 35px rgba(99, 102, 241, 0.1); 
          border: 1px solid rgba(255, 255, 255, 0.5); 
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        }
        .search-wrapper:focus-within { 
          transform: scale(1.02); 
          box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2); 
          border-color: #C7D2FE;
        }
        .search-input { flex: 1; border: none; padding: 12px 25px; outline: none; font-size: 1.1rem; background: transparent; }
        
        /* ปุ่มค้นหา: ไล่สีสวยงาม มีเงาสะท้อน (Glow effect) */
        .search-btn { 
          background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); 
          color: white; border: none; padding: 0 40px; border-radius: 100px; 
          cursor: pointer; font-weight: 800; letter-spacing: 0.5px;
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
        }
        .search-btn:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 12px 25px rgba(99, 102, 241, 0.6); 
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%);
        }

        /* ปุ่ม Mood Chips: ขยับเด้งเมื่อ Hover */
        .mood-grid { display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; margin-bottom: 80px; }
        .mood-card { 
          background: white; border-radius: 30px; padding: 15px 30px; 
          cursor: pointer; display: flex; align-items: center; gap: 10px; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.04); 
          border: 2px solid transparent; 
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .mood-card:hover { 
          transform: translateY(-6px) scale(1.05); 
          box-shadow: 0 15px 30px rgba(99, 102, 241, 0.15); 
          border-color: #C7D2FE; 
          color: #4F46E5;
        }
        .mood-emoji { font-size: 1.5rem; transition: 0.3s; }
        .mood-card:hover .mood-emoji { transform: scale(1.2); }
        .mood-name { font-weight: 700; color: #1E1B4B; transition: 0.3s; }

        /* ผลลัพธ์: ทำให้การ์ดมีมิติ น่าคลิก */
        .result-wrapper { max-width: 1000px; margin: 0 auto; animation: fadeIn 0.6s ease-out; }
        .result-header { 
          background: linear-gradient(135deg, #1E1B4B 0%, #312E81 100%); 
          color: white; padding: 35px; border-radius: 30px; margin-bottom: 40px; 
          display: flex; justify-content: space-between; align-items: center; 
          box-shadow: 0 20px 40px rgba(30,27,75,0.15);
        }
        .places-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; }
        .place-card { 
          border-radius: 30px; overflow: hidden; background: white; 
          border: 1px solid rgba(0,0,0,0.05); cursor: pointer; position: relative; 
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 10px 20px rgba(0,0,0,0.03);
        }
        .place-card:hover { 
          transform: translateY(-12px); 
          box-shadow: 0 30px 60px rgba(99, 102, 241, 0.15); 
        }
        .place-card img { transition: transform 0.6s ease; }
        .place-card:hover img { transform: scale(1.08); }
        
        .info-tag { background: #F3F4F6; padding: 6px 14px; border-radius: 100px; font-size: 0.85rem; font-weight: 700; color: #4B5563; }
        
        /* ปุ่มใน Swal: ดูโมเดิร์นและตอบสนองได้ดีขึ้น */
        .mega-option { 
          background: #ffffff; border: 2px solid #EEF2FF; border-radius: 20px; 
          padding: 20px; width: 100%; margin-bottom: 12px; cursor: pointer; 
          display: flex; align-items: center; gap: 15px; 
          transition: all 0.3s ease; text-align: left; 
          box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }
        .mega-option:hover { 
          border-color: #6366F1; 
          background: #F8FAFF; 
          transform: translateX(8px);
          box-shadow: 0 10px 20px rgba(99, 102, 241, 0.1);
        }
        .option-icon { font-size: 2rem; }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="hero-section">
        <h1 className="hero-title">วันนี้พิกัดไหนดี?</h1>
        <p className="hero-subtitle">
          ระบายความรู้สึกของคุณออกมา แล้วเราจะพาคุณไปหาที่พักใจ
        </p>
      </div>

      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="บอกเล่าเรื่องราวของคุณที่นี่..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleProcessSearch()}
        />
        <button className="search-btn" onClick={handleProcessSearch}>
          ค้นหา
        </button>
      </div>

      <div className="mood-grid">
        {moods.map((m) => (
          <div key={m.id} className="mood-card" onClick={() => startSearch(m)}>
            <span className="mood-emoji">{m.emoji}</span>
            <span className="mood-name">{m.name}</span>
          </div>
        ))}
      </div>

      {displayData.show ? (
        <section ref={resultsRef} className="result-wrapper">
          <div className="result-header">
            <div>
              <p
                style={{
                  opacity: 0.8,
                  fontSize: "0.9rem",
                  marginBottom: "5px",
                }}
              >
                ผลลัพธ์พิกัดสำหรับคุณ
              </p>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>
                {displayData.mood.emoji} {displayData.mood.name} +{" "}
                {displayData.personality.charAt(0).toUpperCase() +
                  displayData.personality.slice(1)}
              </h2>
            </div>
            <div
              className="info-tag"
              style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
            >
              {displayData.category === "green"
                ? "🌳 ธรรมชาติ"
                : displayData.category === "water"
                  ? "🌊 สายน้ำ"
                  : "☕ คาเฟ่"}
            </div>
          </div>

          <div className="places-grid">
            {locationsList.map((loc) => (
              <div
                key={loc.id}
                className="place-card"
                onClick={() => handleGoToDetail(loc.id)}
              >
                <div style={{ overflow: "hidden", height: "240px" }}>
                  <img
                    src={loc.img}
                    className="place-img"
                    alt={loc.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
                <div style={{ padding: "25px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    <h3 style={{ fontWeight: 800, fontSize: "1.25rem", margin: 0 }}>
                      {loc.name}
                    </h3>
                    <span style={{ color: "#F59E0B", fontWeight: 700 }}>
                      ⭐ {loc.rating}
                    </span>
                  </div>
                  <p
                    style={{
                      color: "#6B7280",
                      fontSize: "0.95rem",
                      marginBottom: "20px",
                      lineHeight: "1.6",
                    }}
                  >
                    {loc.info}
                  </p>
                  <div className="info-tag" style={{ display: "inline-block" }}>
                    📍 ห่างจากคุณ {loc.dist}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div
          className="empty-container"
          style={{ textAlign: "center", opacity: 0.5, marginTop: "40px" }}
        >
          <p>ลองพิมพ์ว่า "วันนี้เหนื่อยจังง" ในช่องค้นหาด้านบนสิ</p>
        </div>
      )}
    </main>
  );
}