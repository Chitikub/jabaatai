'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserPlus, 
  Settings2, 
  SmilePlus, 
  MapPinCheckInside, 
  ArrowRight,
  MessageCircleQuestion,
  Sparkles
} from 'lucide-react';

export default function GuidePage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="guide-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anuphan:wght@300;400;600;700&display=swap');
        
        .guide-wrapper { 
          min-height: 100vh; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          background: #F8FAFC;
          font-family: 'Anuphan', sans-serif;
          padding: 40px 20px;
        }

        .guide-container { 
          width: 100%; 
          max-width: 1100px; 
          text-align: center;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        
        .guide-container.show { opacity: 1; transform: translateY(0); }

        .steps-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
          gap: 24px; 
          margin-top: 50px; 
        }

        .step-card { 
          background: white; 
          padding: 40px 30px; 
          border-radius: 35px; 
          border: 1px solid #F1F5F9; 
          box-shadow: 0 10px 30px rgba(0,0,0,0.02);
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
        }

        .step-card:hover { 
          transform: translateY(-12px); 
          box-shadow: 0 25px 50px -12px rgba(109, 40, 217, 0.15);
          border-color: #DDD6FE;
        }

        .step-number {
          position: absolute;
          top: 20px;
          right: 25px;
          font-size: 3rem;
          font-weight: 900;
          color: #F1F5F9;
          z-index: 0;
        }

        .icon-box {
          width: 80px; height: 80px; 
          border-radius: 28px; 
          display: flex; justify-content: center; align-items: center; 
          color: #fff; margin-bottom: 25px; 
          position: relative; z-index: 1;
          box-shadow: 0 12px 20px -5px rgba(0,0,0,0.1);
        }

        .btn-primary { 
          padding: 18px 50px; 
          background: #1E1B4B; 
          color: #fff; 
          border: none; 
          border-radius: 22px; 
          font-size: 1.1rem; 
          font-weight: 700; 
          cursor: pointer; 
          display: inline-flex;
          align-items: center;
          gap: 10px;
          transition: 0.3s;
          box-shadow: 0 10px 25px rgba(30, 27, 75, 0.2);
        }

        .btn-primary:hover { 
          background: #6D28D9;
          transform: scale(1.05);
          box-shadow: 0 15px 30px rgba(109, 40, 217, 0.3);
        }

        .help-link {
          margin-top: 30px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #64748B;
          font-weight: 600;
          text-decoration: none;
          transition: 0.2s;
        }
        .help-link:hover { color: #6D28D9; }
      `}</style>

      <div className={`guide-container ${isVisible ? 'show' : ''}`}>
        {/* Header Section */}
        <header style={{ marginBottom: '60px' }}>
          <div style={{ display: 'inline-flex', padding: '8px 20px', background: '#EEF2FF', borderRadius: '100px', color: '#6366F1', fontWeight: '700', fontSize: '0.9rem', marginBottom: '16px' }}>
            <Sparkles size={16} style={{ marginRight: '8px' }} /> คู่มือเริ่มต้นใช้งาน
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', color: '#1E1B4B', marginBottom: '15px', letterSpacing: '-1.5px' }}>
            ออกเดินทางตาม <span style={{ color: '#6D28D9' }}>ความรู้สึก</span>
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#64748B', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            ค้นหาสถานที่ที่ใช่สำหรับคุณผ่าน 4 ขั้นตอนง่ายๆ ที่ออกแบบมาเพื่อความสบายใจของคุณโดยเฉพาะ
          </p>
        </header>

        {/* Steps Grid */}
        <div className="steps-grid">
          {/* Step 1 */}
          <article className="step-card">
            <span className="step-number">01</span>
            <div className="icon-box" style={{ background: 'linear-gradient(135deg, #818CF8, #6366F1)' }}>
              <UserPlus size={32} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1E293B', marginBottom: '12px', zIndex: 1 }}>เข้าร่วมกับเรา</h3>
            <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: '1.6', zIndex: 1 }}>
              เข้าสู่ระบบหรือสมัครสมาชิกเพื่อ <b>บันทึกสถานที่โปรด</b> และจดจำอารมณ์ของคุณในแต่ละวัน
            </p>
          </article>

          {/* Step 2 */}
          <article className="step-card">
            <span className="step-number">02</span>
            <div className="icon-box" style={{ background: 'linear-gradient(135deg, #C084FC, #9333EA)' }}>
              <Settings2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1E293B', marginBottom: '12px', zIndex: 1 }}>ตั้งค่าโปรไฟล์</h3>
            <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: '1.6', zIndex: 1 }}>
              อัปโหลดรูปและระบุตัวตนของคุณ เพื่อให้ระบบ <b>AI แนะนำพิกัด</b> ได้ตรงกับบุคลิกมากที่สุด
            </p>
          </article>

          {/* Step 3 */}
          <article className="step-card">
            <span className="step-number">03</span>
            <div className="icon-box" style={{ background: 'linear-gradient(135deg, #F472B6, #DB2777)' }}>
              <SmilePlus size={32} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1E293B', marginBottom: '12px', zIndex: 1 }}>เลือกอารมณ์</h3>
            <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: '1.6', zIndex: 1 }}>
              บอกความรู้สึกตอนนี้ของคุณผ่าน <b>Mood Chips</b> หรือพิมพ์ระบายความในใจในช่องค้นหา
            </p>
          </article>

          {/* Step 4 */}
          <article className="step-card">
            <span className="step-number">04</span>
            <div className="icon-box" style={{ background: 'linear-gradient(135deg, #34D399, #059669)' }}>
              <MapPinCheckInside size={32} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#1E293B', marginBottom: '12px', zIndex: 1 }}>รับพิกัดพักใจ</h3>
            <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: '1.6', zIndex: 1 }}>
              เลือกสถานที่ที่แนะนำ แล้วออกเดินทางได้ทันที พร้อม <b>ระบบนำทาง</b> ที่ช่วยให้คุณถึงที่หมายง่ายขึ้น
            </p>
          </article>
        </div>

        {/* Action Section */}
        <footer style={{ marginTop: '60px' }}>
          <button 
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            ไปที่หน้าแรกเลย <ArrowRight size={20} />
          </button>
          
          <br />
          
          <a href="#" onClick={(e) => { e.preventDefault(); router.push('/contact'); }} className="help-link">
            <MessageCircleQuestion size={18} /> พบปัญหาการใช้งาน? ติดต่อทีมสนับสนุน
          </a>
        </footer>
      </div>
    </main>
  );
}