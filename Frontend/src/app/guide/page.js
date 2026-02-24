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
import Navbar from '../components/Navbar'; // อย่าลืมเรียกใช้ Navbar

export default function GuidePage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <Navbar /> {/* ใส่ Navbar ไว้ด้านบนสุด */}
      <main className="guide-wrapper">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&display=swap');
          
          .guide-wrapper { 
            min-height: 100vh; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            background-color: #f4f7ff;
            background-image: 
              radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%),
              radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.15) 0px, transparent 50%);
            font-family: 'IBM Plex Sans Thai', 'Plus Jakarta Sans', sans-serif;
            padding: 120px 20px 60px; /* เพิ่ม Padding Top หลบ Navbar */
          }

          .guide-container { 
            width: 100%; 
            max-width: 1100px; 
            text-align: center;
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          }
          
          .guide-container.show { opacity: 1; transform: translateY(0); }

          .steps-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 30px; 
            margin-top: 60px; 
          }

          .step-card { 
            background: rgba(255, 255, 255, 0.85); 
            backdrop-filter: blur(20px);
            padding: 45px 30px; 
            border-radius: 32px; 
            border: 1px solid rgba(255, 255, 255, 0.6); 
            box-shadow: 0 20px 40px rgba(15, 23, 42, 0.05);
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            overflow: hidden;
          }

          .step-card:hover { 
            transform: translateY(-12px); 
            box-shadow: 0 30px 60px -12px rgba(15, 23, 42, 0.15);
            border-color: #E2E8F0;
            background: rgba(255, 255, 255, 0.95);
          }

          .step-number {
            position: absolute;
            top: -15px;
            right: 15px;
            font-size: 5rem;
            font-weight: 900;
            color: rgba(226, 232, 240, 0.5); /* สีเทาอ่อนมากๆ */
            z-index: 0;
            font-family: 'Plus Jakarta Sans', sans-serif;
            transition: 0.4s;
          }

          .step-card:hover .step-number {
            color: rgba(226, 232, 240, 0.8);
            transform: scale(1.1);
          }

          .icon-box {
            width: 80px; height: 80px; 
            border-radius: 24px; 
            display: flex; justify-content: center; align-items: center; 
            color: #fff; margin-bottom: 25px; 
            position: relative; z-index: 1;
            box-shadow: 0 12px 20px -5px rgba(0,0,0,0.15);
            transition: 0.4s;
          }

          .step-card:hover .icon-box {
            transform: scale(1.1) rotate(5deg);
          }

          .btn-primary { 
            padding: 18px 40px; 
            background: #0F172A; /* สีกรมท่า Slate ตามธีม */
            color: #fff; 
            border: none; 
            border-radius: 100px; /* มนแบบ Pill shape */
            font-size: 1.1rem; 
            font-weight: 700; 
            cursor: pointer; 
            display: inline-flex;
            align-items: center;
            gap: 12px;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.4);
            font-family: inherit;
          }

          .btn-primary:hover { 
            background: #334155;
            transform: translateY(-3px);
            box-shadow: 0 15px 35px -5px rgba(15, 23, 42, 0.5);
          }

          .help-link {
            margin-top: 30px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: #64748B;
            font-weight: 600;
            text-decoration: none;
            transition: color 0.2s;
            font-size: 0.95rem;
          }
          .help-link:hover { color: #0F172A; }
        `}</style>

        <div className={`guide-container ${isVisible ? 'show' : ''}`}>
          {/* Header Section */}
          <header style={{ marginBottom: '60px' }}>
            <div style={{ 
              display: 'inline-flex', padding: '8px 24px', 
              background: 'rgba(255,255,255,0.8)', border: '1px solid #E2E8F0', 
              borderRadius: '100px', color: '#475569', fontWeight: '700', 
              fontSize: '0.9rem', marginBottom: '20px', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' 
            }}>
              <Sparkles size={16} color="#6366F1" style={{ marginRight: '8px' }} /> คู่มือเริ่มต้นใช้งาน
            </div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#0F172A', marginBottom: '20px', letterSpacing: '-1.5px', lineHeight: '1.2' }}>
              ออกเดินทางตาม <span style={{ background: 'linear-gradient(90deg, #6366F1, #A855F7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ความรู้สึก</span>
            </h1>
            <p style={{ fontSize: '1.15rem', color: '#64748B', maxWidth: '650px', margin: '0 auto', lineHeight: '1.7', fontWeight: '500' }}>
              ค้นหาสถานที่ที่ใช่สำหรับคุณผ่าน 4 ขั้นตอนง่ายๆ ที่ออกแบบมาเพื่อเยียวยาจิตใจและเติมพลังให้คุณโดยเฉพาะ
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
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1E293B', marginBottom: '12px', zIndex: 1 }}>เข้าร่วมกับเรา</h3>
              <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: '1.6', zIndex: 1, margin: 0 }}>
                เข้าสู่ระบบหรือสมัครสมาชิกเพื่อ <b style={{color: '#475569'}}>บันทึกสถานที่โปรด</b> และจดจำอารมณ์ของคุณในแต่ละวัน
              </p>
            </article>

            {/* Step 2 */}
            <article className="step-card">
              <span className="step-number">02</span>
              <div className="icon-box" style={{ background: 'linear-gradient(135deg, #C084FC, #9333EA)' }}>
                <Settings2 size={32} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1E293B', marginBottom: '12px', zIndex: 1 }}>ตั้งค่าโปรไฟล์</h3>
              <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: '1.6', zIndex: 1, margin: 0 }}>
                ระบุตัวตนและสไตล์ของคุณ เพื่อให้ระบบ <b style={{color: '#475569'}}>คัดกรองพิกัด</b> ได้ตรงกับบุคลิกมากที่สุด
              </p>
            </article>

            {/* Step 3 */}
            <article className="step-card">
              <span className="step-number">03</span>
              <div className="icon-box" style={{ background: 'linear-gradient(135deg, #F472B6, #DB2777)' }}>
                <SmilePlus size={32} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1E293B', marginBottom: '12px', zIndex: 1 }}>เลือกอารมณ์</h3>
              <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: '1.6', zIndex: 1, margin: 0 }}>
                บอกความรู้สึกตอนนี้ของคุณผ่าน <b style={{color: '#475569'}}>Mood Chips</b> หรือพิมพ์ระบายความในใจในช่องค้นหา
              </p>
            </article>

            {/* Step 4 */}
            <article className="step-card">
              <span className="step-number">04</span>
              <div className="icon-box" style={{ background: 'linear-gradient(135deg, #34D399, #059669)' }}>
                <MapPinCheckInside size={32} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#1E293B', marginBottom: '12px', zIndex: 1 }}>รับพิกัดพักใจ</h3>
              <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: '1.6', zIndex: 1, margin: 0 }}>
                เลือกสถานที่ที่แนะนำ แล้วออกเดินทางได้ทันที พร้อม <b style={{color: '#475569'}}>ระบบนำทาง</b> ที่ช่วยให้คุณถึงที่หมายง่ายขึ้น
              </p>
            </article>
          </div>

          {/* Action Section */}
          <footer style={{ marginTop: '70px' }}>
            <button 
              onClick={() => router.push('/')}
              className="btn-primary"
            >
              ไปหน้าแรกเพื่อเริ่มค้นหา <ArrowRight size={20} />
            </button>
            
            <br />
            
            <a href="#" onClick={(e) => { e.preventDefault(); router.push('/contact'); }} className="help-link">
              <MessageCircleQuestion size={18} /> พบปัญหาการใช้งาน? ติดต่อทีมสนับสนุน
            </a>
          </footer>
        </div>
      </main>
    </>
  );
}