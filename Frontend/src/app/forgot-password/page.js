'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

export default function ForgotPasswordPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        name: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Mocking the backend call to simulate logic
            // In real scenario: POST http://localhost:5000/api/forgot-password with { email, name }
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate generic success message to prevent user enumeration
            Swal.fire({
                icon: 'success',
                title: 'ตรวจสอบอีเมลของคุณ',
                text: 'หากข้อมูลถูกต้อง ระบบได้ส่งลิงก์เปลี่ยนรหัสผ่านไปยังอีเมลของคุณแล้ว กรุณาตรวจสอบภายใน 15 นาที',
                confirmButtonColor: '#7c3aed',
                confirmButtonText: 'กลับไปหน้าเข้าสู่ระบบ',
                allowOutsideClick: false
            }).then(() => {
                router.push('/login');
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'ไม่สามารถดำเนินการได้ในขณะนี้ โปรดลองใหม่ภายหลัง',
                confirmButtonColor: '#EF4444'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main style={mainBgStyle}>
            <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .page-fade { animation: fadeIn 0.5s ease-out forwards; }
        .input-focus:focus-within { border-color: #3B82F6 !important; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
      `}</style>

            <div className="page-fade" style={containerStyle}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div style={iconContainerStyle}>🔑</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b', margin: '15px 0 5px 0' }}>ลืมรหัสผ่าน?</h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>ไม่ต้องกังวล! เพียงระบุอีเมลและชื่อที่ลงทะเบียนไว้ เราจะช่วยคุณกู้คืนรหัสผ่าน</p>
                </div>

                <form onSubmit={handleSubmit} style={formWrapperStyle}>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>อีเมลที่ลงทะเบียน</label>
                        <div className="input-focus" style={inputContainerStyle}>
                            <span style={{ marginRight: '10px' }}>📧</span>
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                type="email"
                                style={inputFieldStyle}
                                placeholder="ระบุอีเมลของคุณ"
                                required
                            />
                        </div>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>ชื่อผู้ใช้งาน (Verify Identity)</label>
                        <div className="input-focus" style={inputContainerStyle}>
                            <span style={{ marginRight: '10px' }}>👤</span>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                type="text"
                                style={inputFieldStyle}
                                placeholder="ระบุชื่อของคุณ (เพื่อยืนยันตัวตน)"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            ...submitButtonStyle,
                            background: isLoading ? '#cbd5e1' : 'linear-gradient(135deg, #3B82F6, #2563EB)',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            transform: isLoading ? 'none' : 'translateY(0)'
                        }}
                    >
                        {isLoading ? 'กำลังดำเนินการ...' : 'ส่งลิงก์เปลี่ยนรหัสผ่าน'}
                    </button>

                </form>

                <div style={{ marginTop: '25px', textAlign: 'center' }}>
                    <span
                        onClick={() => router.push('/login')}
                        style={{
                            color: '#64748b',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            fontWeight: '600'
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '5px' }}><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
                        กลับไปหน้าเข้าสู่ระบบ
                    </span>
                </div>

            </div>
        </main>
    );
}

const mainBgStyle = { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', padding: '20px' };
const containerStyle = { backgroundColor: '#ffffff', width: '100%', maxWidth: '420px', borderRadius: '24px', padding: '40px 30px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.05)', border: '1px solid #f1f5f9' };
const iconContainerStyle = { width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto', color: '#3B82F6' };
const formWrapperStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroupStyle = { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' };
const inputContainerStyle = { display: 'flex', alignItems: 'center', width: '100%', padding: '0 15px', borderRadius: '14px', border: '1.5px solid #e2e8f0', backgroundColor: '#ffffff', height: '52px', transition: 'all 0.2s', fontSize: '0.95rem' };
const inputFieldStyle = { flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent', color: '#1e293b' };
const labelStyle = { fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px', marginLeft: '2px' };
const submitButtonStyle = { width: '100%', padding: '16px', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '1rem', fontWeight: '700', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)', marginTop: '10px', transition: 'all 0.2s' };
