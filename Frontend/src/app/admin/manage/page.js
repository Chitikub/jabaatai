"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function AdminPage() {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("locations");
  const [locations, setLocations] = useState([
    { id: 1, name: "สวนป่าเบญจกิติ", personality: "Introvert", type: "ธรรมชาติ", lat: "13.73", lng: "100.55", rating: "4.8", icon: "🌿", color: "#E0F2F1", moods: ["สำคัญใจ 🥰", "สงบ 😌"] },
    { id: 2, name: "Jodd Fairs", personality: "Extrovert", type: "ตลาดกลางคืน", lat: "13.75", lng: "100.56", rating: "4.5", icon: "🎡", color: "#FFF3E0", moods: ["สนุก 🥳", "สุข 😊"] },
    { id: 3, name: "BACC หอศิลป์", personality: "Introvert", type: "ศิลปะ", lat: "13.74", lng: "100.53", rating: "4.7", icon: "🎨", color: "#F3E5F5", moods: [] },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: "Somchai Raidee", email: "somchai@email.com", status: "active", joinDate: "2024-01-15", joinDaysAgo: 36 },
    { id: 2, name: "Mana Deeja", email: "mana@email.com", status: "banned", joinDate: "2024-02-10", joinDaysAgo: 10 },
    { id: 3, name: "Somsri Happy", email: "somsri@email.com", status: "active", joinDate: "2024-03-01", joinDaysAgo: 20 },
  ]);

  // UC12 & UC13 States
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [newMoodTag, setNewMoodTag] = useState("");

  const availableMoods = ["สุข 😊", "สนุก 🥳", "สำคัญใจ 🥰", "สงบ 😌", "บ้านเหงา 😢", "ทะเยอทะยาน 💪"];

  const typeMapping = {
    green: { label: 'ธรรมชาติ', icon: '🌳', color: '#E0F2F1' },
    water: { label: 'แหล่งน้ำ', icon: '🌊', color: '#E1F5FE' },
    cafe: { label: 'คาเฟ่', icon: '☕', color: '#FFF3E0' },
    art: { label: 'ศิลปะ', icon: '🎨', color: '#F3E5F5' },
    general: { label: 'ทั่วไป', icon: '📍', color: '#F8FAFC' }
  };

  // --- ดึงข้อมูลผู้ใช้และจัดการ Dropdown ---
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
        rating: '5.0',
        moods: []
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
        setLocations(locations.filter(item => item.id !== id));
        Swal.fire({ icon: 'success', title: 'ลบแล้ว!', showConfirmButton: false, timer: 1000 });
      }
    });
  };

  // --- UC12: จัดการสถานที่ให้เข้ากับอารมณ์ ---
  const handleTagMoodForLocation = (locationId) => {
    const location = locations.find(l => l.id === locationId);
    setSelectedLocation(location);
    setSelectedMoods(location?.moods || []);
  };

  const handleMoodToggle = (mood) => {
    setSelectedMoods(prev =>
      prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
    );
  };

  const handleAddCustomMood = () => {
    if (newMoodTag.trim() && !selectedMoods.includes(newMoodTag)) {
      setSelectedMoods([...selectedMoods, newMoodTag]);
      setNewMoodTag("");
      Swal.fire({
        icon: 'success',
        title: 'เพิ่มแท็กสำเร็จ',
        text: `เพิ่ม "${newMoodTag}" แล้ว`,
        timer: 1200,
        showConfirmButton: false
      });
    }
  };

  const handleSaveMoodTags = async () => {
    if (!selectedLocation || selectedMoods.length === 0) {
      Swal.fire('ข้อมูลไม่ครบ', 'กรุณาเลือกอารมณ์อย่างน้อย 1 รายการ', 'warning');
      return;
    }

    Swal.fire({
      title: 'ยืนยันการบันทึก?',
      text: `บันทึก ${selectedMoods.length} แท็กสำหรับ ${selectedLocation.name}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4F46E5',
      confirmButtonText: 'บันทึก',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        setLocations(locations.map(loc =>
          loc.id === selectedLocation.id ? { ...loc, moods: selectedMoods } : loc
        ));
        Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ!', text: 'ข้อมูลการ Matching ถูกอัปเดตแล้ว', showConfirmButton: false, timer: 1500 });
        setSelectedLocation(null);
        setSelectedMoods([]);
      }
    });
  };

  // --- UC13: จัดการผู้ใช้ ---
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchUserQuery.toLowerCase())
  );

  const handleBanUser = (targetUser) => {
    Swal.fire({
      title: 'ยืนยันการระงับ',
      text: `คุณแน่ใจหรือไม่ที่จะระงับการใช้งาน ${targetUser.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'ใช่, ระงับเลย',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true,
      borderRadius: '20px'
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(users.map(u =>
          u.id === targetUser.id ? { ...u, status: 'banned' } : u
        ));
        Swal.fire({ icon: 'success', title: 'ดำเนินการสำเร็จ!', text: `${targetUser.name} ถูกระงับแล้ว`, showConfirmButton: false, timer: 1500 });
      }
    });
  };

  const handleUnbanUser = (targetUser) => {
    Swal.fire({
      title: 'ยืนยันการปลดเลิก',
      text: `คุณแน่ใจหรือไม่ที่จะยกเลิกการระงับ ${targetUser.name}?`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      confirmButtonText: 'ใช่, ยกเลิกระงับ',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true,
      borderRadius: '20px'
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers(users.map(u =>
          u.id === targetUser.id ? { ...u, status: 'active' } : u
        ));
        Swal.fire({ icon: 'success', title: 'ดำเนินการสำเร็จ!', text: `${targetUser.name} ได้รับการยกเลิกระงับแล้ว`, showConfirmButton: false, timer: 1500 });
      }
    });
  };

  const handleDeleteUser = (targetUser) => {
    Swal.fire({
      title: 'ยืนยันการลบผู้ใช้',
      text: `การลบจะถาวร กรุณาพิมพ์ "DELETE" เพื่อยืนยัน`,
      input: 'text',
      inputPlaceholder: 'พิมพ์ DELETE',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      confirmButtonText: 'ลบังถาวร',
      cancelButtonText: 'ยกเลิก',
      reverseButtons: true,
      borderRadius: '20px',
      validationMessage: 'ต้องพิมพ์ DELETE เพื่อยืนยัน'
    }).then((result) => {
      if (result.value === 'DELETE') {
        setUsers(users.filter(u => u.id !== targetUser.id));
        Swal.fire({ icon: 'success', title: 'ลบแล้ว!', text: `${targetUser.name} ถูกลบออกจากระบบแล้ว`, showConfirmButton: false, timer: 1500 });
      } else if (result.isDismissed === false && result.value !== 'DELETE') {
        Swal.fire('ข้อมูลไม่ถูกต้อง', 'ต้องพิมพ์ DELETE เพื่อยืนยันการลบ', 'error');
      }
    });
  };

  return (
    <div className="admin-wrapper" style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Kanit' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '280px', background: '#FFFFFF', borderRight: '1px solid #E2E8F0', padding: '30px 20px', position: 'fixed', height: '100vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', cursor: 'pointer' }} onClick={() => router.push('/admin')}>
          <div style={{ width: '40px', height: '40px', background: '#4F46E5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>M</div>
          <span style={{ fontWeight: 900, fontSize: '20px', color: '#1E293B' }}>MOOD ADMIN</span>
        </div>

        <nav>
          <div 
            onClick={() => router.push('/admin')}
            style={{ 
              padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', marginBottom: '10px', transition: '0.2s',
              background: 'transparent',
              color: '#64748B',
              fontWeight: 'normal',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}
          >
            <span style={{fontSize:'20px'}}>🏠</span> หน้าแรก
          </div>
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
              padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', marginBottom: '10px', transition: '0.2s',
              background: activeTab === "users" ? '#F1F5F9' : 'transparent',
              color: activeTab === "users" ? '#4F46E5' : '#64748B',
              fontWeight: activeTab === "users" ? 'bold' : 'normal',
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '40px', paddingTop: '20px', position: 'relative' }}>
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
                onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + (user?.firstName || "Admin") + "&background=6D28D9&color=fff"; }}
              />
              <span>{user?.firstName || "Admin"}</span>
              <span style={{ fontSize: '12px', marginLeft: '4px' }}>▼</span>
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
                  <img
                    src={user?.profileImage || "https://ui-avatars.com/api/?name=" + (user?.firstName || "Admin") + "&background=6D28D9&color=fff"}
                    alt="Profile"
                    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6D28D9', marginBottom: '10px' }}
                  />
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
                    textDecoration: 'none',
                    color: '#475569',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    borderRadius: '14px',
                    textAlign: 'center',
                    display: 'block',
                    cursor: 'pointer',
                    transition: '0.2s',
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
                    textDecoration: 'none',
                    color: '#EF4444',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    borderRadius: '14px',
                    textAlign: 'center',
                    display: 'block',
                    cursor: 'pointer',
                    transition: '0.2s'
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
        
        {/* Tab Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div style={{ position: 'relative' }}>
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
              <div key={loc.id} className="card-item" style={{ background: 'white', borderRadius: '24px', padding: '24px', border: '1px solid #E2E8F0', transition: '0.3s', position: 'relative' }}>
                <div style={{ height: '180px', background: loc.color || '#F8FAFC', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '64px', marginBottom: '20px' }}>
                  {loc.icon}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#6366F1', fontWeight: 800, textTransform: 'uppercase' }}>{loc.type}</span>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 'bold', 
                    padding: '4px 10px', 
                    borderRadius: '8px', 
                    background: loc.moods && loc.moods.length > 0 ? '#D1FAE5' : '#FEE2E2',
                    color: loc.moods && loc.moods.length > 0 ? '#059669' : '#DC2626'
                  }}>
                    {loc.moods && loc.moods.length > 0 ? `✅ Tagged (${loc.moods.length})` : '❌ Un-tagged'}
                  </span>
                </div>
                <h4 style={{ fontSize: '20px', fontWeight: 700, margin: '12px 0', color: '#1E293B' }}>{loc.name}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#64748B', fontSize: '14px' }}>
                  <span>⭐ {loc.rating}</span>
                  <span>📍 {loc.lat}, {loc.lng}</span>
                </div>
                {loc.moods && loc.moods.length > 0 && (
                  <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748B', marginBottom: '8px' }}>Mood Tags:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {loc.moods.map((mood, idx) => (
                        <span key={idx} style={{ 
                          fontSize: '11px', 
                          padding: '4px 10px', 
                          borderRadius: '12px', 
                          background: '#E0E7FF',
                          color: '#4F46E5',
                          fontWeight: '600'
                        }}>
                          {mood}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                  <button onClick={() => handleTagMoodForLocation(loc.id)} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #8B5CF6', background: '#F5F3FF', color: '#7C3AED', fontWeight: 'bold', cursor: 'pointer' }}>🎯 Mood</button>
                  <button onClick={() => handleEditLocation(loc)} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', fontWeight: 'bold', cursor: 'pointer' }}>✏️ Edit</button>
                  <button onClick={() => handleDeleteLocation(loc.id, loc.name)} style={{ width: '45px', borderRadius: '12px', border: 'none', background: '#FEE2E2', color: '#EF4444', cursor: 'pointer' }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
            {/* Search Bar */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              <input
                type="text"
                placeholder="🔍 ค้นหาชื่อ หรือ อีเมล..."
                value={searchUserQuery}
                onChange={(e) => setSearchUserQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit'
                }}
              />
              <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '8px' }}>
                พบ {filteredUsers.length} รายการ
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '20px 24px', color: '#64748B', fontWeight: 'bold' }}>ผู้ใช้งาน</th>
                  <th style={{ padding: '20px 24px', color: '#64748B', fontWeight: 'bold' }}>สถานะ</th>
                  <th style={{ padding: '20px 24px', color: '#64748B', fontWeight: 'bold' }}>วันที่เข้าร่วม</th>
                  <th style={{ padding: '20px 24px', color: '#64748B', fontWeight: 'bold', textAlign: 'center' }}>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? filteredUsers.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #F1F5F9', hover: { background: '#F8FAFC' } }}>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ fontWeight: 'bold', color: '#1E293B' }}>{user.name}</div>
                      <div style={{ fontSize: '13px', color: '#94A3B8' }}>{user.email}</div>
                      <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>สมัครมา {user.joinDaysAgo} วันแล้ว</div>
                    </td>
                    <td style={{ padding: '20px 24px' }}>
                      <span style={{ 
                        padding: '6px 14px', 
                        borderRadius: '8px', 
                        fontSize: '12px', 
                        fontWeight: 'bold', 
                        background: user.status === 'active' ? '#D1FAE5' : user.status === 'banned' ? '#FEE2E2' : '#FEF3C7', 
                        color: user.status === 'active' ? '#059669' : user.status === 'banned' ? '#DC2626' : '#B45309' 
                      }}>
                        {user.status === 'active' ? '✅ Active' : user.status === 'banned' ? '🚫 Banned' : '⏳ Pending'}
                      </span>
                    </td>
                    <td style={{ padding: '20px 24px', color: '#64748B' }}>{user.joinDate}</td>
                    <td style={{ padding: '20px 24px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {user.status === 'active' ? (
                          <button 
                            onClick={() => handleBanUser(user)} 
                            style={{ 
                              padding: '8px 14px', 
                              borderRadius: '10px', 
                              border: 'none', 
                              background: '#FEE2E2', 
                              color: '#DC2626', 
                              cursor: 'pointer', 
                              fontWeight: 'bold',
                              fontSize: '0.85rem'
                            }}
                          >
                            🚫 Ban
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleUnbanUser(user)} 
                            style={{ 
                              padding: '8px 14px', 
                              borderRadius: '10px', 
                              border: 'none', 
                              background: '#DBEAFE', 
                              color: '#0284C7', 
                              cursor: 'pointer', 
                              fontWeight: 'bold',
                              fontSize: '0.85rem'
                            }}
                          >
                            🔓 Unban
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteUser(user)} 
                          style={{ 
                            padding: '8px', 
                            borderRadius: '10px', 
                            border: 'none', 
                            background: '#F1F5F9', 
                            color: '#475569',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>ไม่พบผู้ใช้งาน</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* UC12 Modal: Tag Mood for Location */}
        {selectedLocation && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '24px',
              padding: '40px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#1E293B' }}>
                  🎯 จัดการอารมณ์ - {selectedLocation.name}
                </h2>
                <button
                  onClick={() => {
                    setSelectedLocation(null);
                    setSelectedMoods([]);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Location Info */}
              <div style={{
                background: selectedLocation.color || '#F8FAFC',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{ fontSize: '3rem' }}>{selectedLocation.icon}</div>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#1E293B', fontSize: '1.1rem' }}>{selectedLocation.name}</div>
                  <div style={{ color: '#64748B', fontSize: '0.9rem' }}>{selectedLocation.type}</div>
                  <div style={{ color: '#64748B', fontSize: '0.85rem', marginTop: '4px' }}>📍 {selectedLocation.lat}, {selectedLocation.lng}</div>
                </div>
              </div>

              {/* Available Moods */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#64748B', fontWeight: 'bold', fontSize: '0.9rem' }}>เลือกอารมณ์:</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '15px' }}>
                  {availableMoods.map((mood) => (
                    <button
                      key={mood}
                      onClick={() => handleMoodToggle(mood)}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: selectedMoods.includes(mood) ? '2px solid #4F46E5' : '1px solid #E2E8F0',
                        background: selectedMoods.includes(mood) ? '#EDE9FE' : '#F8FAFC',
                        color: selectedMoods.includes(mood) ? '#4F46E5' : '#64748B',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: '0.2s'
                      }}
                    >
                      {selectedMoods.includes(mood) ? '✓ ' : ''}{mood}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Custom Mood */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ margin: '0 0 15px 0', color: '#64748B', fontWeight: 'bold', fontSize: '0.9rem' }}>สร้าง Tag ใหม่:</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={newMoodTag}
                    onChange={(e) => setNewMoodTag(e.target.value)}
                    placeholder="เช่น: สึกเศร้า, ตื่นเต้น"
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.9rem'
                    }}
                  />
                  <button
                    onClick={handleAddCustomMood}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#6366F1',
                      color: 'white',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Selected Moods Display */}
              {selectedMoods.length > 0 && (
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#64748B', fontWeight: 'bold', fontSize: '0.9rem' }}>ที่เลือก ({selectedMoods.length}):</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {selectedMoods.map((mood) => (
                      <span key={mood} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 14px',
                        borderRadius: '20px',
                        background: '#E0E7FF',
                        color: '#4F46E5',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        {mood}
                        <button
                          onClick={() => setSelectedMoods(selectedMoods.filter(m => m !== mood))}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#4F46E5',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                          }}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleSaveMoodTags}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#4F46E5',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  💾 บันทึก
                </button>
                <button
                  onClick={() => {
                    setSelectedLocation(null);
                    setSelectedMoods([]);
                  }}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    background: 'white',
                    color: '#64748B',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  ยกเลิก
                </button>
              </div>
            </div>
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
