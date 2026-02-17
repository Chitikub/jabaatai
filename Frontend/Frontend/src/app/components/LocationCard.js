export default function LocationCard({ loc }) {
  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-500 group">
      <div className="relative h-56 w-full overflow-hidden">
        <img 
          src={loc.img} 
          alt={loc.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute top-4 right-4 bg-white/70 backdrop-blur-md p-2 rounded-full shadow-sm hover:bg-white transition-colors cursor-pointer">
          <span className="text-red-500">❤️</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-xl font-bold text-gray-800">{loc.name}</h4>
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
            <span className="text-yellow-500 text-sm font-bold">★ {loc.rating}</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed mb-4">{loc.info}</p>
        <button className="w-full py-3 bg-purple-50 text-purple-600 font-bold rounded-2xl hover:bg-purple-600 hover:text-white transition-colors">
          ดูรายละเอียดพิกัด 📍
        </button>
      </div>
    </div>
  );
}