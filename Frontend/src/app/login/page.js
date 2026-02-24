"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();
  const [isSwitching, setIsSwitching] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSwitchPage = (path) => {
    setIsSwitching(true);
    setTimeout(() => {
      router.push(path);
    }, 150);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 🔑 [สำคัญมาก] บันทึก Token ที่ได้จาก Backend เพื่อเอาไปใช้ยืนยันตัวตนหน้าอื่น
        localStorage.setItem("token", data.token); 
        localStorage.setItem("user", JSON.stringify(data.user));
        
        window.dispatchEvent(new Event("userLogin"));
        window.dispatchEvent(new Event("storage"));

        // --- แจ้งเตือนสำเร็จ (สไตล์ Modern) ---
        Swal.fire({
          icon: "success",
          title: "เข้าสู่ระบบสำเร็จ",
          text: "ยินดีต้อนรับกลับมาครับ! 🔑",
          showConfirmButton: false,
          timer: 1500,
          iconColor: "#10B981", 
          customClass: { popup: "swal-rounded" },
        });

        // ตรวจสอบว่าเป็น admin หรือไม่
        const isAdmin = data.user?.role === "admin";

        setTimeout(() => {
          if (isAdmin) {
            router.push("/admin");
          } else {
            router.push("/");
          }
        }, 1500);
      } else {
        setIsLoading(false);
        Swal.fire({
          icon: "error",
          title: "เข้าสู่ระบบไม่สำเร็จ",
          text: data.error || "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
          confirmButtonColor: "#0F172A", 
          iconColor: "#EF4444",
          customClass: { popup: "swal-rounded" },
        });
      }
    } catch (error) {
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
        confirmButtonColor: "#0F172A",
        customClass: { popup: "swal-rounded" },
      });
    }
  };

  return (
    <main style={mainBgStyle}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&display=swap');
        
        * { font-family: 'IBM Plex Sans Thai', 'Plus Jakarta Sans', sans-serif; }

        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .page-fade { 
          animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }

        .btn-hover { transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
        .btn-hover:hover { 
          transform: translateY(-2px); 
          box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.3); 
        }
        .btn-hover:active { transform: translateY(0); }

        .input-focus:focus-within {
          border-color: #0F172A !important;
          box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.05) !important;
          background-color: #ffffff !important;
        }

        .swal-rounded { border-radius: 24px !important; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15) !important; }

        /* Loader Animation */
        .spinner {
          width: 20px; height: 20px;
          border: 3px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: #fff;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className={isVisible ? "page-fade" : ""} style={containerStyle}>
        
        {/* Toggle Switch */}
        <div style={toggleContainerStyle}>
          <div
            style={{
              ...slidingBgStyle,
              left: isSwitching ? "4px" : "50%",
              background: "#0F172A", // สีกรมท่า (Slate)
              transition: "left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 4px 15px rgba(15, 23, 42, 0.2)",
            }}
          ></div>
          <div
            onClick={() => handleSwitchPage("/signup")}
            style={{ ...toggleTextStyle, color: "#64748B", cursor: "pointer" }}
          >
            สมัครสมาชิก
          </div>
          <div style={{ ...toggleTextStyle, color: "#fff" }}>เข้าสู่ระบบ</div>
        </div>

        {/* Social Login Buttons */}
        <div style={{ display: "flex", gap: "15px", marginBottom: "32px", marginTop: "10px" }}>
          {["G", "f", "A"].map((icon, i) => (
            <div key={i} className="btn-hover" style={socialButtonStyle}>
              {icon}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={dividerStyle}>
          <div style={lineStyle}></div>
          <span style={{ padding: "0 15px", color: "#94A3B8", fontSize: "0.85rem", fontWeight: "500" }}>
            หรือเข้าสู่ระบบด้วย Email
          </span>
          <div style={lineStyle}></div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={formWrapperStyle}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>อีเมล</label>
            <div className="input-focus" style={inputContainerStyle}>
              <span style={{ color: "#94A3B8", marginRight: "10px" }}>✉️</span>
              <input
                type="email"
                style={inputFieldStyle}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>รหัสผ่าน</label>
            <div className="input-focus" style={inputContainerStyle}>
              <span style={{ color: "#94A3B8", marginRight: "10px" }}>🔒</span>
              <input
                type="password"
                style={{ ...inputFieldStyle, fontFamily: "sans-serif" }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={optionsStyle}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "0.85rem", color: "#64748B", fontWeight: "500" }}>
              <input type="checkbox" style={{ accentColor: "#0F172A", width: "16px", height: "16px" }} />
              จดจำฉันไว้
            </label>
            <span
              onClick={() => router.push("/forgot-password")}
              style={{ fontSize: "0.85rem", color: "#6366F1", fontWeight: "700", cursor: "pointer", transition: "0.2s" }}
              onMouseOver={(e) => e.target.style.color = "#4F46E5"}
              onMouseOut={(e) => e.target.style.color = "#6366F1"}
            >
              ลืมรหัสผ่าน?
            </span>
          </div>

          <button
            type="submit"
            className="btn-hover"
            disabled={isLoading}
            style={{
              ...submitButtonStyle,
              background: "#0F172A", // สีหลักหน้า Home
              marginTop: "15px",
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
              display: "flex",
              justifyContent: "center"
            }}
          >
            {isLoading ? <div className="spinner"></div> : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p style={{ marginTop: "30px", fontSize: "0.95rem", color: "#64748B" }}>
          ยังไม่มีบัญชีใช่ไหม?{" "}
          <span
            onClick={() => handleSwitchPage("/signup")}
            style={{ color: "#0F172A", fontWeight: "800", cursor: "pointer", textDecoration: "underline", textDecorationColor: "transparent", transition: "0.3s" }}
            onMouseOver={(e) => e.target.style.textDecorationColor = "#0F172A"}
            onMouseOut={(e) => e.target.style.textDecorationColor = "transparent"}
          >
            สร้างบัญชีใหม่
          </span>
        </p>
      </div>
    </main>
  );
}

// --- Styles (ปรับเป็น Glassmorphism & Soft UI) ---
const mainBgStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f4f7ff",
  backgroundImage: "radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(236, 72, 153, 0.15) 0px, transparent 50%)",
  padding: "40px 20px",
};

const containerStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  width: "100%",
  maxWidth: "460px",
  borderRadius: "36px",
  padding: "45px 40px",
  boxShadow: "0 20px 40px rgba(15, 23, 42, 0.06)",
  border: "1px solid rgba(255, 255, 255, 0.6)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const toggleContainerStyle = {
  display: "flex",
  backgroundColor: "rgba(241, 245, 249, 0.8)",
  borderRadius: "100px",
  padding: "6px",
  position: "relative",
  height: "58px",
  alignItems: "center",
  width: "100%",
  marginBottom: "35px",
  border: "1px solid #E2E8F0"
};

const slidingBgStyle = {
  position: "absolute",
  width: "calc(50% - 6px)",
  height: "calc(100% - 12px)",
  borderRadius: "100px",
  zIndex: 1,
};

const toggleTextStyle = {
  flex: 1,
  zIndex: 2,
  fontWeight: "700",
  fontSize: "0.95rem",
  textAlign: "center",
};

const formWrapperStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  width: "100%",
};

const inputGroupStyle = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
};

const inputContainerStyle = {
  display: "flex",
  alignItems: "center",
  width: "90%",
  padding: "0 20px",
  borderRadius: "16px",
  border: "2px solid #E2E8F0",
  backgroundColor: "rgba(255,255,255,0.8)",
  height: "56px",
  transition: "all 0.3s ease",
};

const inputFieldStyle = {
  flex: 1,
  border: "none",
  outline: "none",
  backgroundColor: "transparent",
  fontSize: "1rem",
  color: "#1E293B",
  fontWeight: "500",
  width: "100%",
};

const labelStyle = {
  fontSize: "0.9rem",
  fontWeight: "700",
  color: "#475569",
  marginBottom: "8px",
  marginLeft: "5px",
};

const optionsStyle = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  marginTop: "-5px",
  marginBottom: "10px",
  padding: "0 5px",
};

const submitButtonStyle = {
  width: "100%",
  padding: "16px",
  color: "#fff",
  border: "none",
  borderRadius: "16px",
  fontSize: "1.05rem",
  fontWeight: "700",
  boxShadow: "0 10px 20px -5px rgba(15, 23, 42, 0.3)",
};

const socialButtonStyle = {
  width: "56px",
  height: "56px",
  borderRadius: "16px",
  border: "1px solid #E2E8F0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.3rem",
  fontWeight: "bold",
  cursor: "pointer",
  backgroundColor: "rgba(255,255,255,0.8)",
  color: "#475569"
};

const dividerStyle = {
  display: "flex",
  alignItems: "center",
  margin: "25px 0",
  width: "100%",
};

const lineStyle = { flex: 1, height: "1px", backgroundColor: "#E2E8F0" };