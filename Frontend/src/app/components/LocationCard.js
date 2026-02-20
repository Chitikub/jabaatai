"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function LocationCard({ loc }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);

  const checkLoginAndNavigate = (action) => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user") || localStorage.getItem("user_profile");
      
      if (!user) {
        Swal.fire({
          title: "ต้องเข้าสู่ระบบก่อน",
          text: `กรุณาเข้าสู่ระบบเพื่อใช้ฟีเจอร์นี้`,
          icon: "warning",
          confirmButtonColor: "#7C3AED",
          confirmButtonText: "ไปที่หน้า Login",
          showCancelButton: true,
          cancelButtonText: "ยกเลิก",
          borderRadius: "20px"
        }).then((result) => {
          if (result.isConfirmed) {
            router.push("/login");
          }
        });
        return;
      }

      // ถ้า logged in แล้ว
      if (action === "navigate") {
        router.push(`/location/${loc.id}`);
      } else if (action === "favorite") {
        handleAddFavorite();
      }
    }
  };

  const handleAddFavorite = () => {
    if (typeof window !== "undefined") {
      let favs = JSON.parse(localStorage.getItem("favorites") || "[]");
      
      if (isFavorite) {
        favs = favs.filter(fav => fav.id !== loc.id);
        setIsFavorite(false);
        Swal.fire({
          icon: "success",
          title: "ลบออกจากรายการโปรดแล้ว",
          showConfirmButton: false,
          timer: 1000,
          borderRadius: "20px"
        });
      } else {
        if (!favs.find(fav => fav.id === loc.id)) {
          favs.push(loc);
        }
        setIsFavorite(true);
        Swal.fire({
          icon: "success",
          title: "เพิ่มเข้ารายการโปรดแล้ว",
          showConfirmButton: false,
          timer: 1000,
          borderRadius: "20px"
        });
      }
      
      localStorage.setItem("favorites", JSON.stringify(favs));
      window.dispatchEvent(new Event("favoriteUpdate"));
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-500 group">
      <div className="relative h-56 w-full overflow-hidden">
        <img 
          src={loc.img} 
          alt={loc.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        <button 
          onClick={() => checkLoginAndNavigate("favorite")}
          className="absolute top-4 right-4 bg-white/70 backdrop-blur-md p-2 rounded-full shadow-sm hover:bg-white transition-colors cursor-pointer"
        >
          <span>{isFavorite ? "❤️" : "🤍"}</span>
        </button>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-xl font-bold text-gray-800">{loc.name}</h4>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
            <span className="text-yellow-500 text-sm font-bold">★ {loc.rating}</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">{loc.info}</p>
        <button 
          onClick={() => checkLoginAndNavigate("navigate")}
          className="w-full py-3 bg-purple-50 text-purple-600 font-bold rounded-2xl hover:bg-purple-600 hover:text-white transition-colors"
        >
          ดูรายละเอียดพิกัด 📍
        </button>
      </div>
    </div>
  );
}