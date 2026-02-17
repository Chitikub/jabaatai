export default function MoodCard({ mood, onClick }) {
  return (
    <button
      onClick={() => onClick(mood)}
      className="flex flex-col items-center justify-center p-6 bg-white rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-4 border-transparent hover:border-purple-300 w-full"
    >
      <span className="text-5xl mb-3">{mood.emoji}</span>
      <span className="font-bold text-gray-700 text-lg">{mood.name}</span>
    </button>
  );
}