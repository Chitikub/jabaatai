"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("locations");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("user_profile") || localStorage.getItem("user");
      const parsedUser = userData ? JSON.parse(userData) : null;
      
      // ตรวจสอบว่าเป็น admin หรือไม่
      if (!parsedUser || (parsedUser.role !== "admin" && parsedUser.email !== "admin@gmail.com")) {
        router.push("/login");
      }
      setUser(parsedUser);
    }
  }, [router]);

  const handleLogout = () => {
    Swal.fire({
      title: "ยืนยันการออกจากระบบ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#4F46E5",
      confirmButtonText: "ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      reverseButtons: true,
      borderRadius: "20px"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        localStorage.removeItem("user_profile");
        router.push("/login");
      }
    });
  };
  const [locations, setLocations] = useState([
    { id: 1, name: "สวนป่าเบญจกิติ", personality: "Introvert", type: "ธรรมชาติ", lat: "13.73", lng: "100.55", rating: "4.8", icon: "🌿", color: "#E0F2F1" },
    { id: 2, name: "Jodd Fairs", personality: "Extrovert", type: "ตลาดกลางคืน", lat: "13.75", lng: "100.56", rating: "4.5", icon: "🎡", color: "#FFF3E0" },
    { id: 3, name: "BACC หอศิลป์", personality: "Introvert", type: "ศิลปะ", lat: "13.74", lng: "100.53", rating: "4.7", icon: "🎨", color: "#F3E5F5" },
  ]);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfile, setEditProfile] = useState({ firstName: '', lastName: '', gender: '', email: '', profileImage: '' });

  const [contactRequests, setContactRequests] = useState([
    { id: 1, name: 'ณัฐพล', email: 'nut@example.com', message: 'อยากแนะนำสถานที่ใหม่', date: '2025-12-01', status: 'open' },
    { id: 2, name: 'ปาริชาติ', email: 'pari@example.com', message: 'ระบบล็อกอินมีปัญหา', date: '2026-01-10', status: 'open' },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: "Somchai Raidee", email: "somchai@email.com", status: "active", joinDate: "2024-01-15" },
    { id: 2, name: "Mana Deeja", email: "mana@email.com", status: "banned", joinDate: "2024-02-10" },
    { id: 3, name: "Somsri Happy", email: "somsri@email.com", status: "active", joinDate: "2024-03-01" },
  ]);

  const typeMapping = {
    green: { label: 'ธรรมชาติ', icon: '🌳', color: '#E0F2F1' },
    water: { label: 'แหล่งน้ำ', icon: '🌊', color: '#E1F5FE' },
    cafe: { label: 'คาเฟ่', icon: '☕', color: '#FFF3E0' },
    art: { label: 'ศิลปะ', icon: '🎨', color: '#F3E5F5' },
    general: { label: 'ทั่วไป', icon: '📍', color: '#F8FAFC' }
  };

  // --- ฟังก์ชันคงเดิม (ตามที่ขอ) ---
  const handleAddLocation = async () => {
    const { value: formValues } = await Swal.fire({
      title: '<span style="font-family:Mali; font-weight:900; color:#1e1b4b;">✨ เพิ่มพิกัดใหม่</span>',
      background: '#ffffff',
      borderRadius: '30px',
      showCloseButton: true,
      confirmButtonText: 'บันทึกข้อมูล',
      confirmButtonColor: '#4F46E5',
      html: `
        <div style="font-family: 'Mali', sans-serif; text-align: left; padding: 10px;">
          <label style="font-size: 12px; font-weight: bold; color: #6366f1;">ชื่อสถานที่</label>
          <input id="swal-name" class="swal2-input" style="width: 100%; margin: 8px 0 20px 0; border-radius: 15px;" placeholder="ระบุชื่อสถานที่...">
          <div style="display: flex; gap: 15px; margin-bottom: 20px;">
            <div style="flex: 1;">
              <label style="font-size: 12px; font-weight: bold; color: #94a3b8;">LATITUDE</label>
              <input id="swal-lat" class="swal2-input" style="width: 100%; margin: 8px 0 0 0; border-radius: 12px;" placeholder="13.7xxx">
            </div>
            <div style="flex: 1;">
              <label style="font-size: 12px; font-weight: bold; color: #94a3b8;">LONGITUDE</label>
              <input id="swal-lng" class="swal2-input" style="width: 100%; margin: 8px 0 0 0; border-radius: 12px;" placeholder="100.5xxx">
            </div>
          </div>
          <label style="font-size: 12px; font-weight: bold; color: #94a3b8;">ประเภท & บุคลิก</label>
          <div style="display: flex; gap: 10px; margin-top: 8px;">
            <select id="swal-type" class="swal2-input" style="flex: 1; margin: 0; border-radius: 12px; font-size: 14px;">
               <option value="green">🌳 ธรรมชาติ</option>
               <option value="water">🌊 แหล่งน้ำ</option>
               <option value="cafe">☕ คาเฟ่</option>
               <option value="art">🎨 ศิลปะ</option>
            </select>
            <select id="swal-perso" class="swal2-input" style="flex: 1; margin: 0; border-radius: 12px; font-size: 14px;">
               <option value="Introvert">Introvert</option>
               <option value="Extrovert">Extrovert</option>
               <option value="Ambivert">Ambivert</option>
            </select>
          </div>
        </div>
      `,
      preConfirm: () => {
        const name = document.getElementById('swal-name').value;
        if (!name) return Swal.showValidationMessage('ต้องระบุชื่อสถานที่นะ!');
        return {
          name,
          lat: document.getElementById('swal-lat').value,
          lng: document.getElementById('swal-lng').value,
          typeKey: document.getElementById('swal-type').value,
          personality: document.getElementById('swal-perso').value,
        }
      }
    });

    if (formValues) {
      const mapping = typeMapping[formValues.typeKey] || typeMapping.general;
      const newLoc = {
        id: Date.now(),
        name: formValues.name,
        lat: formValues.lat,
        lng: formValues.lng,
        personality: formValues.personality,
        type: mapping.label,
        icon: mapping.icon,
        color: mapping.color,
        rating: '5.0'
      };
      setLocations([newLoc, ...locations]);
      Swal.fire({ icon: 'success', title: 'เพิ่มเรียบร้อย!', showConfirmButton: false, timer: 1500 });
    }
  };

  const handleEditLocation = async (loc) => {
    const currentTypeKey = Object.keys(typeMapping).find(key => typeMapping[key].label === loc.type) || 'green';
    const { value: formValues } = await Swal.fire({
      title: '<span style="font-family:Mali; font-weight:900; color:#1e1b4b;">✏️ แก้ไขข้อมูลสถานที่</span>',
      background: '#ffffff',
      borderRadius: '30px',
      showCloseButton: true,
      confirmButtonText: 'อัปเดตข้อมูล',
      confirmButtonColor: '#4F46E5',
      html: `
        <div style="font-family: 'Mali', sans-serif; text-align: left; padding: 10px;">
          <label style="font-size: 12px; font-weight: bold; color: #6366f1;">ชื่อสถานที่</label>
          <input id="edit-name" class="swal2-input" style="width: 100%; margin: 8px 0 20px 0; border-radius: 15px;" value="${loc.name}">
          <div style="display: flex; gap: 15px; margin-bottom: 20px;">
            <div style="flex: 1;">
              <label style="font-size: 12px; font-weight: bold; color: #94a3b8;">LATITUDE</label>
              <input id="edit-lat" class="swal2-input" style="width: 100%; margin: 8px 0 0 0; border-radius: 12px;" value="${loc.lat}">
            </div>
            <div style="flex: 1;">
              <label style="font-size: 12px; font-weight: bold; color: #94a3b8;">LONGITUDE</label>
              <input id="edit-lng" class="swal2-input" style="width: 100%; margin: 8px 0 0 0; border-radius: 12px;" value="${loc.lng}">
            </div>
          </div>
          <label style="font-size: 12px; font-weight: bold; color: #94a3b8;">ประเภท & บุคลิก</label>
          <div style="display: flex; gap: 10px; margin-top: 8px;">
            <select id="edit-type" class="swal2-input" style="flex: 1; margin: 0; border-radius: 12px; font-size: 14px;">
               <option value="green" ${currentTypeKey === 'green' ? 'selected' : ''}>🌳 ธรรมชาติ</option>
               <option value="water" ${currentTypeKey === 'water' ? 'selected' : ''}>🌊 แหล่งน้ำ</option>
               <option value="cafe" ${currentTypeKey === 'cafe' ? 'selected' : ''}>☕ คาเฟ่</option>
               <option value="art" ${currentTypeKey === 'art' ? 'selected' : ''}>🎨 ศิลปะ</option>
            </select>
            <select id="edit-perso" class="swal2-input" style="flex: 1; margin: 0; border-radius: 12px; font-size: 14px;">
               <option value="Introvert" ${loc.personality === 'Introvert' ? 'selected' : ''}>Introvert</option>
               <option value="Extrovert" ${loc.personality === 'Extrovert' ? 'selected' : ''}>Extrovert</option>
               <option value="Ambivert" ${loc.personality === 'Ambivert' ? 'selected' : ''}>Ambivert</option>
            </select>
          </div>
        </div>
      `,
      preConfirm: () => {
        const name = document.getElementById('edit-name').value;
        if (!name) return Swal.showValidationMessage('ต้องระบุชื่อสถานที่นะ!');
        return {
          name,
          lat: document.getElementById('edit-lat').value,
          lng: document.getElementById('edit-lng').value,
          typeKey: document.getElementById('edit-type').value,
          personality: document.getElementById('edit-perso').value,
        }
      }
    });

    if (formValues) {
      const mapping = typeMapping[formValues.typeKey] || typeMapping.general;
      setLocations(locations.map(item => 
        item.id === loc.id 
          ? { 
              ...item, 
              name: formValues.name, 
              lat: formValues.lat, 
              lng: formValues.lng, 
              personality: formValues.personality,
              type: mapping.label,
              icon: mapping.icon,
              color: mapping.color
            } 
          : item
      ));
      Swal.fire({ icon: 'success', title: 'อัปเดตเรียบร้อย!', showConfirmButton: false, timer: 1000 });
    }
  };

  const handleDeleteLocation = (id, name) => {
    Swal.fire({
      title: 'ยืนยันการลบ?',
      text: `คุณกำลังจะลบ "${name}" ออกจากระบบ`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก',
      borderRadius: '20px'
    }).then((result) => {
      if (result.isConfirmed) {
        setLocations(locations.filter(l => l.id !== id));
        Swal.fire({ title: 'ลบแล้ว!', icon: 'success', timer: 1000, showConfirmButton: false });
      }
    });
  };

  const handleToggleBan = (user) => {
    const isBanning = user.status === "active";
    Swal.fire({
      title: isBanning ? '🚫 ระงับบัญชี?' : '🔓 ปลดระงับบัญชี?',
      text: isBanning ? `ผู้ใช้ ${user.name} จะไม่สามารถใช้งานระบบได้ชั่วคราว` : `คืนสิทธิ์การใช้งานให้คุณ ${user.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isBanning ? '#ef4444' : '#10b981',
      confirmButtonText: isBanning ? 'ใช่, ระงับเลย' : 'ใช่, ปลดระงับ',
      cancelButtonText: 'ยกเลิก',
      borderRadius: '20px'
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(users.map(u => u.id === user.id ? { ...u, status: isBanning ? "banned" : "active" } : u));
        Swal.fire({ icon: 'success', title: 'ดำเนินการสำเร็จ!', showConfirmButton: false, timer: 1000 });
      }
    });
  };

  const handleDeleteUser = (id) => {
    Swal.fire({
      title: 'ลบผู้ใช้ถาวร?',
      text: "คุณจะไม่สามารถกู้คืนข้อมูลผู้ใช้รายนี้ได้!",
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#1e1b4b',
      confirmButtonText: 'ยกเลิก',
      cancelButtonText: 'ใช่, ลบถาวร',
      borderRadius: '20px'
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        setUsers(users.filter(u => u.id !== id));
        Swal.fire({ title: 'ลบแล้ว!', icon: 'success', timer: 1000, showConfirmButton: false });
      }
    });
  };

  // ----- Admin: edit profile (open inline panel) -----
  const handleEditProfile = () => {
    const current = user || {};
    setEditProfile({
      firstName: current.firstName || '',
      lastName: current.lastName || current.lastName || '',
      gender: current.gender || '',
      email: current.email || '',
      profileImage: current.profileImage || ''
    });
    setIsEditingProfile(false);
    setShowEditProfile(true);
  };

  const handleChangeProfile = (field, value) => {
    setEditProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    const updated = { ...(user || {}), ...editProfile };
    try { localStorage.setItem('user_profile', JSON.stringify(updated)); } catch (e) {}
    setUser(updated);
    setIsEditingProfile(false);
    setShowEditProfile(false);
    Swal.fire({ icon: 'success', title: 'บันทึกแล้ว', showConfirmButton: false, timer: 1000 });
  };

  const handleCancelEditProfile = () => {
    // revert changes
    setEditProfile({ firstName: user?.firstName || '', lastName: user?.lastName || '', gender: user?.gender || '', email: user?.email || '', profileImage: user?.profileImage || '' });
    setIsEditingProfile(false);
    setShowEditProfile(false);
  };

  // ----- Contact requests handlers -----
  const handleReplyRequest = async (req) => {
    const { value: reply } = await Swal.fire({
      title: `ตอบกลับ ${req.name}`,
      input: 'textarea',
      inputPlaceholder: 'เขียนข้อความตอบกลับ...',
      showCancelButton: true,
      confirmButtonText: 'ส่ง',
      cancelButtonText: 'ยกเลิก',
      preConfirm: (val) => {
        if (!val) Swal.showValidationMessage('กรุณาใส่ข้อความ');
        return val;
      }
    });
    if (reply) {
      // mock: mark as resolved
      setContactRequests(contactRequests.map(c => c.id === req.id ? { ...c, status: 'resolved' } : c));
      Swal.fire({ icon: 'success', title: 'ส่งข้อความเรียบร้อย', showConfirmButton: false, timer: 1200 });
    }
  };

  const handleToggleResolve = (id) => {
    setContactRequests(contactRequests.map(c => c.id === id ? { ...c, status: c.status === 'open' ? 'resolved' : 'open' } : c));
  };

  const handleDeleteRequest = (id) => {
    Swal.fire({ title: 'ลบคำร้องนี้?', text: 'ลบแล้วจะไม่สามารถกู้คืนได้', icon: 'warning', showCancelButton: true, confirmButtonText: 'ลบ', cancelButtonText: 'ยกเลิก' }).then(res => {
      if (res.isConfirmed) {
        setContactRequests(contactRequests.filter(c => c.id !== id));
        Swal.fire({ icon: 'success', title: 'ลบเรียบร้อย', showConfirmButton: false, timer: 1000 });
      }
    });
  };

  return (
    <div className="admin-wrapper" style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Mali, sans-serif' }}>

      {/* Sidebar (left) */}
      <aside style={{ width: '220px', background: '#FFFFFF', borderRight: '1px solid #EEF2FF', padding: '28px 18px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
            <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '900', fontSize: '20px' }}>M</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '16px', color: '#1E293B' }}>MOOD ADMIN</div>
              <div style={{ fontSize: '12px', color: '#A5B4FC', fontWeight: '600' }}>แดชบอร์ด</div>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
            <button onClick={() => setActiveTab("locations")} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '14px', cursor: 'pointer', border: 'none', background: activeTab === 'locations' ? '#EEF2FF' : 'transparent', color: activeTab === 'locations' ? '#6D28D9' : '#64748B', fontWeight: activeTab === 'locations' ? 700 : 600 }}>
              <span style={{ fontSize: '18px' }}>📍</span>
              <span style={{ fontSize: '15px' }}>จัดการสถานที่</span>
            </button>
            <button onClick={() => setActiveTab("users")} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '14px', cursor: 'pointer', border: 'none', background: activeTab === 'users' ? '#EEF2FF' : 'transparent', color: activeTab === 'users' ? '#6D28D9' : '#64748B', fontWeight: activeTab === 'users' ? 700 : 600 }}>
              <span style={{ fontSize: '18px' }}>👥</span>
              <span style={{ fontSize: '15px' }}>บัญชีผู้ใช้</span>
            </button>
            <button onClick={() => setActiveTab('contact')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '14px', cursor: 'pointer', border: 'none', background: 'transparent', color: '#64748B', fontWeight: 600 }}>
              <span style={{ fontSize: '18px' }}>✉️</span>
              <span style={{ fontSize: '15px' }}>คำร้องติดต่อ</span>
            </button>
          </nav>
        </div>

        <div style={{ marginTop: 'auto' }}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src={user.profileImage || "https://ui-avatars.com/api/?name=" + user.firstName + "&background=6D28D9&color=fff"} 
                alt="Profile" 
                style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }}
                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + user.firstName + "&background=6D28D9&color=fff"; }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontWeight: '800', fontSize: '14px', color: '#1E293B' }}>{user.firstName}</div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>Admin</div>
              </div>
            </div>
          )}

          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <button onClick={() => handleEditProfile()} style={{ flex: 1, padding: '8px', borderRadius: '10px', border: '1px solid #EAEAEA', background: '#FFFFFF', color: '#374151', fontWeight: '700', cursor: 'pointer' }}>✏️ แก้ไขโปรไฟล์</button>
            </div>
            <button onClick={handleLogout} style={{ width: '100%', padding: '10px', borderRadius: '12px', border: 'none', background: '#FEE2E2', color: '#EF4444', fontWeight: '700', cursor: 'pointer' }}>🚪 ออกจากระบบ</button>
            </div>
        </div>
      </aside>

      {/* Main Content: HCI - มีพื้นที่หายใจ (White Space) และโครงสร้างชัดเจน */}
      <main style={{ flex: 1, padding: '40px 80px' }}>
        
        {/* Tab Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ position: 'relative' }}>
              <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#1E293B', margin: 0, background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {activeTab === 'locations' ? '📍 จัดการสถานที่' : activeTab === 'users' ? '👥 บัญชีผู้ใช้งาน' : '✉️ คำร้องติดต่อ'}
              </h2>
              <p style={{ color: '#64748B', margin: '12px 0 0 0', fontSize: '16px' }}>
                {activeTab === 'locations' ? `พบทั้งหมด ${locations.length} พิกัดในระบบ` : activeTab === 'users' ? `มีผู้ใช้งานทั้งหมด ${users.length} ราย` : `รายการคำร้องทั้งหมด ${contactRequests.length} เรื่อง`}
              </p>
            </div>
          {activeTab === "locations" && (
            <button onClick={handleAddLocation} style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 8px 20px rgba(79, 70, 229, 0.35)', transition: '0.3s', fontSize: '15px' }} 
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-3px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              ✨ เพิ่มพิกัดใหม่
            </button>
          )}
        </div>

        {/* Content Area */}
        {activeTab === "locations" ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '28px' }}>
            {locations.map(loc => (
              <div key={loc.id} className="card-item" style={{ background: 'white', borderRadius: '24px', padding: '24px', border: '2px solid #E2E8F0', transition: '0.3s', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
                <div style={{ height: '180px', background: loc.color || '#F8FAFC', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', marginBottom: '20px' }}>
                  {loc.icon}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#6366F1', fontWeight: 800, textTransform: 'uppercase' }}>{loc.type}</span>
                  <span style={{ fontSize: '12px', background: '#F1F5F9', padding: '4px 10px', borderRadius: '8px', color: '#475569' }}>{loc.personality}</span>
                </div>
                <h4 style={{ fontSize: '20px', fontWeight: 700, margin: '12px 0', color: '#1E293B' }}>{loc.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#64748B', fontSize: '14px' }}>
                  <span>⭐ {loc.rating}</span>
                  <span>📍 {loc.lat}, {loc.lng}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                  <button onClick={() => handleEditLocation(loc)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '2px solid #E2E8F0', background: 'white', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', color: '#4F46E5' }}
                    onMouseEnter={(e) => { e.target.background = '#F1F5F9'; e.target.style.borderColor = '#4F46E5'; }}
                    onMouseLeave={(e) => { e.target.background = 'white'; e.target.style.borderColor = '#E2E8F0'; }}
                  >
                    ✏️ แก้ไข
                  </button>
                  <button onClick={() => handleDeleteLocation(loc.id, loc.name)} style={{ width: '50px', borderRadius: '12px', border: '2px solid #FEE2E2', background: '#FEE2E2', color: '#EF4444', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}
                    onMouseEnter={(e) => e.target.style.background = '#FECACA'}
                    onMouseLeave={(e) => e.target.style.background = '#FEE2E2'}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : activeTab === 'users' ? (
          <div style={{ background: 'white', borderRadius: '24px', border: '2px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '20px 24px', color: '#64748B' }}>ผู้ใช้งาน</th>
                  <th style={{ padding: '20px 24px', color: '#64748B' }}>สถานะ</th>
                  <th style={{ padding: '20px 24px', color: '#64748B' }}>วันที่เข้าร่วม</th>
                  <th style={{ padding: '20px 24px', color: '#64748B', textAlign: 'center' }}>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ fontWeight: 'bold', color: '#1E293B' }}>{user.name}</div>
                      <div style={{ fontSize: '13px', color: '#94A3B8' }}>{user.email}</div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', background: user.status === 'active' ? '#DCFCE7' : '#FEE2E2', color: user.status === 'active' ? '#16A34A' : '#EF4444' }}>
                        {user.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px', color: '#64748B' }}>{user.joinDate}</td>
                    <td style={{ padding: '24px', textAlign: 'center' }}>
                      <button onClick={() => handleToggleBan(user)} style={{ marginRight: '10px', padding: '10px 18px', borderRadius: '10px', border: '2px solid #E2E8F0', background: 'white', cursor: 'pointer', color: user.status === 'active' ? '#EF4444' : '#10B981', fontWeight: 'bold', transition: '0.3s' }}
                        onMouseEnter={(e) => e.target.style.background = user.status === 'active' ? '#FEE2E2' : '#DCFCE7'}
                        onMouseLeave={(e) => e.target.style.background = 'white'}
                      >
                        {user.status === 'active' ? '🚫 ระงับ' : '🔓 ปลด'}
                      </button>
                      <button onClick={() => handleDeleteUser(user.id)} style={{ padding: '10px', borderRadius: '10px', border: '2px solid #F1F5F9', background: '#F1F5F9', cursor: 'pointer', transition: '0.3s' }}
                        onMouseEnter={(e) => e.target.style.background = '#E2E8F0'}
                        onMouseLeave={(e) => e.target.style.background = '#F1F5F9'}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // contact tab
          activeTab === 'contact' ? (
            <div style={{ background: 'white', borderRadius: '24px', border: '2px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>คำร้องติดต่อ (Admin)</h3>
              <p style={{ color: '#64748B', marginBottom: '18px' }}>จัดการข้อความจากผู้ใช้งาน — ตอบกลับหรือปิดคำร้องได้</p>
              <div style={{ display: 'grid', gap: '12px' }}>
                {contactRequests.map(req => (
                  <div key={req.id} style={{ border: '1px solid #F1F5F9', padding: '14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 800, color: '#1E293B' }}>{req.name} <span style={{ fontWeight: 600, color: '#94A3B8', fontSize: '13px' }}>— {req.email}</span></div>
                      <div style={{ color: '#475569', marginTop: '6px' }}>{req.message}</div>
                      <div style={{ color: '#94A3B8', fontSize: '13px', marginTop: '8px' }}>{req.date} • <strong style={{ color: req.status === 'open' ? '#16A34A' : '#6B7280' }}>{req.status}</strong></div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button onClick={() => handleReplyRequest(req)} style={{ padding: '8px 12px', borderRadius: '10px', background: '#4F46E5', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 700 }}>ตอบกลับ</button>
                      <button onClick={() => handleToggleResolve(req.id)} style={{ padding: '8px 12px', borderRadius: '10px', background: req.status === 'open' ? '#10B981' : '#F3F4F6', color: req.status === 'open' ? 'white' : '#374151', border: 'none', cursor: 'pointer', fontWeight: 700 }}>{req.status === 'open' ? 'ดำเนินการแล้ว' : 'เปิดใหม่'}</button>
                      <button onClick={() => handleDeleteRequest(req.id)} style={{ padding: '8px 12px', borderRadius: '10px', background: '#FEE2E2', color: '#B91C1C', border: 'none', cursor: 'pointer', fontWeight: 700 }}>ลบ</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )}
      </main>

      {showEditProfile && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(30,27,75,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ width: '550px', background: 'white', borderRadius: '32px', padding: '40px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', position: 'relative' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F97316' }}>
                <img src={editProfile.profileImage || '/avatar-placeholder.png'} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <h3 style={{ marginTop: '16px', fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>{editProfile.firstName || 'User Name'}</h3>
              <div style={{ color: '#3B82F6', fontSize: '14px', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>✓ Verified Account</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#4B5563', marginBottom: '8px', display: 'block', fontWeight: 600 }}>ชื่อจริง</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#C4C4C4', fontSize: '16px' }}>👤</span>
                  <input disabled={!isEditingProfile} value={editProfile.firstName} onChange={(e)=>handleChangeProfile('firstName', e.target.value)} placeholder="User" style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '14px', border: '1px solid #D1D5DB', background: isEditingProfile ? 'white' : '#F5F5F5', fontSize: '14px', color: '#1F2937' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#4B5563', marginBottom: '8px', display: 'block', fontWeight: 600 }}>นามสกุล</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#C4C4C4', fontSize: '16px' }}>👤</span>
                  <input disabled={!isEditingProfile} value={editProfile.lastName} onChange={(e)=>handleChangeProfile('lastName', e.target.value)} placeholder="Name" style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '14px', border: '1px solid #D1D5DB', background: isEditingProfile ? 'white' : '#F5F5F5', fontSize: '14px', color: '#1F2937' }} />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', color: '#4B5563', marginBottom: '8px', display: 'block', fontWeight: 600 }}>ระบุเพศ</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#C4C4C4', fontSize: '16px' }}>⚥</span>
                <select disabled={!isEditingProfile} value={editProfile.gender} onChange={(e)=>handleChangeProfile('gender', e.target.value)} style={{ width: '100%', padding: '12px 12px 12px 40px', paddingRight: '14px', borderRadius: '14px', border: '1px solid #D1D5DB', background: isEditingProfile ? 'white' : '#F5F5F5', fontSize: '14px', color: '#1F2937', appearance: 'none' }}>
                  <option value="">ชาย</option>
                  <option value="ชาย">ชาย</option>
                  <option value="หญิง">หญิง</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
                <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }}>▼</span>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#4B5563', marginBottom: '8px', display: 'block', fontWeight: 600 }}>อีเมล</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#C4C4C4', fontSize: '16px' }}>✉️</span>
                <input readOnly value={editProfile.email} placeholder="Username@example.com" style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '14px', border: '1px solid #D1D5DB', background: '#F5F5F5', fontSize: '14px', color: '#666666' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start' }}>
              {!isEditingProfile ? (
                <>
                  <button onClick={() => setIsEditingProfile(true)} style={{ flex: 1, padding: '14px 22px', borderRadius: '14px', background: '#1E1B4B', color: 'white', border: 'none', fontWeight: 800, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>✏️ แก้ไขโปรไฟล์</button>
                  <button onClick={handleCancelEditProfile} style={{ padding: '14px 22px', borderRadius: '14px', background: '#E5E7EB', color: '#6B7280', border: 'none', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>กลับหน้าหลัก</button>
                </>
              ) : (
                <>
                  <button onClick={handleSaveProfile} style={{ flex: 1, padding: '14px 22px', borderRadius: '14px', background: '#1E1B4B', color: 'white', border: 'none', fontWeight: 800, fontSize: '15px', cursor: 'pointer' }}>ยืนยัน</button>
                  <button onClick={() => { setIsEditingProfile(false); setEditProfile({ firstName: user?.firstName || '', lastName: user?.lastName || '', gender: user?.gender || '', email: user?.email || '', profileImage: user?.profileImage || '' }); }} style={{ padding: '14px 22px', borderRadius: '14px', background: '#E5E7EB', color: '#6B7280', border: 'none', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>ยกเลิก</button>
                </>
              )}
            </div>

            <button onClick={() => setShowEditProfile(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#9CA3AF' }}>✕</button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Mali:wght@300;400;700;800&display=swap');
        .card-item:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 35px -5px rgba(79, 70, 229, 0.15);
          border-color: #4F46E5 !important;
        }
        .card-item {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
        }
        /* Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>
    </div>
  );
}