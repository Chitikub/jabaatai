"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function AdminContactPage() {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, name: "สมไทย ใจดี", email: "somthai@email.com", subject: "เสนอแนะการใช้งาน", message: "ขอเสนอแนะเพิ่มฟีเจอร์แนะนำสถานที่ใหม่", date: "2024-02-15", status: "new" },
    { id: 2, name: "สุภาวดี สด", email: "suphawadee@email.com", subject: "ปัญหาการใช้งาน", message: "พบปัญหาเข้าสู่ระบบไม่ได้ เมื่อใช้ email ใหม่", date: "2024-02-14", status: "replied" },
    { id: 3, name: "ประสิทธิ์ ใจดี", email: "prasit@email.com", subject: "คำถามทั่วไป", message: "ระบบนี้สามารถใช้ได้บนมือถือหรือไม่", date: "2024-02-13", status: "new" },
  ]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "ยืนยันการออกจากระบบ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#10B981",
      confirmButtonText: "ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
      borderRadius: '20px'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        localStorage.removeItem("user_profile");
        setUser(null);
        setIsProfileOpen(false);
        router.push("/login");
      }
    });
  };

  const handleReply = () => {
    if (!replyText.trim()) {
      Swal.fire("ข้อมูลไม่ครบ", "กรุณาพิมพ์เนื้อหาข้อความตอบกลับ", "warning");
      return;
    }

    setMessages(messages.map(msg =>
      msg.id === selectedMessage.id ? { ...msg, status: "replied" } : msg
    ));

    Swal.fire({
      icon: "success",
      title: "ส่งข้อความสำเร็จ",
      text: `ส่งข้อความถึง ${selectedMessage.name} แล้ว`,
      timer: 1500,
      showConfirmButton: false
    });

    setReplyText("");
    setSelectedMessage(null);
  };

  const handleMarkAsRead = (id) => {
    setMessages(messages.map(msg =>
      msg.id === id ? { ...msg, status: "read" } : msg
    ));
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Kanit' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', background: '#FFFFFF', borderRight: '1px solid #E2E8F0', padding: '30px 20px', position: 'fixed', height: '100vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ width: '40px', height: '40px', background: '#4F46E5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>M</div>
          <span style={{ fontWeight: 900, fontSize: '20px', color: '#1E293B' }}>MOOD ADMIN</span>
        </div>

        <nav>
          <div 
            onClick={() => router.push('/admin/manage')}
            style={{ 
              padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', marginBottom: '10px', transition: '0.2s',
              background: 'transparent',
              color: '#64748B',
              fontWeight: 'normal',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}
          >
            <span style={{fontSize:'20px'}}>📍</span> จัดการสถานที่
          </div>
          <div 
            onClick={() => router.push('/admin/manage')}
            style={{ 
              padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', marginBottom: '10px', transition: '0.2s',
              background: 'transparent',
              color: '#64748B',
              fontWeight: 'normal',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}
          >
            <span style={{fontSize:'20px'}}>👥</span> บัญชีผู้ใช้
          </div>
          <div 
            onClick={() => router.push("/admin/analytics")}
            style={{ 
              padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', marginBottom: '10px', transition: '0.2s',
              background: 'transparent',
              color: '#64748B',
              fontWeight: 'normal',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}
          >
            <span style={{fontSize:'20px'}}>📊</span> สถิติอารมณ์
          </div>
          <div 
            onClick={() => router.push("/admin/contact")}
            style={{ 
              padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', transition: '0.2s',
              background: '#F1F5F9',
              color: '#4F46E5',
              fontWeight: 'bold',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}
          >
            <span style={{fontSize:'20px'}}>💬</span> ติดต่อจากผู้ใช้
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: '280px', padding: '20px 60px', position: 'relative' }}>
        {/* Admin Header with Profile Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '40px', paddingTop: '20px' }}>
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: isProfileOpen ? '#EDE9FE' : '#F3F4F6',
                border: '1px solid #E5E7EB',
                padding: '10px 16px',
                borderRadius: '35px',
                cursor: 'pointer',
                fontFamily: 'Kanit',
                fontWeight: '600',
                color: '#4B5563',
                transition: '0.2s'
              }}
            >
              <img
                src={user?.profileImage || "https://ui-avatars.com/api/?name=" + (user?.firstName || "Admin") + "&background=6D28D9&color=fff"}
                alt="Profile"
                style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6D28D9' }}
              />
              <span>{user?.firstName || "Admin"}</span>
            </button>

            {isProfileOpen && (
              <div style={{
                position: 'absolute',
                top: '60px',
                right: '0',
                width: '220px',
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
                padding: '12px',
                border: '1px solid #F1F5F9',
                zIndex: 1000
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ fontWeight: '800', color: '#1E1B4B', fontSize: '1rem' }}>{user?.firstName || "Admin"}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{user?.email}</div>
                </div>

                <div
                  onClick={() => {
                    router.push("/profile");
                    setIsProfileOpen(false);
                  }}
                  style={{
                    padding: '12px',
                    color: '#475569',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    borderRadius: '14px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#F8FAFC'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  ✏️ แก้ไขโปรไฟล์
                </div>

                <div style={{ borderTop: '1px solid #F1F5F9', margin: '8px 0' }}></div>

                <div
                  onClick={handleLogout}
                  style={{
                    padding: '12px',
                    color: '#EF4444',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    borderRadius: '14px',
                    textAlign: 'center',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#FEE2E2'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  ออกจากระบบ
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Page Title */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#1E293B', margin: 0 }}>💬 ข้อความจากผู้ใช้</h2>
          <p style={{ color: '#64748B', margin: '8px 0 0 0' }}>จำนวนข้อความทั้งหมด {messages.length} รายการ</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Messages List */}
          <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E2E8F0', overflow: 'hidden', height: 'fit-content', maxHeight: '600px', overflowY: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #E2E8F0', fontWeight: 'bold', color: '#1E1B4B' }}>ข้อความที่ได้รับ</div>
            {messages.map(msg => (
              <div 
                key={msg.id}
                onClick={() => {
                  setSelectedMessage(msg);
                  handleMarkAsRead(msg.id);
                }}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #F1F5F9',
                  cursor: 'pointer',
                  background: selectedMessage?.id === msg.id ? '#F1F5F9' : 'transparent',
                  transition: '0.2s',
                  borderLeft: msg.status === 'new' ? '4px solid #EF4444' : '4px solid transparent'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                onMouseLeave={(e) => {
                  if (selectedMessage?.id !== msg.id) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#1E1B4B', fontSize: '0.95rem' }}>{msg.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>{msg.subject}</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>📧 {msg.email}</div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>📅 {msg.date}</div>
                <span style={{
                  display: 'inline-block',
                  fontSize: '0.7rem',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  marginTop: '8px',
                  backgroundColor: msg.status === 'new' ? '#FEE2E2' : msg.status === 'replied' ? '#DBEAFE' : '#F3F4F6',
                  color: msg.status === 'new' ? '#EF4444' : msg.status === 'replied' ? '#0284C7' : '#64748B'
                }}>
                  {msg.status === 'new' ? '🔴 ใหม่' : msg.status === 'replied' ? '✅ ตอบแล้ว' : '👁️ อ่านแล้ว'}
                </span>
              </div>
            ))}
          </div>

          {/* Message Detail & Reply */}
          <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E2E8F0', padding: '30px', height: 'fit-content' }}>
            {selectedMessage ? (
              <>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1E1B4B', marginTop: 0 }}>📨 {selectedMessage.subject}</h3>
                
                <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontWeight: 'bold', color: '#64748B' }}>จาก:</span>
                    <div style={{ color: '#1E1B4B', fontWeight: 'bold' }}>{selectedMessage.name}</div>
                    <div style={{ color: '#64748B', fontSize: '0.9rem' }}>{selectedMessage.email}</div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontWeight: 'bold', color: '#64748B' }}>วันที่:</span>
                    <div style={{ color: '#1E1B4B' }}>{selectedMessage.date}</div>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#64748B' }}>เนื้อความ:</span>
                    <p style={{ color: '#1E1B4B', lineHeight: '1.6', marginTop: '8px' }}>{selectedMessage.message}</p>
                  </div>
                </div>

                <div>
                  <label style={{ fontWeight: 'bold', color: '#64748B', fontSize: '0.9rem' }}>📝 เขียนข้อความตอบกลับ</label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="พิมพ์ข้อความตอบกลับ..."
                    style={{
                      width: '100%',
                      minHeight: '120px',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1.5px solid #E2E8F0',
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      marginTop: '8px',
                      resize: 'vertical'
                    }}
                  />
                  <button
                    onClick={handleReply}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#4F46E5',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginTop: '12px',
                      transition: '0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#4338CA'}
                    onMouseLeave={(e) => e.target.style.background = '#4F46E5'}
                  >
                    ✉️ ส่งข้อความตอบกลับ
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>💭</div>
                <p>เลือกข้อความเพื่อดูรายละเอียด</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
