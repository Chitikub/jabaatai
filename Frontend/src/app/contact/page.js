'use client';
import { useState, useEffect } from 'react';
import { Mail, Phone, Send, User, MessageSquare } from 'lucide-react';
import Swal from 'sweetalert2';

export default function ContactPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', message: '' });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'ส่งข้อความสำเร็จ!',
      text: 'เราได้รับข้อมูลของคุณแล้ว',
      confirmButtonColor: '#1E1B4B',
      borderRadius: '20px'
    });
    setFormData({ firstName: '', lastName: '', email: '', message: '' });
  };

  return (
    <main style={mainBgStyle}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anuphan:wght@300;400;600;700&display=swap');
        
        .contact-card {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
          background: white;
          width: 100%;
          max-width: 750px; /* ขนาดพอดีสำหรับการโฟกัสสายตา */
          border-radius: 30px;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          overflow: hidden;
          box-shadow: 0 15px 40px rgba(0,0,0,0.06);
        }

        .contact-card.show { opacity: 1; transform: translateY(0); }

        .form-section { padding: 35px; }
        .info-section { background: #F8FAFC; padding: 35px; border-left: 1px solid #F1F5F9; }

        .field-group { margin-bottom: 12px; position: relative; }
        .field-label { font-size: 0.8rem; font-weight: 700; color: #64748B; margin-bottom: 5px; display: block; }

        .input-item { 
          width: 100%;
          box-sizing: border-box;
          padding: 10px 12px 10px 38px; 
          border-radius: 12px; 
          border: 1.5px solid #E2E8F0; 
          background: #F8FAFC; 
          outline: none; 
          font-family: 'Anuphan', sans-serif;
          font-size: 0.9rem;
          transition: 0.2s;
        }

        .input-item:focus { 
          border-color: #6366F1; 
          background: white;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1); 
        }

        .textarea-item { height: 90px; resize: none; padding-top: 10px; }

        .icon-pos { position: absolute; left: 12px; top: 34px; color: #94A3B8; }

        @media (max-width: 700px) {
          .contact-card { grid-template-columns: 1fr; max-width: 450px; }
          .info-section { border-left: none; border-top: 1px solid #F1F5F9; }
        }
      `}</style>

      <div className={`contact-card ${isVisible ? 'show' : ''}`}>
        
        {/* แบบฟอร์มฝั่งซ้าย (Compact Form) */}
        <div className="form-section">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E1B4B', marginBottom: '5px' }}>Contact Us</h2>
          <p style={{ color: '#64748B', fontSize: '0.85rem', marginBottom: '25px' }}>คุยกับเรา "พิกัดไหนดี"</p>
          
          <form onSubmit={handleSubmit}>
            {/* ชื่อ และ นามสกุล อยู่ในแถวเดียวกันเพื่อให้ขนาดพอดี */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div className="field-group">
                <span className="field-label">ชื่อ</span>
                <User size={15} className="icon-pos" />
                <input required type="text" className="input-item" placeholder="ชื่อ" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="field-group">
                <span className="field-label">นามสกุล</span>
                <input required type="text" className="input-item" style={{ paddingLeft: '12px' }} placeholder="นามสกุล" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
              </div>
            </div>

            <div className="field-group">
              <span className="field-label">อีเมล</span>
              <Mail size={15} className="icon-pos" />
              <input required type="email" className="input-item" placeholder="example@mail.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="field-group">
              <span className="field-label">ข้อความ</span>
              <MessageSquare size={15} className="icon-pos" style={{ top: '32px' }} />
              <textarea required className="input-item textarea-item" placeholder="ระบุสิ่งที่ต้องการสอบถาม..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
            </div>

            <button type="submit" style={btnStyle}>
              ส่งข้อมูล <Send size={15} style={{ marginLeft: '8px' }} />
            </button>
          </form>
        </div>

        {/* ข้อมูลการติดต่อฝั่งขวา (Visual Info) */}
        <div className="info-section">
          <div style={imageWrapper}>
            <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=300" alt="Support" style={imgStyle} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={infoItem}>
              <div style={iconCircle}><Mail size={15} color="#6366F1" /></div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E1B4B' }}>mood@support.com</div>
            </div>
            <div style={infoItem}>
              <div style={iconCircle}><Phone size={15} color="#6366F1" /></div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1E1B4B' }}>02-xxx-xxxx</div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

// --- Styles (HCI Compact) ---
const mainBgStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F5F9', padding: '20px', fontFamily: "'Anuphan', sans-serif" };
const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#1E1B4B', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.9rem', transition: '0.2s', marginTop: '10px' };
const imageWrapper = { width: '100%', height: '120px', borderRadius: '15px', overflow: 'hidden', marginBottom: '20px' };
const imgStyle = { width: '100%', height: '100%', objectFit: 'cover' };
const infoItem = { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #F1F5F9' };
const iconCircle = { width: '30px', height: '30px', borderRadius: '8px', backgroundColor: '#EEF2FF', display: 'flex', justifyContent: 'center', alignItems: 'center' };