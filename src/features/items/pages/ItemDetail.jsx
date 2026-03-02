import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchItemDetail } from "../services/itemService";
import { X } from "lucide-react";

const ItemDetailSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden min-h-[50vh] animate-pulse transition-colors duration-300">
    <div className="bg-amber-200 dark:bg-amber-900/50 p-6 h-[200px] relative"></div>
    <div className="pt-16 px-8 pb-8 space-y-6">
      <div className="flex justify-between mt-6 gap-4">
        <div className="flex-1 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        <div className="flex-1 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
      </div>
      <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl w-full mt-6"></div>
    </div>
  </div>
);

const ItemDetail = ({ name, onClose }) => {
  const { data: item, isLoading, isError } = useQuery({
    queryKey: ["item", name],
    queryFn: () => fetchItemDetail(name),
  });

  if (isLoading) return <ItemDetailSkeleton />;
  if (isError || !item) return <div className="p-10 text-center text-red-500 font-bold bg-white dark:bg-gray-800 rounded-3xl">Item not found!</div>;

  const effectEntry = item.effect_entries?.find((e) => e.language.name === "en");
  const flavorText = item.flavor_text_entries?.find((e) => e.language.name === "en");
  
  const description = effectEntry?.effect || flavorText?.text.replace(/\f/g, " ") || "No description available.";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden relative transition-colors duration-300">
      {/* HEADER TEMA AMBER (KUNING EMAS) */}
      <div className="bg-amber-500 dark:bg-amber-700 relative text-white h-[200px] flex items-center justify-center transition-colors duration-500 rounded-t-3xl">
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-20">
          <button onClick={onClose} className="bg-white/20 hover:bg-white/40 rounded-full p-2 backdrop-blur-sm transition cursor-pointer">
            <X size={24} />
          </button>
          <span className="text-xs font-bold opacity-90 uppercase px-3 py-1 bg-white/20 rounded-full tracking-wider shadow-sm flex items-center gap-1.5">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="Item" className="w-4 h-4 object-contain" /> 
            Item
          </span>
        </div>

        <div className="z-10 text-center pb-8 px-4">
          <h1 className="text-3xl md:text-4xl font-bold capitalize tracking-wide drop-shadow-md">{item.name.replace(/-/g, " ")}</h1>
          <p className="text-amber-100 dark:text-amber-200 font-medium mt-2 text-sm tracking-wide capitalize">
            {item.category?.name.replace(/-/g, " ")}
          </p>
        </div>

        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-20 bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg border-4 border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <img
            src={item.sprites?.default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${item.name}.png`}
            alt={item.name}
            className="w-16 h-16 object-contain drop-shadow-md hover:scale-110 transition-transform rendering-pixelated"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
            }}
          />
        </div>
      </div>

      <div className="pt-20 px-8 pb-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl text-center border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/amulet-coin.png" alt="Cost" className="w-8 h-8 mx-auto mb-1 object-contain" />
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Cost</p>
            <p className="text-xl font-black text-gray-800 dark:text-gray-100">
              {item.cost > 0 ? `₽ ${item.cost}` : "Not for Sale"}
            </p>
          </div>
          
          <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-2xl text-center border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/exp-share.png" alt="Category" className="w-8 h-8 mx-auto mb-1 object-contain" />
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Category</p>
            <p className="text-xl font-black text-gray-800 dark:text-gray-100 capitalize">
              {item.category?.name.replace(/-/g, " ")}
            </p>
          </div>
        </div>

        <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 transition-colors">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/zinc.png" alt="Effect" className="w-5 h-5 object-contain" /> 
          Detailed Effect
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed bg-amber-50/50 dark:bg-amber-900/20 p-5 rounded-xl border border-amber-100 dark:border-amber-900/30 mt-3 text-sm md:text-base transition-colors">
          {description}
        </p>

        {item.attributes && item.attributes.length > 0 && (
          <div className="mt-6">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 transition-colors">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/destiny-knot.png" alt="Attributes" className="w-5 h-5 object-contain" /> 
              Item Attributes
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {item.attributes.map((attr) => (
                <span key={attr.name} className="px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold capitalize border border-amber-100 dark:border-amber-500/20 transition-colors">
                  {attr.name.replace(/-/g, " ")}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetail;