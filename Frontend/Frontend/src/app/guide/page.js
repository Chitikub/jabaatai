'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GuidePage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main style={mainBgStyle}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .guide-container { animation: slideIn 0.6s ease-out forwards; }
        .step-card { transition: all 0.3s ease; }
        .step-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
      `}</style>

      <div className={isVisible ? 'guide-container' : ''} style={containerStyle}>
        {/* Header */}
        <div style={{ marginBottom: '60px' }}>
          <h1 style={mainTitleStyle}>🚀 วิธีใช้งาน Mood Location Finder</h1>
          <p style={subtitleStyle}>ค้นหาสถานที่ที่ใช่ ในอารมณ์ที่ชอบ เพียง 4 ขั้นตอนง่ายๆ</p>
        </div>

        {/* Steps Grid */}
        <div style={gridStyle}>
          {/* Step 1 */}
          <div className="step-card" style={cardStyle}>
            <div style={{ ...iconStyle, background: 'linear-gradient(135deg, #FCA5A5, #F87171)' }}>1</div>
            <h3 style={stepTitleStyle}>เข้าสู่ระบบหรือสร้างบัญชี</h3>
            <p style={stepDetailStyle}>
              กดปุ่มสลับที่ด้านบนเพื่อเลือก <b>"เข้าสู่ระบบ"</b> หรือ <b>"สมัครสมาชิก"</b> 
              แถบสีจะสไลด์ตามที่คุณเลือกเพื่อความชัดเจน
            </p>
          </div>

          {/* Step 2 */}
          <div className="step-card" style={cardStyle}>
            <div style={{ ...iconStyle, background: 'linear-gradient(135deg, #C084FC, #7c3aed)' }}>2</div>
            <h3 style={stepTitleStyle}>ระบุข้อมูลส่วนตัว</h3>
            <p style={stepDetailStyle}>
              กรอกชื่อ-นามสกุล และอีเมลของคุณ พร้อมเลือกเพศโดยการ <b>"สไลด์ปุ่ม"</b> 
              ซึ่งจะแสดงสีฟ้าสำหรับชาย และชมพูสำหรับหญิง
            </p>
          </div>

          {/* Step 3 */}
          <div className="step-card" style={cardStyle}>
            <div style={{ ...iconStyle, background: 'linear-gradient(135deg, #7DD3FC, #3B82F6)' }}>3</div>
            <h3 style={stepTitleStyle}>เลือกอารมณ์ (Mood)</h3>
            <p style={stepDetailStyle}>
              เมื่อเข้าสู่ระบบแล้ว ให้เลือกความรู้สึกปัจจุบันของคุณ เช่น "อยากพักผ่อน" 
              หรือ "ต้องการพลัง" เพื่อให้ระบบช่วยคัดกรองสถานที่
            </p>
          </div>

          {/* Step 4 */}
          <div className="step-card" style={cardStyle}>
            <div style={{ ...iconStyle, background: 'linear-gradient(135deg, #34D399, #10B981)' }}>4</div>
            <h3 style={stepTitleStyle}>ไปตามโลเคชั่นที่แนะนำ</h3>
            <p style={stepDetailStyle}>
              ระบบจะแสดงแผนที่และสถานที่ที่เหมาะสมที่สุดสำหรับคุณ 
              คุณสามารถกดดูเส้นทางเพื่อออกเดินทางได้ทันที!
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ marginTop: '40px' }}>
          <button 
            onClick={() => router.push('/login')}
            style={primaryButtonStyle}
          >
            ไปที่หน้าเข้าสู่ระบบเลย
          </button>
          <p 
            onClick={() => router.push('/contact')}
            style={{ marginTop: '20px', color: '#6D28D9', fontWeight: '600', cursor: 'pointer' }}
          >
            พบปัญหาการใช้งาน? ติดต่อเรา
          </p>
        </div>
      </div>
    </main>
  );
}

// --- Styles ---
const mainBgStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', backgroundImage: 'radial-gradient(at 0% 0%, rgba(226, 209, 249, 0.2) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(109, 40, 217, 0.05) 0, transparent 50%)', padding: '80px 20px' };
const containerStyle = { width: '100%', maxWidth: '1000px', textAlign: 'center', opacity: 0 };
const mainTitleStyle = { fontSize: '2.8rem', fontWeight: '900', color: '#1E293B', marginBottom: '15px', letterSpacing: '-1px' };
const subtitleStyle = { fontSize: '1.2rem', color: '#64748B', maxWidth: '600px', margin: '0 auto' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '25px', marginTop: '50px' };
const cardStyle = { backgroundColor: '#fff', padding: '40px 25px', borderRadius: '35px', border: '1px solid #F1F5F9', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center' };
const iconStyle = { width: '60px', height: '60px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontSize: '1.5rem', fontWeight: '800', marginBottom: '25px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' };
const stepTitleStyle = { fontSize: '1.25rem', fontWeight: '800', color: '#1E293B', marginBottom: '15px' };
const stepDetailStyle = { fontSize: '0.95rem', color: '#64748B', lineHeight: '1.6' };
const primaryButtonStyle = { padding: '18px 45px', background: 'linear-gradient(135deg, #6D28D9, #7c3aed)', color: '#fff', border: 'none', borderRadius: '20px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 25px rgba(109, 40, 217, 0.3)' };