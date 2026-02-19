"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("locations");
  const [locations, setLocations] = useState([
    { id: 1, name: "สวนป่าเบญจกิติ", personality: "Introvert", type: "ธรรมชาติ", lat: "13.73", lng: "100.55", rating: "4.8", icon: "🌿", color: "#E0F2F1" },
    { id: 2, name: "Jodd Fairs", personality: "Extrovert", type: "ตลาดกลางคืน", lat: "13.75", lng: "100.56", rating: "4.5", icon: "🎡", color: "#FFF3E0" },
    { id: 3, name: "BACC หอศิลป์", personality: "Introvert", type: "ศิลปะ", lat: "13.74", lng: "100.53", rating: "4.7", icon: "🎨", color: "#F3E5F5" },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: "Somchai Raidee", email: "somchai@email.com", status: "active", joinDate: "2024-01-15" },
    { id: 2, name: "Mana Deeja", email: "mana@email.com", status: "banned", joinDate: "2024-02-10" },
    { id: 3, name: "Somsri Happy", email: "somsri@email.com", status: "active", joinDate: "2024-03-01" },
  ]);

  // ตัวช่วยแปลงค่า Type เป็น Label, Icon และ Color
  const typeMapping = {
    green: { label: 'ธรรมชาติ', icon: '🌳', color: '#E0F2F1' },
    water: { label: 'แหล่งน้ำ', icon: '🌊', color: '#E1F5FE' },
    cafe: { label: 'คาเฟ่', icon: '☕', color: '#FFF3E0' },
    art: { label: 'ศิลปะ', icon: '🎨', color: '#F3E5F5' },
    general: { label: 'ทั่วไป', icon: '📍', color: '#F8FAFC' }
  };

  // --- ฟังก์ชันเพิ่มสถานที่ (เดิม) ---
  const handleAddLocation = async () => {
    const { value: formValues } = await Swal.fire({
      title: '<span style="font-family:Kanit; font-weight:900; color:#1e1b4b;">✨ เพิ่มพิกัดใหม่</span>',
      background: '#ffffff',
      borderRadius: '30px',
      showCloseButton: true,
      confirmButtonText: 'บันทึกข้อมูล',
      confirmButtonColor: '#4F46E5',
      html: `
        <div style="font-family: 'Kanit', sans-serif; text-align: left; padding: 10px;">
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

  // --- ฟังก์ชันแก้ไขสถานที่ (ใหม่) ---
  const handleEditLocation = async (loc) => {
    // ค้นหา key เดิมเพื่อตั้งค่า default ใน select
    const currentTypeKey = Object.keys(typeMapping).find(key => typeMapping[key].label === loc.type) || 'green';

    const { value: formValues } = await Swal.fire({
      title: '<span style="font-family:Kanit; font-weight:900; color:#1e1b4b;">✏️ แก้ไขข้อมูลสถานที่</span>',
      background: '#ffffff',
      borderRadius: '30px',
      showCloseButton: true,
      confirmButtonText: 'อัปเดตข้อมูล',
      confirmButtonColor: '#4F46E5',
      html: `
        <div style="font-family: 'Kanit', sans-serif; text-align: left; padding: 10px;">
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

  // --- ฟังก์ชันลบสถานที่ (ปรับปรุงให้มี confirm) ---
  const handleDeleteLocation = (id, name) => {
    Swal.fire({
      title: 'ยืนยันการลบ?',
      text: `คุณกำลังจะลบ "${name}" ออกจากระบบ`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
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

  // --- ฟังก์ชันจัดการผู้ใช้ (คงเดิม) ---
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
      cancelButtonColor: '#ef4444',
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

  return (
    <div className="admin-container" style={{ display: 'flex', height: '100vh', width: '100vw', background: '#f0f2f5', overflow: 'hidden', fontFamily: "'Kanit', sans-serif" }}>
      
      {/* Sidebar - คงไว้เหมือนเดิมทุกประการ */}
      <aside style={{ width: '280px', background: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', padding: '40px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '50px', padding: '0 10px' }}>
           <img src="/logo.png" alt="Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
           <span style={{ fontWeight: 900, fontSize: '22px', color: '#1e1b4b', letterSpacing: '-1px' }}>Mood Location Manage</span>
        </div>
        
        <nav style={{ flex: 1 }}>
          <div 
            onClick={() => setActiveTab("locations")}
            style={{ padding: '16px 20px', background: activeTab === "locations" ? '#f5f3ff' : 'transparent', color: activeTab === "locations" ? '#4f46e5' : '#94a3b8', borderRadius: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', cursor: 'pointer', transition: '0.3s' }}
          >
            <span style={{ fontSize: '20px' }}>🏢</span> จัดการสถานที่
          </div>
          <div 
            onClick={() => setActiveTab("users")}
            style={{ padding: '16px 20px', background: activeTab === "users" ? '#f5f3ff' : 'transparent', color: activeTab === "users" ? '#4f46e5' : '#94a3b8', borderRadius: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: '0.3s' }}
          >
            <span style={{ fontSize: '20px' }}>👥</span> บัญชีผู้ใช้
          </div>
        </nav>

        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Version 2.0.4</p>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        
        {/* Header */}
        <header style={{ 
          height: '100px', 
          padding: '0 50px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          background: 'rgba(255, 255, 255, 0.2)', 
          backdropFilter: 'blur(15px)', 
          borderBottom: '1px solid rgba(255,255,255,0.3)',
          position: 'sticky',
          top: 0,
          zIndex: 100 
        }}>
           
        </header>

        {/* Content Area */}
        <section style={{ flex: 1, overflowY: 'auto', padding: '50px' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            
            {/* TAB: LOCATIONS */}
            {activeTab === "locations" && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                   <div>
                      <h3 style={{ fontSize: '32px', fontWeight: 900, color: '#1e1b4b', margin: 0 }}>สถานที่พิกัด</h3>
                      <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>มีทั้งหมด {locations.length} สถานที่ในระบบ</p>
                   </div>
                   <button 
                      onClick={handleAddLocation}
                      style={{ background: '#1e1b4b', color: 'white', border: 'none', padding: '16px 32px', borderRadius: '20px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 20px 25px -5px rgba(30, 27, 75, 0.2)', transition: 'transform 0.2s' }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                   >
                     <span style={{ fontSize: '20px' }}>+</span> เพิ่มสถานที่ใหม่
                   </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                  {locations.map(loc => (
                    <div key={loc.id} className="card-hover" style={{ background: '#ffffff', borderRadius: '40px', padding: '30px', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.02)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                      <div style={{ height: '220px', background: loc.color || '#f8fafc', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px', marginBottom: '25px', position: 'relative' }}>
                        {loc.icon}
                        <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.8)', padding: '8px 15px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold', color: '#1e1b4b', backdropFilter: 'blur(5px)' }}>
                           {loc.type}
                        </div>
                      </div>
                      <div style={{ padding: '0 10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ margin: 0, fontWeight: 900, fontSize: '22px', color: '#1e1b4b' }}>{loc.name}</h4>
                          <div style={{ background: '#f5f3ff', color: '#6366f1', padding: '4px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}>{loc.personality}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '15px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                             <span style={{ color: '#fbbf24' }}>⭐</span>
                             <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{loc.rating}</span>
                          </div>
                          <div style={{ color: '#94a3b8', fontSize: '13px' }}>📍 {loc.lat}, {loc.lng}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                           <button 
                            onClick={() => handleEditLocation(loc)}
                            style={{ flex: 1, padding: '12px', borderRadius: '15px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' }}
                           >แก้ไข</button>
                           <button 
                            onClick={() => handleDeleteLocation(loc.id, loc.name)} 
                            style={{ width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '15px', border: 'none', background: '#fee2e2', color: '#ef4444', cursor: 'pointer' }}
                           >🗑️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* TAB: USERS */}
            {activeTab === "users" && (
              <div style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', borderRadius: '40px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.5)' }}>
                <h3 style={{ fontSize: '28px', fontWeight: 900, color: '#1e1b4b', marginBottom: '30px' }}>บัญชีผู้ใช้งานระบบ</h3>
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 15px' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', color: '#94a3b8', fontSize: '14px' }}>
                      <th style={{ padding: '0 20px' }}>ผู้ใช้งาน</th>
                      <th>สถานะ</th>
                      <th>วันที่เข้าร่วม</th>
                      <th style={{ textAlign: 'center' }}>จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} style={{ background: '#fff', borderRadius: '20px', transition: 'transform 0.2s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.01)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                        <td style={{ padding: '20px', borderRadius: '20px 0 0 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '15px', background: user.status === 'active' ? '#f5f3ff' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                              {user.status === 'active' ? '👤' : '🚫'}
                            </div>
                            <div>
                              <div style={{ fontWeight: 'bold', color: '#1e1b4b' }}>{user.name}</div>
                              <div style={{ fontSize: '12px', color: '#94a3b8' }}>{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ padding: '6px 15px', borderRadius: '12px', fontSize: '12px', fontWeight: '900', background: user.status === 'active' ? '#dcfce7' : '#fee2e2', color: user.status === 'active' ? '#16a34a' : '#ef4444' }}>
                            {user.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ color: '#64748b', fontSize: '14px' }}>{user.joinDate}</td>
                        <td style={{ padding: '20px', borderRadius: '0 20px 20px 0', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button 
                              onClick={() => handleToggleBan(user)}
                              style={{ padding: '10px 18px', borderRadius: '15px', border: '1px solid #e2e8f0', background: '#fff', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', transition: '0.2s', color: user.status === 'active' ? '#ef4444' : '#10b981' }}
                            >
                              {user.status === 'active' ? 'ระงับการใช้งาน' : 'ปลดระงับ'}
                            </button>
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              style={{ width: '42px', height: '42px', borderRadius: '15px', border: 'none', background: '#1e1b4b', color: '#fff', cursor: 'pointer' }}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;700;900&display=swap');
        .card-hover:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 50px -12px rgba(0, 0, 0, 0.1) !important;
          border-color: #6366f1 !important;
        }
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
}