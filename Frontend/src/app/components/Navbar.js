"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hasFavorites, setHasFavorites] = useState(false);
  const dropdownRef = useRef(null);

  const checkUser = () => {
    if (typeof window !== "undefined") {
      const updatedProfile = localStorage.getItem("user_profile");
      const loginData = localStorage.getItem("user");

      const latestData = updatedProfile
        ? JSON.parse(updatedProfile)
        : loginData
          ? JSON.parse(loginData)
          : null;
      setUser(latestData);

      const savedFavs = localStorage.getItem("favorites");
      setHasFavorites(savedFavs ? JSON.parse(savedFavs).length > 0 : false);
    }
  };

  useEffect(() => {
    checkUser();
    window.addEventListener("userLogin", checkUser);
    window.addEventListener("storage", checkUser);
    window.addEventListener("favoriteUpdate", checkUser);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("userLogin", checkUser);
      window.removeEventListener("storage", checkUser);
      window.removeEventListener("favoriteUpdate", checkUser);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    window.location.href = "/";
  };

  const handleLogout = () => {
    Swal.fire({
      title: `<span style="font-size:1.25rem; font-weight:700; color:#0F172A">ยืนยันการออกจากระบบ?</span>`,
      html: `<span style="color:#64748B; font-size:0.95rem">ไว้แวะมาหาที่พักใจใหม่นะครับ ✨</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0F172A", // สีเดียวกับปุ่ม Home
      cancelButtonColor: "#F1F5F9",
      confirmButtonText: "ออกจากระบบ",
      cancelButtonText: "<span style='color:#475569; font-weight:600'>ยกเลิก</span>",
      reverseButtons: true,
      width: '400px',
      padding: '2em',
      borderRadius: "24px",
      background: '#fff',
      backdrop: `rgba(15, 23, 42, 0.4)`,
      customClass: { popup: "swal-rounded" },
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
    <div style={wrapperStyle}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&display=swap');
        
        /* Typography */
        .nav-font { font-family: 'IBM Plex Sans Thai', 'Plus Jakarta Sans', sans-serif; }

        /* Swal Custom */
        .swal-rounded { border-radius: 24px !important; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15) !important; }
        
        /* Navbar Links */
        .nav-btn { position: relative; transition: color 0.3s ease; }
        .nav-btn:hover { color: #0F172A !important; }
        .nav-btn::after {
          content: ''; position: absolute; width: 0; height: 2px; display: block;
          margin-top: 4px; right: 0; background: #0F172A; transition: width 0.3s ease; border-radius: 2px;
        }
        .nav-btn:hover::after { width: 100%; left: 0; background: #0F172A; }

        /* Signup Button (Slate/Dark Theme) */
        .signup-slate-btn {
          background: #0F172A;
          color: white;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .signup-slate-btn:hover { 
          background: #334155; 
          transform: translateY(-2px); 
          box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.3); 
        }
        
        /* Logo Hover */
        .logo-hover { transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .logo-hover:hover { transform: scale(1.05); }
        
        /* Heart Icon */
        .heart-icon-btn { 
          background: #F8FAFC; border: 1px solid #F1F5F9; border-radius: 50%;
          padding: 8px; cursor: pointer; display: flex; align-items: center; 
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        }
        .heart-icon-btn:hover { transform: scale(1.1); background: #FEF2F2; border-color: #FECACA; }
        .heart-active { animation: heartBeat 2s infinite; }

        /* Dropdown Menu & Items */
        .dropdown-menu-anim { 
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
          transform-origin: top right; 
        }
        .dropdown-item { position: relative; overflow: hidden; }
        .dropdown-item:hover { background-color: #F8FAFC; transform: translateX(4px); color: #0F172A !important; }
        .admin-item:hover { background-color: #F8FAFC; color: #0F172A !important; transform: translateX(4px); }

        /* Keyframes */
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-10px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>

      <nav style={navContainerStyle} className="nav-font">
        <div
          onClick={handleLogoClick}
          className="logo-hover"
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <img src="/logo.png" alt="Logo" style={logoImgStyle} />
        </div>

        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <a href="/guide" style={navButtonStyle} className="nav-btn">
            คู่มือใช้งาน
          </a>
          {user && (
            <a href="/contact" style={navButtonStyle} className="nav-btn">
              ติดต่อเรา
            </a>
          )}
          <div style={dividerVerticalStyle}></div>

          {user ? (
            <div
              ref={dropdownRef}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                position: "relative",
              }}
            >
              {/* ปุ่ม Favorite */}
              <button
                onClick={() => router.push("/favorites?tab=favorites")}
                className={`heart-icon-btn ${hasFavorites ? "heart-active" : ""}`}
              >
                <svg
                  width="20" height="20" viewBox="0 0 24 24"
                  fill={hasFavorites ? "#EF4444" : "none"}
                  stroke={hasFavorites ? "#EF4444" : "#64748B"}
                  strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.51 4.05 3 5.5l7 7Z" />
                </svg>
              </button>

              {/* Profile Trigger */}
              <div
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                style={{
                  ...profileTriggerStyle,
                  backgroundColor: isProfileOpen ? "#F1F5F9" : "transparent",
                  borderColor: isProfileOpen ? "#E2E8F0" : "transparent",
                }}
              >
                <img
                  src={
                    user.profileImage ||
                    "https://ui-avatars.com/api/?name=" +
                    user.firstName +
                    "&background=0F172A&color=fff&bold=true"
                  }
                  alt="Profile"
                  style={avatarStyle}
                  onError={(e) => {
                    e.target.src =
                      "https://ui-avatars.com/api/?name=" +
                      user.firstName +
                      "&background=0F172A&color=fff&bold=true";
                  }}
                />
                <span style={{ fontSize: "0.95rem", fontWeight: "600", color: "#334155" }}>
                  {user.firstName || "สมาชิก"}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "0.3s", transform: isProfileOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="dropdown-menu-anim" style={dropdownMenuStyle}>
                  <div style={dropdownHeaderStyle}>
                    <img
                      src={
                        user.profileImage ||
                        "https://ui-avatars.com/api/?name=" +
                        user.firstName +
                        "&background=0F172A&color=fff&bold=true"
                      }
                      alt="Profile"
                      style={avatarLargeStyle}
                    />
                    <div style={{ fontWeight: "700", marginTop: "12px", color: "#0F172A", fontSize: "1.05rem" }}>
                      {user.firstName}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#64748B", marginTop: "2px" }}>
                      {user.email}
                    </div>
                  </div>

                  <hr style={dropdownDividerStyle} />

                  <div
                    onClick={() => { router.push("/profile"); setIsProfileOpen(false); }}
                    className="dropdown-item"
                    style={dropdownItemStyle}
                  >
                    <span style={{marginRight: '10px', fontSize: '1.1rem'}}>👤</span> โปรไฟล์ส่วนตัว
                  </div>
                  <div
                    onClick={() => { router.push("/history"); setIsProfileOpen(false); }}
                    className="dropdown-item"
                    style={dropdownItemStyle}
                  >
                    <span style={{marginRight: '10px', fontSize: '1.1rem'}}>🕒</span> ประวัติการใช้งาน
                  </div>

                  {/* Admin Badge */}
                  {user?.role === "admin" && (
                    <>
                      <hr style={dropdownDividerStyle} />
                      <div
                        onClick={() => { router.push("/admin"); setIsProfileOpen(false); }}
                        className="admin-item"
                        style={{ ...dropdownItemStyle, color: "#0F172A", fontWeight: "700" }}
                      >
                        <span style={{marginRight: '10px', fontSize: '1.1rem'}}>⚡</span> Admin Dashboard
                      </div>
                    </>
                  )}

                  <hr style={dropdownDividerStyle} />
                  <div
                    onClick={handleLogout}
                    className="dropdown-item"
                    style={{ ...dropdownItemStyle, color: "#EF4444" }}
                  >
                    <span style={{marginRight: '10px', fontSize: '1.1rem'}}>🚪</span> ออกจากระบบ
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <a href="/login" style={loginLinkStyle} className="nav-btn">
                เข้าสู่ระบบ
              </a>
              <a href="/signup" className="signup-slate-btn" style={signupBtnStyle}>
                เริ่มต้นใช้งาน
              </a>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

// --- Styles ---
const wrapperStyle = {
  position: "fixed",
  top: "20px",
  left: 0,
  right: 0,
  display: "flex",
  justifyContent: "center",
  zIndex: 1000,
  padding: "0 20px",
  pointerEvents: "none", // ให้คลิกทะลุพื้นที่ว่างข้างๆ Navbar ได้
};

const navContainerStyle = {
  pointerEvents: "auto", 
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 24px",
  
  // 1. ใช้สีพื้นหลังเดียวกับ globals.css (#F8F9FF) แต่ทำให้โปร่งแสง (Opacity 0.7)
  backgroundColor: "rgba(248, 249, 255, 0.7)", 
  
  // 2. ใช้การเบลอเพื่อดึงสีจาก Blob ข้างหลังขึ้นมาผสม
  backdropFilter: "blur(20px) saturate(150%)", 
  WebkitBackdropFilter: "blur(20px) saturate(150%)",
  
  // 3. เส้นขอบบางๆ สีขาว เพื่อให้ดูมีมิติกระจก
  border: "1px solid rgba(255, 255, 255, 0.6)",
  
  // 4. เงาบางๆ สี Slate เพื่อให้เข้ากับสีกรมท่าของปุ่ม
  boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.05)", 

  borderRadius: "100px",
  width: "100%",
  maxWidth: "1000px",
};

const logoImgStyle = { height: "40px", width: "auto", cursor: "pointer", objectFit: "contain" };

const navButtonStyle = {
  textDecoration: "none",
  color: "#64748B",
  fontSize: "0.95rem",
  fontWeight: "600",
  padding: "8px 4px",
};

const dividerVerticalStyle = {
  height: "20px",
  width: "1px",
  backgroundColor: "rgba(226, 232, 240, 0.8)",
  margin: "0 10px",
  
};

const profileTriggerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "4px 14px 4px 4px",
  borderRadius: "100px",
  cursor: "pointer",
  border: "1px solid transparent",
  transition: "all 0.3s ease",
};

const avatarStyle = {
  width: "36px",
  height: "36px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "2px solid #fff",
};

const avatarLargeStyle = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "2px solid #E2E8F0",
};

const loginLinkStyle = {
  textDecoration: "none",
  color: "#475569",
  fontSize: "0.95rem",
  fontWeight: "600",
  padding: "10px 16px",
};

const signupBtnStyle = {
  padding: "10px 24px",
  borderRadius: "100px",
  textDecoration: "none",
  fontSize: "0.95rem",
  fontWeight: "600",
};

const dropdownMenuStyle = {
  position: "absolute",
  top: "calc(100% + 15px)",
  right: "0",
  width: "250px",
  backgroundColor: "rgba(255, 255, 255, 0.9)", // Dropdown ให้ทึบกว่านิดนึงเพื่อให้ลอยเด่นขึ้นมา
  backdropFilter: "blur(20px)",
  borderRadius: "24px",
  boxShadow: "0 20px 40px rgba(15, 23, 42, 0.1)",
  padding: "12px",
  border: "1px solid rgba(255, 255, 255, 0.5)",
};

const dropdownHeaderStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "15px 10px",
};

const dropdownItemStyle = {
  padding: "12px 16px",
  textDecoration: "none",
  color: "#475569",
  fontSize: "0.95rem",
  fontWeight: "500",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

const dropdownDividerStyle = {
  border: "none",
  borderTop: "1px solid rgba(226, 232, 240, 0.6)",
  margin: "8px 0",
};