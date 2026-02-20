"use client";
import { useState } from "react";
import Swal from "sweetalert2";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
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

  // --- CSS สำหรับแก้ Hydration Error ---
  const internalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Mali:wght@300;400;500;600;700&display=swap');
    
    body { margin: 0; font-family: 'Mali', sans-serif; background: #F8FAFC; }
    
    .card-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.05);
      border-color: #6366f1 !important;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .admin-wrapper ::-webkit-scrollbar { width: 6px; }
    .admin-wrapper ::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
  `;

  // --- จัดการสถานที่ ---
  const handleAddLocation = async () => {
    const { value: formValues } = await Swal.fire({
      title: '<span style="font-family:Mali; font-weight:700; color:#1e1b4b;">✨ เพิ่มพิกัดใหม่</span>',
      background: '#ffffff',
      borderRadius: '30px',
      showCloseButton: true,
      confirmButtonText: 'บันทึกข้อมูล',
      confirmButtonColor: '#6366f1',
      html: `
        <div style="font-family: 'Mali', sans-serif; text-align: left; padding: 10px;">
          <label style="font-size: 14px; font-weight: bold; color: #6366f1;">ชื่อสถานที่</label>
          <input id="swal-name" class="swal2-input" style="width: 100%; margin: 8px 0 20px 0; border-radius: 15px; font-family: Mali;" placeholder="ระบุชื่อสถานที่...">
          <div style="display: flex; gap: 15px; margin-bottom: 20px;">
            <div style="flex: 1;">
              <label style="font-size: 12px; font-weight: bold; color: #94a3b8;">LATITUDE</label>
              <input id="swal-lat" class="swal2-input" style="width: 100%; margin: 8px 0 0 0; border-radius: 12px; font-family: Mali;" placeholder="13.7xxx">
            </div>
            <div style="flex: 1;">
              <label style="font-size: 12px; font-weight: bold; color: #94a3b8;">LONGITUDE</label>
              <input id="swal-lng" class="swal2-input" style="width: 100%; margin: 8px 0 0 0; border-radius: 12px; font-family: Mali;" placeholder="100.5xxx">
            </div>
          </div>
          <label style="font-size: 14px; font-weight: bold; color: #94a3b8;">ประเภท & บุคลิก</label>
          <div style="display: flex; gap: 10px; margin-top: 8px;">
            <select id="swal-type" class="swal2-input" style="flex: 1; margin: 0; border-radius: 12px; font-size: 14px; font-family: Mali;">
               <option value="green">🌳 ธรรมชาติ</option>
               <option value="water">🌊 แหล่งน้ำ</option>
               <option value="cafe">☕ คาเฟ่</option>
               <option value="art">🎨 ศิลปะ</option>
            </select>
            <select id="swal-perso" class="swal2-input" style="flex: 1; margin: 0; border-radius: 12px; font-size: 14px; font-family: Mali;">
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
      title: '<span style="font-family:Mali; font-weight:700; color:#1e1b4b;">✏️ แก้ไขสถานที่</span>',
      background: '#ffffff',
      borderRadius: '30px',
      showCloseButton: true,
      confirmButtonText: 'อัปเดตข้อมูล',
      confirmButtonColor: '#6366f1',
      html: `
        <div style="font-family: 'Mali', sans-serif; text-align: left; padding: 10px;">
          <label style="font-size: 14px; font-weight: bold; color: #6366f1;">ชื่อสถานที่</label>
          <input id="edit-name" class="swal2-input" style="width: 100%; margin: 8px 0 20px 0; border-radius: 15px; font-family: Mali;" value="${loc.name}">
          <div style="display: flex; gap: 15px; margin-bottom: 20px;">
            <div style="flex: 1;">
              <label style="font-size: 12px; font-weight: bold; color: #94a3b8;">LATITUDE</label>
              <input id="edit-lat" class="swal2-input" style="width: 100%; margin: 8px 0 0 0; border-radius: 12px; font-family: Mali;" value="${loc.lat}">
            </div>
            <div style="flex: 1;">
              <label style="font-size: 12px; font-weight: bold; color: #94a3b8;">LONGITUDE</label>
              <input id="edit-lng" class="swal2-input" style="width: 100%; margin: 8px 0 0 0; border-radius: 12px; font-family: Mali;" value="${loc.lng}">
            </div>
          </div>
          <label style="font-size: 14px; font-weight: bold; color: #94a3b8;">ประเภท & บุคลิก</label>
          <div style="display: flex; gap: 10px; margin-top: 8px;">
            <select id="edit-type" class="swal2-input" style="flex: 1; margin: 0; border-radius: 12px; font-size: 14px; font-family: Mali;">
               <option value="green" ${currentTypeKey === 'green' ? 'selected' : ''}>🌳 ธรรมชาติ</option>
               <option value="water" ${currentTypeKey === 'water' ? 'selected' : ''}>🌊 แหล่งน้ำ</option>
               <option value="cafe" ${currentTypeKey === 'cafe' ? 'selected' : ''}>☕ คาเฟ่</option>
               <option value="art" ${currentTypeKey === 'art' ? 'selected' : ''}>🎨 ศิลปะ</option>
            </select>
            <select id="edit-perso" class="swal2-input" style="flex: 1; margin: 0; border-radius: 12px; font-size: 14px; font-family: Mali;">
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
          ? { ...item, ...formValues, type: mapping.label, icon: mapping.icon, color: mapping.color } 
          : item
      ));
      Swal.fire({ icon: 'success', title: 'แก้ไขเรียบร้อย!', showConfirmButton: false, timer: 1000 });
    }
  };

  const handleDeleteLocation = (id, name) => {
    Swal.fire({
      title: 'ลบสถานที่?',
      text: `คุณแน่ใจไหมว่าต้องการลบ "${name}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonText: 'ยกเลิก',
      confirmButtonText: 'ยืนยันการลบ',
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
      text: isBanning ? `ระงับการเข้าใช้งานของคุณ ${user.name}` : `คืนสิทธิ์ให้คุณ ${user.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isBanning ? '#ef4444' : '#10b981',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก',
      borderRadius: '20px'
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(users.map(u => u.id === user.id ? { ...u, status: isBanning ? "banned" : "active" } : u));
        Swal.fire({ icon: 'success', title: 'สำเร็จ!', showConfirmButton: false, timer: 1000 });
      }
    });
  };

  const handleDeleteUser = (id, name) => {
    Swal.fire({
      title: 'ลบผู้ใช้ถาวร?',
      text: `ข้อมูลของ "${name}" จะหายไปจากระบบทันที`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก',
      borderRadius: '20px'
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(users.filter(u => u.id !== id));
        Swal.fire({ title: 'ลบแล้ว!', icon: 'success', timer: 1000, showConfirmButton: false });
      }
    });
  };

  const DashboardView = () => (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: '#EEF2FF', padding: '30px', borderRadius: '24px', border: '2px solid #DBEAFE' }}>
          <p style={{ margin: 0, color: '#6366F1', fontWeight: 'bold' }}>📍 สถานที่ทั้งหมด</p>
          <h1 style={{ margin: '10px 0 0 0', fontSize: '40px' }}>{locations.length}</h1>
        </div>
        <div style={{ background: '#ECFDF5', padding: '30px', borderRadius: '24px', border: '2px solid #D1FAE5' }}>
          <p style={{ margin: 0, color: '#10B981', fontWeight: 'bold' }}>👥 ผู้ใช้งานระบบ</p>
          <h1 style={{ margin: '10px 0 0 0', fontSize: '40px' }}>{users.length}</h1>
        </div>
        <div style={{ background: '#FFF7ED', padding: '30px', borderRadius: '24px', border: '2px solid #FFEDD5' }}>
          <p style={{ margin: 0, color: '#F59E0B', fontWeight: 'bold' }}>⭐ คะแนนเฉลี่ย</p>
          <h1 style={{ margin: '10px 0 0 0', fontSize: '40px' }}>4.7</h1>
        </div>
      </div>
      <div style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
        <h3 style={{ marginTop: 0 }}>รายการที่เพิ่มล่าสุด</h3>
        {locations.slice(0, 3).map(loc => (
          <div key={loc.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 0', borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: '24px' }}>{loc.icon}</span>
            <div>
              <div style={{ fontWeight: 'bold' }}>{loc.name}</div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>{loc.type} • {loc.personality}</div>
            </div>
          </div>
        ))}
        <button 
          onClick={() => setActiveTab("locations")}
          style={{ width: '100%', marginTop: '20px', padding: '12px', border: 'none', background: '#F8FAFC', borderRadius: '12px', cursor: 'pointer', fontFamily: 'Mali', color: '#6366F1' }}
        >
          ดูทั้งหมด →
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-wrapper" style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Mali' }}>
      {/* ใช้แท็ก style ปกติเพื่อเลี่ยงการสุ่ม Class จาก styled-jsx */}
      <style dangerouslySetInnerHTML={{ __html: internalStyles }} />

      <aside style={{ width: '280px', background: '#FFFFFF', borderRight: '1px solid #E2E8F0', padding: '30px 20px', position: 'fixed', height: '100vh', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
          <div style={{ width: '40px', height: '40px', background: '#6366f1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>M</div>
          <span style={{ fontWeight: 700, fontSize: '20px', color: '#1E293B' }}>MOOD ADMIN</span>
        </div>
        <nav>
          {[
            { id: 'dashboard', label: 'หน้าหลัก', icon: '🏠' },
            { id: 'locations', label: 'จัดการสถานที่', icon: '📍' },
            { id: 'users', label: 'บัญชีผู้ใช้', icon: '👥' },
          ].map((item) => (
            <div 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{ 
                padding: '14px 20px', borderRadius: '15px', cursor: 'pointer', marginBottom: '10px', transition: '0.2s',
                background: activeTab === item.id ? '#EEF2FF' : 'transparent',
                color: activeTab === item.id ? '#6366f1' : '#64748B',
                fontWeight: activeTab === item.id ? 'bold' : 'normal',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}
            >
              <span style={{fontSize:'20px'}}>{item.icon}</span> {item.label}
            </div>
          ))}
        </nav>
      </aside>

      <main style={{ flex: 1, marginLeft: '280px', padding: '40px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#1E293B', margin: 0 }}>
              {activeTab === "dashboard" && "หน้าหลักแอดมิน 👋"}
              {activeTab === "locations" && "จัดการสถานที่"}
              {activeTab === "users" && "บัญชีผู้ใช้งาน"}
            </h2>
            <p style={{ color: '#64748B', margin: '5px 0 0 0' }}>จัดการระบบ Mood Tracking</p>
          </div>
          {activeTab === "locations" && (
            <button onClick={handleAddLocation} style={{ background: '#6366f1', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'Mali', boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)' }}>
              + เพิ่มพิกัดใหม่
            </button>
          )}
        </div>

        {activeTab === "dashboard" && <DashboardView />}

        {activeTab === "locations" && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {locations.map(loc => (
              <div key={loc.id} className="card-item" style={{ background: 'white', borderRadius: '24px', padding: '20px', border: '1px solid #E2E8F0', transition: '0.3s' }}>
                <div style={{ height: '150px', background: loc.color || '#F8FAFC', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', marginBottom: '15px' }}>
                  {loc.icon}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: '#6366F1', fontWeight: 'bold' }}>{loc.type}</span>
                  <span style={{ fontSize: '12px', background: '#F1F5F9', padding: '2px 8px', borderRadius: '6px' }}>{loc.personality}</span>
                </div>
                <h4 style={{ fontSize: '18px', margin: '10px 0', color: '#1E293B' }}>{loc.name}</h4>
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <button onClick={() => handleEditLocation(loc)} style={{ flex: 1, padding: '8px', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white', fontFamily: 'Mali', cursor: 'pointer' }}>แก้ไข</button>
                  <button onClick={() => handleDeleteLocation(loc.id, loc.name)} style={{ padding: '8px 12px', borderRadius: '10px', border: 'none', background: '#FEE2E2', color: '#EF4444', cursor: 'pointer' }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "users" && (
          <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '20px 24px' }}>ผู้ใช้งาน</th>
                  <th style={{ padding: '20px 24px' }}>สถานะ</th>
                  <th style={{ padding: '20px 24px', textAlign: 'center' }}>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                      <div style={{ fontSize: '13px', color: '#94A3B8' }}>{user.email}</div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '12px', background: user.status === 'active' ? '#DCFCE7' : '#FEE2E2', color: user.status === 'active' ? '#16A34A' : '#EF4444' }}>
                        {user.status === 'active' ? 'ปกติ' : 'ระงับการใช้งาน'}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                      <button onClick={() => handleToggleBan(user)} style={{ marginRight: '8px', padding: '6px 15px', borderRadius: '10px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer', fontFamily: 'Mali', color: user.status === 'active' ? '#EF4444' : '#10B981' }}>
                        {user.status === 'active' ? 'ระงับ' : 'ปลด'}
                      </button>
                      <button onClick={() => handleDeleteUser(user.id, user.name)} style={{ padding: '6px 10px', borderRadius: '10px', border: 'none', background: '#F1F5F9', color: '#64748B', cursor: 'pointer' }}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}