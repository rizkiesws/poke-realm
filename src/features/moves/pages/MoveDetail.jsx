import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMoveDetail } from "../services/moveService";
import { X } from "lucide-react";

const MoveDetailSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden min-h-[50vh] animate-pulse transition-colors duration-300">
    <div className="bg-gray-200 dark:bg-gray-700 p-6 h-[200px] relative"></div>
    <div className="pt-12 px-8 pb-8 space-y-6">
      <div className="flex justify-between gap-4">
        <div className="flex-1 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        <div className="flex-1 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        <div className="flex-1 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
      </div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mt-6"></div>
    </div>
  </div>
);

const MoveDetail = ({ name, onClose }) => {
  const { data: move, isLoading, isError } = useQuery({
    queryKey: ["move", name],
    queryFn: () => fetchMoveDetail(name),
  });

  if (isLoading) return <MoveDetailSkeleton />;
  if (isError || !move) return <div className="p-10 text-center text-red-500 font-bold bg-white dark:bg-gray-800 rounded-3xl">Move not found!</div>;

  const description = move.flavor_text_entries?.find((e) => e.language.name === "en")?.flavor_text.replace(/\f/g, " ") || "No description available.";
  
  const typeColors = {
    grass: "bg-green-500", fire: "bg-red-500", water: "bg-blue-500", bug: "bg-lime-600",
    normal: "bg-gray-400", poison: "bg-purple-500", electric: "bg-yellow-400", ground: "bg-amber-600",
    fairy: "bg-pink-400", fighting: "bg-orange-700", psychic: "bg-pink-600", rock: "bg-stone-600",
    ghost: "bg-indigo-800", ice: "bg-cyan-300", dragon: "bg-indigo-600", dark: "bg-gray-800",
    steel: "bg-gray-500", flying: "bg-sky-400",
  };
  
  const bgColor = typeColors[move.type.name] || "bg-gray-800";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden relative transition-colors duration-300">
      {/* HEADER */}
      <div className={`${bgColor} relative text-white h-[200px] flex flex-col items-center justify-center transition-colors duration-500 rounded-t-3xl`}>
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-20">
          <button onClick={onClose} className="bg-white/20 hover:bg-white/40 rounded-full p-2 backdrop-blur-sm transition cursor-pointer">
            <X size={24} />
          </button>
          <span className="text-xs font-bold opacity-90 uppercase px-3 py-1 bg-white/20 rounded-full tracking-wider shadow-sm flex items-center gap-2">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/expert-belt.png" alt="Damage Class" className="w-4 h-4 object-contain" />
            {move.damage_class?.name || "Status"}
          </span>
        </div>

        <div className="z-10 text-center mt-4">
          <h1 className="text-3xl md:text-4xl font-bold capitalize tracking-wide drop-shadow-md px-4">{move.name.replace(/-/g, " ")}</h1>
          <span className="inline-block mt-3 px-4 py-1 bg-white/30 rounded-full text-sm font-semibold capitalize backdrop-blur-sm shadow-sm">
            {move.type.name} Type
          </span>
        </div>
      </div>

      {/* BODY KONTEN */}
      <div className="pt-8 px-8 pb-8">
        
        {/* STATS KOTAK */}
        <div className="flex justify-between gap-4 mb-8">
          <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl text-center border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/muscle-band.png" alt="Power" className="w-8 h-8 mx-auto mb-1 object-contain" />
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Power</p>
            <p className="text-xl font-black text-gray-800 dark:text-gray-100">{move.power || "-"}</p>
          </div>
          <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl text-center border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/wide-lens.png" alt="Accuracy" className="w-8 h-8 mx-auto mb-1 object-contain" />
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Accuracy</p>
            <p className="text-xl font-black text-gray-800 dark:text-gray-100">{move.accuracy ? `${move.accuracy}%` : "-"}</p>
          </div>
          <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl text-center border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/pp-up.png" alt="PP" className="w-8 h-8 mx-auto mb-1 object-contain" />
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">PP</p>
            <p className="text-xl font-black text-gray-800 dark:text-gray-100">{move.pp || "-"}</p>
          </div>
        </div>

        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 transition-colors">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/wise-glasses.png" alt="Effect" className="w-6 h-6 object-contain" /> 
          Effect Description
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-700/50 p-5 rounded-xl border border-gray-100 dark:border-gray-600 mt-3 text-sm md:text-base transition-colors">
          {description}
        </p>
      </div>
    </div>
  );
};

export default MoveDetail;