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

  const handleEditLocation = async (loc) => {
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

  return (
    <div className="admin-wrapper" style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Kanit' }}>
      
      {/* Sidebar: HCI - สม่ำเสมอและแยกส่วนชัดเจน */}
      <aside style={{ width: '280px', background: '#FFFFFF', borderRight: '1px solid #E2E8F0', padding: '30px 20px', position: 'fixed', height: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ width: '40px', height: '40px', background: '#4F46E5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>M</div>
          <span style={{ fontWeight: 900, fontSize: '20px', color: '#1E293B' }}>MOOD ADMIN</span>
        </div>

        <nav>
          <div 
            onClick={() => setActiveTab("locations")}
            style={{ 
              padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', marginBottom: '10px', transition: '0.2s',
              background: activeTab === "locations" ? '#F1F5F9' : 'transparent',
              color: activeTab === "locations" ? '#4F46E5' : '#64748B',
              fontWeight: activeTab === "locations" ? 'bold' : 'normal',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}
          >
            <span style={{fontSize:'20px'}}>📍</span> จัดการสถานที่
          </div>
          <div 
            onClick={() => setActiveTab("users")}
            style={{ 
              padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', transition: '0.2s',
              background: activeTab === "users" ? '#F1F5F9' : 'transparent',
              color: activeTab === "users" ? '#4F46E5' : '#64748B',
              fontWeight: activeTab === "users" ? 'bold' : 'normal',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}
          >
            <span style={{fontSize:'20px'}}>👥</span> บัญชีผู้ใช้
          </div>
        </nav>
      </aside>

      {/* Main Content: HCI - มีพื้นที่หายใจ (White Space) และโครงสร้างชัดเจน */}
      <main style={{ flex: 1, marginLeft: '280px', padding: '40px 60px' }}>
        
        {/* Tab Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '180px' }}>
          <div style={{ position: 'relative', marginBottom: '-150px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#1E293B', margin: 0 }}>
              {activeTab === "locations" ? "จัดการสถานที่" : "บัญชีผู้ใช้งาน"}
            </h2>
            <p style={{ color: '#64748B', margin: '8px 0 0 0' }}>
              {activeTab === "locations" ? `พบทั้งหมด ${locations.length} พิกัดในระบบ` : `มีผู้ใช้งานทั้งหมด ${users.length} ราย`}
            </p>
          </div>
          {activeTab === "locations" && (
            <button onClick={handleAddLocation} style={{ background: '#4F46E5', color: 'white', border: 'none', padding: '14px 28px', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)' }}>
              + เพิ่มพิกัดใหม่
            </button>
          )}
        </div>

        {/* Content Area */}
        {activeTab === "locations" ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {locations.map(loc => (
              <div key={loc.id} className="card-item" style={{ background: 'white', borderRadius: '24px', padding: '24px', border: '1px solid #E2E8F0', transition: '0.3s' }}>
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
                  <button onClick={() => handleEditLocation(loc)} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', fontWeight: 'bold', cursor: 'pointer' }}>แก้ไข</button>
                  <button onClick={() => handleDeleteLocation(loc.id, loc.name)} style={{ width: '45px', borderRadius: '12px', border: 'none', background: '#FEE2E2', color: '#EF4444', cursor: 'pointer' }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
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
                    <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                      <button onClick={() => handleToggleBan(user)} style={{ marginRight: '10px', padding: '8px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', color: user.status === 'active' ? '#EF4444' : '#10B981', fontWeight: 'bold' }}>
                        {user.status === 'active' ? 'ระงับ' : 'ปลด'}
                      </button>
                      <button onClick={() => handleDeleteUser(user.id)} style={{ padding: '8px', borderRadius: '10px', border: 'none', background: '#F1F5F9', cursor: 'pointer' }}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;700;900&display=swap');
        .card-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
          border-color: #4F46E5 !important;
        }
        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
      `}</style>
    </div>
  );
}