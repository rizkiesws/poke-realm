import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBerryDetail } from "../services/berryService";
import { X } from "lucide-react";

const BerryDetailSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden min-h-[50vh] animate-pulse transition-colors duration-300">
    <div className="bg-gray-200 dark:bg-gray-700 p-6 h-[200px] relative"></div>
    <div className="pt-16 px-8 pb-8 space-y-6">
      <div className="flex justify-between mt-6 gap-4">
        <div className="flex-1 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        <div className="flex-1 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        <div className="flex-1 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
      </div>
    </div>
  </div>
);

const BerryDetail = ({ name, onClose }) => {
  const { data: berry, isLoading, isError } = useQuery({
    queryKey: ["berry", name],
    queryFn: () => fetchBerryDetail(name),
  });

  if (isLoading) return <BerryDetailSkeleton />;
  if (isError || !berry) return <div className="p-10 text-center text-red-500 font-bold bg-white dark:bg-gray-800 rounded-3xl">Berry not found!</div>;

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${berry.name}-berry.png`;
  const activeFlavors = berry.flavors.filter(f => f.potency > 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden relative transition-colors duration-300">
      {/* HEADER TEMA HIJAU (EMERALD) */}
      <div className="bg-emerald-600 dark:bg-emerald-900 relative text-white h-[200px] flex items-center justify-center transition-colors duration-500 rounded-t-3xl">
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-20">
          <button onClick={onClose} className="bg-white/20 hover:bg-white/40 rounded-full p-2 backdrop-blur-sm transition cursor-pointer">
            <X size={24} />
          </button>
          <span className="text-xs font-bold opacity-90 uppercase px-3 py-1 bg-white/20 rounded-full tracking-wider shadow-sm flex items-center gap-1.5">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/miracle-seed.png" alt="Seed" className="w-4 h-4 object-contain" /> 
            Berry
          </span>
        </div>

        <div className="z-10 text-center pb-8">
          <h1 className="text-4xl font-bold capitalize tracking-wide drop-shadow-md">{berry.name} Berry</h1>
          <p className="text-emerald-100 dark:text-emerald-200 font-medium mt-2 text-sm tracking-wide capitalize">
            Firmness: {berry.firmness.name.replace(/-/g, " ")}
          </p>
        </div>

        {/* Gambar Berry */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-20 bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg border-4 border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <img
            src={imageUrl}
            alt={`${berry.name} berry`}
            className="w-16 h-16 object-contain drop-shadow-md hover:scale-110 transition-transform rendering-pixelated"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
            }}
          />
        </div>
      </div>

      {/* BODY KONTEN */}
      <div className="pt-20 px-8 pb-8">
        
        {/* STATS KOTAK */}
        <div className="flex justify-between gap-4 mb-8">
          <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl text-center border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/wailmer-pail.png" alt="Growth" className="w-8 h-8 mx-auto mb-1 object-contain" />
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Growth Time</p>
            <p className="text-lg sm:text-xl font-black text-gray-800 dark:text-gray-100">{berry.growth_time}h</p>
          </div>
          <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl text-center border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/big-root.png" alt="Size" className="w-8 h-8 mx-auto mb-1 object-contain" />
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Size</p>
            <p className="text-lg sm:text-xl font-black text-gray-800 dark:text-gray-100">{berry.size} <span className="text-sm font-medium text-gray-500 dark:text-gray-400">mm</span></p>
          </div>
          <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl text-center border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/mystic-water.png" alt="Smoothness" className="w-8 h-8 mx-auto mb-1 object-contain" />
            <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">Smoothness</p>
            <p className="text-lg sm:text-xl font-black text-gray-800 dark:text-gray-100">{berry.smoothness}</p>
          </div>
        </div>

        {/* FLAVORS (Rasa) */}
        <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 flex items-center gap-2 transition-colors">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sweet-heart.png" alt="Flavor" className="w-5 h-5 object-contain" />
          Berry Flavors
        </h3>
        {activeFlavors.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {activeFlavors.map((flavor) => (
              <span key={flavor.flavor.name} className="px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold capitalize border border-red-100 dark:border-red-500/20 transition-colors">
                {flavor.flavor.name} ({flavor.potency})
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic mt-3 transition-colors">This berry has no strong flavors.</p>
        )}
      </div>
    </div>
  );
};

export default BerryDetail;