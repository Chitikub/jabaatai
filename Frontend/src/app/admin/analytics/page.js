"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedMood, setSelectedMood] = useState("all");
  
  // Mock data for mood statistics
  const [moodData] = useState({
    all: [
      { id: 1, name: "สง่างาม ดวงสว่าง", personality: "Introvert", location: "สวนป่าเบญจกิติ", mood: "สุข 😊", date: "2024-02-18", time: "14:30" },
      { id: 2, name: "นิชชา ใจดี", personality: "Extrovert", location: "Jodd Fairs", mood: "สนุก 🥳", date: "2024-02-18", time: "18:45" },
      { id: 3, name: "กิจจา สงบ", personality: "Introvert", location: "BACC หอศิลป์", mood: "สำคัญใจ 🥰", date: "2024-02-17", time: "10:15" },
      { id: 4, name: "ศศิ เก่ง", personality: "Ambivert", location: "สวนป่าเบญจกิติ", mood: "สุข 😊", date: "2024-02-17", time: "16:20" },
      { id: 5, name: "จารัส ใหญ่", personality: "Extrovert", location: "Jodd Fairs", mood: "สนุก 🥳", date: "2024-02-16", time: "20:00" },
    ],
    intro: [
      { id: 1, name: "สง่างาม ดวงสว่าง", personality: "Introvert", location: "สวนป่าเบญจกิติ", mood: "สุข 😊", date: "2024-02-18", time: "14:30" },
      { id: 3, name: "กิจจา สงบ", personality: "Introvert", location: "BACC หอศิลป์", mood: "สำคัญใจ 🥰", date: "2024-02-17", time: "10:15" },
    ],
    extro: [
      { id: 2, name: "นิชชา ใจดี", personality: "Extrovert", location: "Jodd Fairs", mood: "สนุก 🥳", date: "2024-02-18", time: "18:45" },
      { id: 5, name: "จารัส ใหญ่", personality: "Extrovert", location: "Jodd Fairs", mood: "สนุก 🥳", date: "2024-02-16", time: "20:00" },
    ],
    ambi: [
      { id: 4, name: "ศศิ เก่ง", personality: "Ambivert", location: "สวนป่าเบญจกิติ", mood: "สุข 😊", date: "2024-02-17", time: "16:20" },
    ]
  });

  const moodStats = {
    all: { total: 5, happy: 2, fun: 2, loved: 1 },
    intro: { total: 2, happy: 1, fun: 0, loved: 1 },
    extro: { total: 2, happy: 0, fun: 2, loved: 0 },
    ambi: { total: 1, happy: 1, fun: 0, loved: 0 }
  };

  const getMoodKey = () => {
    if (selectedMood === "all") return "all";
    if (selectedMood === "Introvert") return "intro";
    if (selectedMood === "Extrovert") return "extro";
    return "ambi";
  };

  const currentData = moodData[getMoodKey()];
  const stats = moodStats[getMoodKey()];

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
              background: '#F1F5F9',
              color: '#4F46E5',
              fontWeight: 'bold',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}
          >
            <span style={{fontSize:'20px'}}>📊</span> สถิติอารมณ์
          </div>
          <div 
            onClick={() => router.push("/admin/contact")}
            style={{ 
              padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', transition: '0.2s',
              background: 'transparent',
              color: '#64748B',
              fontWeight: 'normal',
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
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#1E293B', margin: 0 }}>📊 สถิติอารมณ์ของผู้ใช้</h2>
          <p style={{ color: '#64748B', margin: '8px 0 0 0' }}>ดูข้อมูลการประเมินอารมณ์จากผู้ใช้ทั้งหมด</p>
        </div>

        {/* Filter Mood */}
        <div style={{ marginBottom: '30px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'ทั้งหมด', icon: '😀' },
            { key: 'Introvert', label: 'Introvert', icon: '🎧' },
            { key: 'Extrovert', label: 'Extrovert', icon: '🎉' },
            { key: 'Ambivert', label: 'Ambivert', icon: '🤝' }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setSelectedMood(filter.key)}
              style={{
                padding: '12px 24px',
                borderRadius: '20px',
                border: selectedMood === filter.key ? '2px solid #4F46E5' : '1px solid #E2E8F0',
                background: selectedMood === filter.key ? '#EDE9FE' : 'white',
                color: selectedMood === filter.key ? '#4F46E5' : '#64748B',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: '0.2s'
              }}
            >
              {filter.icon} {filter.label}
            </button>
          ))}
        </div>

        {/* Statistics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
          {[
            { label: 'ทั้งหมด', value: stats.total, color: '#6366F1', icon: '📊' },
            { label: 'สุข 😊', value: stats.happy, color: '#10B981', icon: '😊' },
            { label: 'สนุก 🥳', value: stats.fun, color: '#F59E0B', icon: '🥳' },
            { label: 'สำคัญใจ 🥰', value: stats.loved, color: '#EF4444', icon: '🥰' }
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid #E2E8F0',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{stat.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: stat.color, marginBottom: '8px' }}>{stat.value}</div>
              <div style={{ color: '#64748B', fontWeight: '600' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Data Table */}
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ padding: '20px 24px', color: '#64748B', fontWeight: 'bold' }}>ชื่อผู้ใช้</th>
                <th style={{ padding: '20px 24px', color: '#64748B', fontWeight: 'bold' }}>บุคลิก</th>
                <th style={{ padding: '20px 24px', color: '#64748B', fontWeight: 'bold' }}>สถานที่ที่เยี่ยมชม</th>
                <th style={{ padding: '20px 24px', color: '#64748B', fontWeight: 'bold' }}>อารมณ์</th>
                <th style={{ padding: '20px 24px', color: '#64748B', fontWeight: 'bold' }}>วันที่ & เวลา</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map(row => (
                <tr key={row.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '20px 24px' }}>
                    <div style={{ fontWeight: 'bold', color: '#1E293B' }}>{row.name}</div>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      background: row.personality === 'Introvert' ? '#DBEAFE' : row.personality === 'Extrovert' ? '#FED7AA' : '#D1D5DB',
                      color: row.personality === 'Introvert' ? '#0284C7' : row.personality === 'Extrovert' ? '#D97706' : '#374151'
                    }}>
                      {row.personality}
                    </span>
                  </td>
                  <td style={{ padding: '20px 24px', color: '#1E293B' }}>{row.location}</td>
                  <td style={{ padding: '20px 24px', fontSize: '1.2rem' }}>{row.mood}</td>
                  <td style={{ padding: '20px 24px', color: '#64748B' }}>
                    {row.date} {row.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
