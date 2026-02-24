'use client';
import { useState, useEffect } from 'react';
import { Mail, Phone, Send, User, MessageSquare } from 'lucide-react';
import Swal from 'sweetalert2';
import Navbar from '../components/Navbar'; // อย่าลืมเช็ค Path ให้อยู่ถูกที่นะครับ

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
      confirmButtonColor: '#0F172A',
      customClass: { popup: 'swal-rounded' }
    });
    setFormData({ firstName: '', lastName: '', email: '', message: '' });
  };

  return (
    <>
      <Navbar />

      <main style={mainBgStyle}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&display=swap');
          
          .contact-card {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            width: 100%;
            max-width: 850px;
            border-radius: 32px;
            display: grid;
            grid-template-columns: 1.3fr 0.7fr;
            overflow: hidden;
            box-shadow: 0 20px 50px rgba(15, 23, 42, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.6);
            font-family: 'IBM Plex Sans Thai', 'Plus Jakarta Sans', sans-serif;
          }

          .contact-card.show { opacity: 1; transform: translateY(0); }

          .form-section { padding: 45px 40px; }
          .info-section { 
            background: rgba(241, 245, 249, 0.6); 
            padding: 45px 35px; 
            border-left: 1px solid rgba(226, 232, 240, 0.8); 
          }

          .field-group { margin-bottom: 18px; position: relative; }
          .field-label { font-size: 0.85rem; font-weight: 700; color: #475569; margin-bottom: 8px; display: block; padding-left: 5px; }

          .input-item { 
            width: 100%;
            box-sizing: border-box;
            padding: 14px 16px 14px 42px; 
            border-radius: 16px; 
            border: 2px solid #E2E8F0; 
            background: rgba(255,255,255,0.9); 
            outline: none; 
            font-family: inherit;
            font-size: 0.95rem;
            font-weight: 500;
            color: #1E293B;
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          }

          .input-item:focus { 
            border-color: #0F172A; 
            background: white;
            box-shadow: 0 4px 15px rgba(15, 23, 42, 0.05); 
          }
          
          .input-item::placeholder { color: #94A3B8; font-weight: 400; }

          .textarea-item { height: 110px; resize: none; padding-top: 14px; }

          /* ไอคอนในช่อง Input */
          .icon-pos { 
            position: absolute; 
            left: 16px; 
            top: 41px; 
            color: #94A3B8; 
            transition: 0.3s; 
          }
          .input-item:focus + .icon-pos,
          .field-group:focus-within .icon-pos { 
            color: #0F172A; 
          }

          .submit-btn {
            width: 100%; 
            padding: 16px; 
            background: #0F172A; 
            color: white; 
            border: none; 
            border-radius: 16px; 
            font-weight: 700; 
            cursor: pointer; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            font-size: 1.05rem; 
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
            margin-top: 25px;
            box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.3);
            font-family: inherit;
          }
          
          .submit-btn:hover {
            transform: translateY(-2px);
            background: #334155;
            box-shadow: 0 15px 25px -5px rgba(15, 23, 42, 0.4);
          }

          .image-wrapper { 
            width: 100%; height: 160px; border-radius: 20px; 
            overflow: hidden; margin-bottom: 30px; 
            box-shadow: 0 8px 20px rgba(0,0,0,0.06); 
          }
          .img-style { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
          .image-wrapper:hover .img-style { transform: scale(1.05); }

          .info-item { 
            display: flex; align-items: center; gap: 15px; padding: 15px; 
            background: rgba(255,255,255,0.7); border-radius: 16px; 
            border: 1px solid rgba(226,232,240,0.8); transition: 0.3s;
          }
          .info-item:hover { 
            background: #fff; transform: translateX(4px); 
            border-color: #E2E8F0; box-shadow: 0 4px 10px rgba(15,23,42,0.03); 
          }
          
          .icon-circle { 
            width: 40px; height: 40px; border-radius: 12px; 
            background: #F1F5F9; display: flex; justify-content: center; align-items: center; 
            color: #0F172A;
          }

          .swal-rounded { border-radius: 24px !important; box-shadow: 0 25px 50px -12px rgba(15,23,42,0.15) !important; }

          @media (max-width: 768px) {
            .contact-card { grid-template-columns: 1fr; max-width: 500px; border-radius: 24px; }
            .info-section { border-left: none; border-top: 1px solid rgba(226, 232, 240, 0.8); }
            .form-section, .info-section { padding: 30px 25px; }
          }
        `}</style>

        <div className={`contact-card ${isVisible ? 'show' : ''}`}>
          
          {/* แบบฟอร์มฝั่งซ้าย */}
          <div className="form-section">
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0F172A', margin: '0 0 5px 0', letterSpacing: '-0.5px' }}>
              ติดต่อเรา
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.95rem', margin: '0 0 30px 0', fontWeight: 500 }}>
              มีคำถามหรือข้อเสนอแนะ? ส่งข้อความหาทีมงาน "พิกัดไหนดี" ได้เลย
            </p>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div className="field-group" style={{ marginBottom: 0 }}>
                  <span className="field-label">ชื่อ</span>
                  <div style={{ position: 'relative' }}>
                    <User size={18} className="icon-pos" style={{ top: '15px' }} />
                    <input required type="text" className="input-item" placeholder="ชื่อของคุณ" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                </div>
                <div className="field-group" style={{ marginBottom: 0 }}>
                  <span className="field-label">นามสกุล</span>
                  <input required type="text" className="input-item" style={{ paddingLeft: '16px' }} placeholder="นามสกุลของคุณ" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>

              <div className="field-group">
                <span className="field-label">อีเมล</span>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} className="icon-pos" style={{ top: '15px' }} />
                  <input required type="email" className="input-item" placeholder="example@mail.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>

              <div className="field-group">
                <span className="field-label">ข้อความ</span>
                <div style={{ position: 'relative' }}>
                  <MessageSquare size={18} className="icon-pos" style={{ top: '15px' }} />
                  <textarea required className="input-item textarea-item" placeholder="ระบุสิ่งที่ต้องการสอบถาม..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
                </div>
              </div>

              <button type="submit" className="submit-btn">
                ส่งข้อความ <Send size={18} style={{ marginLeft: '10px' }} />
              </button>
            </form>
          </div>

          {/* ข้อมูลการติดต่อฝั่งขวา */}
          <div className="info-section">
            <div className="image-wrapper">
              <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=600" alt="Support Team" className="img-style" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="info-item">
                <div className="icon-circle"><Mail size={18} /></div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, marginBottom: '2px' }}>Email Support</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B' }}>mood@support.com</div>
                </div>
              </div>
              <div className="info-item">
                <div className="icon-circle"><Phone size={18} /></div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, marginBottom: '2px' }}>Hotline</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B' }}>02-xxx-xxxx</div>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: 'auto', paddingTop: '40px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500, margin: 0 }}>
                ทำการตอบกลับภายใน 24 ชั่วโมงทำการ
              </p>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}

// --- Styles (HCI Compact) ---
const mainBgStyle = { 
  minHeight: '100vh', 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  backgroundColor: '#f4f7ff',
  backgroundImage: 'radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.15) 0px, transparent 50%)',
  padding: '120px 20px 40px', // เผื่อระยะ Navbar
};