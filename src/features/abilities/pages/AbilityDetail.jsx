import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAbilityDetail } from "../services/abilityService";
import { X } from "lucide-react";

/**
 * AbilityDetailSkeleton Component
 * Displays loading placeholder for ability detail view
 */
const AbilityDetailSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden min-h-[50vh] animate-pulse transition-colors duration-300">
    <div className="bg-gray-200 dark:bg-gray-700 p-6 h-[200px] relative"></div>
    <div className="pt-16 px-8 pb-8 space-y-6">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-8"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded w-full mt-6"></div>
    </div>
  </div>
);

/**
 * AbilityDetail Component
 * Displays detailed information about a specific Pokémon ability
 */
const AbilityDetail = ({ name, onClose }) => {
  const {
    data: ability,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["ability", name],
    queryFn: () => fetchAbilityDetail(name),
  });

  if (isLoading) return <AbilityDetailSkeleton />;
  if (isError || !ability)
    return (
      <div className="p-10 text-center text-red-500 font-bold bg-white dark:bg-gray-800 rounded-3xl">
        Ability not found!
      </div>
    );

  const effectEntry = ability.effect_entries?.find((e) => e.language.name === "en");
  const flavorText = ability.flavor_text_entries?.find((e) => e.language.name === "en");

  const description = effectEntry?.effect || flavorText?.flavor_text.replace(/\f/g, " ") || "No description available.";
  const shortEffect = effectEntry?.short_effect || "Passive Ability";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden relative transition-colors duration-300">
      {/* Header section with indigo theme */}
      <div className="bg-indigo-600 dark:bg-indigo-900 relative text-white min-h-[200px] flex items-center justify-center transition-colors duration-500 rounded-t-3xl">
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-20">
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/40 rounded-full p-2 backdrop-blur-sm transition cursor-pointer"
          >
            <X size={24} />
          </button>

          <span className="text-xs font-bold opacity-90 uppercase px-3 py-1 bg-white/20 rounded-full tracking-wider shadow-sm flex items-center gap-1.5">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ability-capsule.png"
              alt="capsule"
              className="w-4 h-4"
            />
            Ability
          </span>
        </div>

        <div className="z-10 text-center mt-6 px-4 pb-10">
          <h1 className="text-3xl md:text-4xl font-bold capitalize tracking-wide drop-shadow-md">
            {ability.name.replace(/-/g, " ")}
          </h1>
          <p className="text-indigo-200 dark:text-indigo-300 font-medium mt-2 text-sm md:text-base tracking-wide capitalize">
            {shortEffect}
          </p>
        </div>

        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-20 bg-white dark:bg-gray-800 rounded-full p-4 shadow-lg border-4 border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ability-capsule.png"
            alt="Ability Capsule"
            className="w-12 h-12 object-contain drop-shadow-md hover:scale-110 transition-transform"
          />
        </div>
      </div>

      {/* Body content section */}
      <div className="pt-20 px-8 pb-8">
        <h3 className="font-bold text-lg mb-3 flex items-center gap-2 text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 transition-colors">
          Detailed Effect
        </h3>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed bg-indigo-50/50 dark:bg-indigo-900/20 p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/30 mb-8 text-sm md:text-base transition-colors">
          {description}
        </p>

        {/* Information about Pokémon species with this ability */}
        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className="bg-red-50 dark:bg-red-500/10 p-3 rounded-full border border-red-100 dark:border-red-500/20 shadow-sm transition-colors">
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                alt="Poke Ball"
                className="w-8 h-8 object-contain drop-shadow-sm"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">
                Used By
              </p>
              <p className="text-lg font-black text-gray-800 dark:text-white transition-colors">
                {ability.pokemon?.length || 0}{" "}
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">Pokémon Species</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbilityDetail;
