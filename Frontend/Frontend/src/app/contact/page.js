'use client';
import { useState, useEffect } from 'react';

// ต้องมีคำว่า export default และชื่อฟังก์ชันต้องขึ้นต้นด้วยตัวพิมพ์ใหญ่
export default function ContactPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main style={mainBgStyle}>
      <style>{`
        @keyframes slideUp { 
          from { opacity: 0; transform: translateY(30px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .contact-anim { animation: slideUp 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .input-focus:focus { border-color: #6D28D9 !important; box-shadow: 0 0 0 4px rgba(109, 40, 217, 0.1); }
      `}</style>

      <div className={isVisible ? 'contact-anim' : ''} style={containerStyle}>
        {/* ฝั่งซ้าย: แบบฟอร์มส่งอีเมล */}
        <div style={formSideStyle}>
          <h2 style={titleStyle}>Sends Email</h2>
          <p style={subtitleStyle}>ส่งข้อความหาผู้พัฒนา</p>
          
          <div style={gridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>ชื่อ</label>
              <input type="text" className="input-focus" style={inputStyle} placeholder="ชื่อ" />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>นามสกุล</label>
              <input type="text" className="input-focus" style={inputStyle} placeholder="นามสกุล" />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>อีเมล</label>
            <input type="email" className="input-focus" style={inputStyle} placeholder="example@mail.com" />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>ข้อความ</label>
            <textarea className="input-focus" style={textAreaStyle} placeholder="พิมพ์ข้อความที่นี่..."></textarea>
          </div>

          <button style={sendButtonStyle}>ส่งข้อความ</button>
        </div>

        {/* ฝั่งขวา: ข้อมูลการติดต่อและรูปภาพ */}
        <div style={infoSideStyle}>
          <div style={imageBoxStyle}>
            {/* ใส่ URL รูปภาพที่คุณต้องการแสดง */}
            <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e" alt="Forest Mood" style={imgStyle} />
          </div>

          <div style={contactCardGroup}>
            <div style={contactItemStyle}>
              <span style={{fontSize: '1.5rem'}}>📧</span>
              <div style={{textAlign: 'left'}}>
                <div style={cardLabel}>Email</div>
                <div style={cardValue}>Moodlocationfinder@hotmail.com</div>
              </div>
            </div>
            
            <div style={contactItemStyle}>
              <span style={{fontSize: '1.5rem'}}>📞</span>
              <div style={{textAlign: 'left'}}>
                <div style={cardLabel}>Phone</div>
                <div style={cardValue}>(+66) 0xx-xxx-xxxx</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// --- Styles (ห้ามลบส่วนนี้เพื่อป้องกัน Error formWrapperStyle หรือตัวแปรอื่นๆ ไม่ถูกประกาศ) ---
const mainBgStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', backgroundImage: 'radial-gradient(at 0% 0%, rgba(226, 209, 249, 0.3) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(246, 157, 157, 0.2) 0, transparent 50%)', padding: '120px 20px 40px 20px' };
const containerStyle = { backgroundColor: '#ffffff', width: '100%', maxWidth: '1000px', borderRadius: '40px', padding: '60px', boxShadow: '0 25px 70px rgba(0,0,0,0.07)', display: 'flex', gap: '50px', opacity: 0 };
const formSideStyle = { flex: 1.2, textAlign: 'left' };
const infoSideStyle = { flex: 0.8, display: 'flex', flexDirection: 'column', gap: '25px' };
const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' };
const inputGroupStyle = { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' };
const titleStyle = { fontSize: '2.2rem', fontWeight: '800', color: '#1E293B', marginBottom: '5px' };
const subtitleStyle = { color: '#64748B', marginBottom: '35px', fontSize: '0.95rem' };
const labelStyle = { fontSize: '0.9rem', fontWeight: '700', color: '#475569' };
const inputStyle = { padding: '15px', borderRadius: '12px', border: '1.5px solid #F1F5F9', backgroundColor: '#F8FAFC', outline: 'none', transition: '0.3s' };
const textAreaStyle = { padding: '15px', borderRadius: '12px', border: '1.5px solid #F1F5F9', backgroundColor: '#F8FAFC', outline: 'none', height: '140px', resize: 'none' };
const sendButtonStyle = { padding: '16px 40px', backgroundColor: '#6D28D9', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 20px rgba(109, 40, 217, 0.2)' };
const imageBoxStyle = { width: '100%', height: '280px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' };
const imgStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const contactCardGroup = { display: 'flex', flexDirection: 'column', gap: '15px' };
const contactItemStyle = { display: 'flex', alignItems: 'center', gap: '15px', padding: '18px', backgroundColor: '#F8FAFC', borderRadius: '20px', border: '1px solid #F1F5F9' };
const cardLabel = { fontSize: '0.75rem', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' };
const cardValue = { fontSize: '0.9rem', color: '#1E293B', fontWeight: '700' };