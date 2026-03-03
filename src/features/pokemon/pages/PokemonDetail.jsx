import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchPokemonDetail,
  fetchEvolutionChain,
  fetchPokemonEncounters,
  fetchTypeDetails,
} from "../services/pokemonService";
import { X, ArrowDown } from "lucide-react";

// Type color palette for type badges
const TYPE_COLORS = {
  grass: "bg-green-500",
  fire: "bg-red-500",
  water: "bg-blue-500",
  bug: "bg-lime-600",
  normal: "bg-gray-400",
  poison: "bg-purple-500",
  electric: "bg-yellow-400",
  ground: "bg-amber-600",
  fairy: "bg-pink-400",
  fighting: "bg-orange-700",
  psychic: "bg-pink-600",
  rock: "bg-stone-600",
  ghost: "bg-indigo-800",
  ice: "bg-cyan-300",
  dragon: "bg-indigo-600",
  dark: "bg-gray-800",
  steel: "bg-gray-500",
  flying: "bg-sky-400",
};

const ALL_TYPES = Object.keys(TYPE_COLORS);

/**
 * Calculates type weaknesses and their multipliers
 * Returns array of types that deal super-effective damage
 */
const calculateWeaknesses = (typeDetails) => {
  if (!typeDetails) return [];
  const damageRelations = {};

  ALL_TYPES.forEach((t) => (damageRelations[t] = 1));

  typeDetails.forEach((typeData) => {
    const relations = typeData.damage_relations;
    relations.double_damage_from.forEach((t) => (damageRelations[t.name] *= 2));
    relations.half_damage_from.forEach((t) => (damageRelations[t.name] *= 0.5));
    relations.no_damage_from.forEach((t) => (damageRelations[t.name] *= 0));
  });

  return Object.entries(damageRelations)
    .filter((entry) => entry[1] > 1)
    .map(([type, multiplier]) => ({ type, multiplier }))
    .sort((a, b) => b.multiplier - a.multiplier);
};

/**
 * PokemonDetailSkeleton Component
 * Displays loading placeholder for Pokémon detail view
 */
const PokemonDetailSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden min-h-[70vh] animate-pulse transition-colors duration-300">
    <div className="bg-gray-200 dark:bg-gray-700 p-6 h-[250px] relative"></div>
    <div className="pt-20 px-8 pb-8 space-y-6">
      <div className="flex justify-center gap-4 mb-8">
        <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
        <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded w-full mt-6"></div>
    </div>
  </div>
);

/**
 * EvolutionTree Component
 * Displays the evolution chain in a visual tree format
 */
const EvolutionTree = ({ chain, currentPokemonName, onEvolutionClick }) => {
  if (!chain) return null;

  const hasEvolutions = chain.evolves_to && chain.evolves_to.length > 0;

  const id = chain.species.url.split("/").filter(Boolean).pop();
  const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const isCurrent = chain.species.name === currentPokemonName;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex flex-col items-center group transition-all ${!isCurrent ? "cursor-pointer hover:-translate-y-1" : ""}`}
        onClick={() => {
          if (!isCurrent && onEvolutionClick) onEvolutionClick(chain.species.name);
        }}
      >
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center p-3 mb-2 transition-all 
          ${
            isCurrent
              ? "bg-red-50 dark:bg-red-500/20 ring-4 ring-red-400 dark:ring-red-500 shadow-lg"
              : "bg-gray-50 dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 group-hover:border-blue-400 group-hover:shadow-md"
          }`}
        >
          <img
            src={imgUrl}
            alt={chain.species.name}
            className="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
          />
        </div>
        <span
          className={`text-sm capitalize font-bold ${isCurrent ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"}`}
        >
          {chain.species.name.replace("-", " ")}
        </span>
      </div>

      {hasEvolutions && (
        <>
          <div className="my-3 text-gray-300 dark:text-gray-600 animate-bounce">
            <ArrowDown size={24} />
          </div>
          <div className="flex flex-row flex-wrap justify-center gap-x-6 gap-y-8 w-full">
            {chain.evolves_to.map((evo) => (
              <EvolutionTree
                key={evo.species.name}
                chain={evo}
                currentPokemonName={currentPokemonName}
                onEvolutionClick={onEvolutionClick}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * PokemonDetail Component
 * Displays comprehensive Pokémon information including stats, evolutions, and encounters
 */
const PokemonDetail = ({ name, onClose, onEvolutionClick }) => {
  const [isShiny, setIsShiny] = useState(false);
  const [showEncounters, setShowEncounters] = useState(false);
  const [activeTab, setActiveTab] = useState("about");

  const {
    data: pokemon,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pokemon", name],
    queryFn: () => fetchPokemonDetail(name),
    retry: 1,
  });

  const { data: evolutionChain } = useQuery({
    queryKey: ["evolution", name],
    queryFn: () => fetchEvolutionChain(name),
    enabled: !!pokemon,
  });

  const { data: encounters, isLoading: isEncountersLoading } = useQuery({
    queryKey: ["encounters", pokemon?.id],
    queryFn: () => fetchPokemonEncounters(pokemon?.id),
    enabled: showEncounters && !!pokemon?.id,
  });

  const typeUrls = pokemon?.types.map((t) => t.type.url) || [];
  const { data: typeDetails } = useQuery({
    queryKey: ["pokemonTypes", name],
    queryFn: () => fetchTypeDetails(typeUrls),
    enabled: !!pokemon,
  });

  const weaknesses = useMemo(() => calculateWeaknesses(typeDetails), [typeDetails]);

  const playCry = () => {
    if (pokemon?.cries?.latest) {
      const audio = new Audio(pokemon.cries.latest);
      audio.volume = 0.5;
      audio.play().catch((e) => console.error("Audio failed:", e));
    }
  };

  if (isLoading) return <PokemonDetailSkeleton />;
  if (isError || !pokemon)
    return (
      <div className="p-10 text-center text-red-500 font-bold bg-white dark:bg-gray-800 rounded-3xl">
        Pokemon not found!
      </div>
    );

  const defaultImage = pokemon.sprites.other["official-artwork"].front_default;
  const displayImage = isShiny ? pokemon.sprites.other["official-artwork"].front_shiny || defaultImage : defaultImage;
  const bgColor = TYPE_COLORS[pokemon.types[0].type.name] || "bg-gray-500";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden relative min-h-[85vh] md:min-h-[75vh] flex flex-col transition-colors duration-300">
      {showEncounters && (
        <div className="absolute inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 rounded-3xl">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85%] relative animate-in zoom-in duration-200 transition-colors">
            {/* Encounter modal header */}
            <div className="bg-blue-500 text-white p-4 flex justify-between items-center shrink-0">
              <h4 className="font-bold flex items-center gap-2">
                <img
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png"
                  alt="Map"
                  className="w-6 h-6 object-contain"
                />
                Encounter Locations
              </h4>
              <button
                onClick={() => setShowEncounters(false)}
                className="hover:bg-white/20 p-1 rounded-full transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 flex-1 scrollbar-hide">
              {isEncountersLoading ? (
                <div className="text-center text-gray-500 py-6 animate-pulse">Scanning map data...</div>
              ) : encounters?.length > 0 ? (
                <div className="space-y-4">
                  {encounters.map((enc, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col gap-3"
                    >
                      <h5 className="font-bold text-gray-800 dark:text-gray-100 capitalize flex items-start gap-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                        <img
                          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/nest-ball.png"
                          alt="Location"
                          className="w-5 h-5 shrink-0 mt-0.5 object-contain"
                        />
                        {enc.location_area.name.replace(/-/g, " ")}
                      </h5>
                      <div className="space-y-2">
                        {enc.version_details.map((vd, vIdx) => (
                          <div
                            key={vIdx}
                            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5 text-xs flex flex-col sm:flex-row gap-2 justify-between border border-gray-100 dark:border-gray-600"
                          >
                            <div className="flex items-center gap-1.5">
                              <img
                                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png"
                                alt="Version"
                                className="w-4 h-4 object-contain"
                              />
                              <span className="font-bold text-blue-600 dark:text-blue-400 capitalize bg-blue-100 dark:bg-blue-500/10 px-2 py-0.5 rounded-md">
                                {vd.version.name.replace(/-/g, " ")}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 font-medium">
                              <span className="capitalize flex items-center gap-1">
                                <img
                                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/safari-ball.png"
                                  alt="Method"
                                  className="w-4 h-4 object-contain"
                                />
                                {vd.encounter_details[0]?.method.name.replace(/-/g, " ")}
                              </span>
                              <span className="font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-2 py-0.5 rounded-md">
                                {vd.max_chance}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <img
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png"
                    alt="Map"
                    className="w-16 h-16 mx-auto opacity-50 mb-3 grayscale"
                  />
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    This Pokémon cannot be caught in the wild.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main header section - displays type-based background */}
      <div
        className={`${bgColor} p-6 pb-0 relative text-white h-[280px] md:h-[260px] flex flex-col transition-colors duration-500 shrink-0`}
      >
        <div className="flex justify-between items-start z-10">
          <button
            onClick={onClose}
            className="bg-black/20 hover:bg-black/40 rounded-full p-2 backdrop-blur-sm transition cursor-pointer"
          >
            <X size={24} />
          </button>
          <span className="text-2xl font-bold opacity-80">#{String(pokemon.id).padStart(3, "0")}</span>
        </div>

        {/* Title and name section */}
        <div className="mt-0 md:mt-2 z-10 flex items-center gap-3 w-full max-w-[65%] sm:max-w-[75%]">
          <h1 className="text-3xl md:text-4xl font-extrabold capitalize tracking-tight drop-shadow-md truncate pb-1 leading-normal">
            {pokemon.name.replace("-", " ")}
          </h1>
        </div>

        <div className="flex gap-2 mt-2 md:mt-3 z-10">
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              className="px-2.5 py-1 bg-white/30 rounded-full text-xs font-bold capitalize backdrop-blur-sm shadow-sm border border-white/20 flex items-center gap-1.5"
            >
              <img
                src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t.type.name}.svg`}
                alt={t.type.name}
                className="w-3.5 h-3.5 object-contain"
              />
              {t.type.name}
            </span>
          ))}
        </div>

        {/* Image display - shows normal or shiny form */}
        <div className="absolute -bottom-6 md:-bottom-12 left-1/2 -translate-x-1/2 z-20 flex justify-center">
          <img
            key={displayImage}
            src={displayImage}
            alt={pokemon.name}
            className="w-44 h-44 sm:w-48 sm:h-48 md:w-56 md:h-56 object-contain drop-shadow-2xl animate-in fade-in zoom-in duration-300"
          />
        </div>

        {/* Action buttons - positioned at bottom */}
        <button
          onClick={() => setShowEncounters(true)}
          title="Where to Catch"
          className="absolute -bottom-5 left-4 sm:left-6 md:left-8 z-30 flex items-center justify-center gap-2 p-3 sm:px-4 sm:py-2 rounded-full font-bold text-sm shadow-xl transition-all hover:-translate-y-1 active:scale-95 border-4 border-white dark:border-gray-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-800 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-700"
        >
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png"
            alt="Map"
            className="w-5 h-5 object-contain"
          />
          <span className="hidden sm:inline">Map</span>
        </button>

        <button
          onClick={() => setIsShiny(!isShiny)}
          title="Toggle Shiny Form"
          className={`absolute -bottom-5 right-4 sm:right-6 md:right-8 z-30 flex items-center justify-center gap-2 p-3 sm:px-4 sm:py-2 rounded-full font-bold text-sm shadow-xl transition-all hover:-translate-y-1 active:scale-95 border-4 border-white dark:border-gray-800 ${isShiny ? "bg-yellow-400/80 backdrop-blur-md text-yellow-900 hover:bg-yellow-400" : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-md text-gray-800 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-700"}`}
        >
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/shiny-charm.png"
            alt="Shiny Charm"
            className="w-5 h-5 object-contain"
          />
          <span className="hidden sm:inline">{isShiny ? "Shiny" : "Normal"}</span>
        </button>
      </div>

      {/* Tabbed content navigation */}
      <div className="pt-16 px-6 border-b border-gray-100 dark:border-gray-700 flex justify-between md:justify-center md:gap-8 bg-white dark:bg-gray-800 shrink-0 z-10 relative transition-colors">
        <button
          onClick={() => setActiveTab("about")}
          className={`pb-3 font-bold text-sm transition-colors flex items-center gap-2 border-b-2 ${activeTab === "about" ? "text-gray-800 dark:text-white border-gray-800 dark:border-white" : "text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300"}`}
        >
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            alt="About"
            className={`w-4 h-4 object-contain ${activeTab !== "about" && "grayscale opacity-50"}`}
          />{" "}
          About
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`pb-3 font-bold text-sm transition-colors flex items-center gap-2 border-b-2 ${activeTab === "stats" ? "text-gray-800 dark:text-white border-gray-800 dark:border-white" : "text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300"}`}
        >
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/protein.png"
            alt="Stats"
            className={`w-4 h-4 object-contain ${activeTab !== "stats" && "grayscale opacity-50"}`}
          />{" "}
          Stats
        </button>
        <button
          onClick={() => setActiveTab("evolutions")}
          className={`pb-3 font-bold text-sm transition-colors flex items-center gap-2 border-b-2 ${activeTab === "evolutions" ? "text-gray-800 dark:text-white border-gray-800 dark:border-white" : "text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300"}`}
        >
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png"
            alt="Evo"
            className={`w-4 h-4 object-contain ${activeTab !== "evolutions" && "grayscale opacity-50"}`}
          />{" "}
          Evolutions
        </button>
      </div>

      {/* Tabbed content area */}
      <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-gray-800 scrollbar-hide transition-colors">
        {activeTab === "about" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto leading-relaxed bg-gray-50 dark:bg-gray-700/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-600 transition-colors">
              {pokemon.species?.flavor_text_entries
                ?.find((e) => e.language.name === "en")
                ?.flavor_text.replace(/\f/g, " ") || "No description available."}
            </p>
            <div className="flex justify-center gap-6">
              <div className="text-center bg-gray-50 dark:bg-gray-700/50 px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-600 w-full shadow-sm">
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                  Weight
                </p>
                <p className="text-xl font-black text-gray-800 dark:text-white">
                  {pokemon.weight / 10} <span className="text-sm font-medium text-gray-500 dark:text-gray-400">kg</span>
                </p>
              </div>
              <div className="text-center bg-gray-50 dark:bg-gray-700/50 px-6 py-4 rounded-2xl border border-gray-100 dark:border-gray-600 w-full shadow-sm">
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                  Height
                </p>
                <p className="text-xl font-black text-gray-800 dark:text-white">
                  {pokemon.height / 10} <span className="text-sm font-medium text-gray-500 dark:text-gray-400">m</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 transition-colors">
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/protein.png"
                alt="Stats"
                className="w-5 h-5 object-contain"
              />
              Base Stats
            </h3>
            <div className="space-y-3 mb-8">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="flex items-center text-sm group">
                  <span className="w-24 font-medium text-gray-500 dark:text-gray-400 capitalize transition-colors">
                    {stat.stat.name.replace("-", " ")}
                  </span>
                  <span className="w-10 font-bold text-right mr-4 text-gray-700 dark:text-gray-200 transition-colors">
                    {stat.base_stat}
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden transition-colors">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-1000 ${stat.base_stat >= 100 ? "bg-green-500" : stat.base_stat >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                      style={{ width: `${Math.min((stat.base_stat / 255) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 transition-colors">
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/iron.png"
                alt="Weakness"
                className="w-5 h-5 object-contain"
              />
              Weaknesses
            </h3>
            {weaknesses.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {weaknesses.map((w) => (
                  <div
                    key={w.type}
                    className={`flex items-center gap-2.5 pr-4 pl-1.5 py-1.5 rounded-xl shadow-sm ${TYPE_COLORS[w.type] || "bg-gray-500"} text-white border border-black/10 dark:border-white/10 hover:scale-105 cursor-default`}
                  >
                    <div className="w-6 h-6 bg-white/20 rounded-full p-1 flex items-center justify-center backdrop-blur-sm shadow-inner shrink-0">
                      <img
                        src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${w.type}.svg`}
                        alt={w.type}
                        className="w-full h-full object-contain drop-shadow-md"
                        title={`${w.type} type`}
                      />
                    </div>
                    <span className="text-sm font-bold capitalize tracking-wide drop-shadow-sm">{w.type}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">Loading matchup data...</p>
            )}
          </div>
        )}

        {activeTab === "evolutions" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="font-bold text-lg mb-6 flex items-center justify-center gap-2 text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 transition-colors">
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png"
                alt="Evo"
                className="w-5 h-5 object-contain"
              />
              Evolution Tree
            </h3>

            <div className="w-full overflow-x-auto pb-4 pt-6 px-4 scrollbar-hide flex justify-center">
              {evolutionChain ? (
                <EvolutionTree
                  chain={evolutionChain}
                  currentPokemonName={pokemon.name}
                  onEvolutionClick={onEvolutionClick}
                />
              ) : (
                <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-4">
                  This Pokémon does not evolve.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 rounded-b-3xl shrink-0 flex justify-center z-20 transition-colors">
        <button
          onClick={playCry}
          className="flex items-center gap-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:text-white px-8 py-3 rounded-2xl font-black tracking-wide transition-all border border-red-100 dark:border-red-500/20 shadow-sm active:scale-95 group"
        >
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-flute.png"
            alt="Play"
            className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert transition-all"
          />
          Pokemon Cry
        </button>
      </div>
    </div>
  );
};

export default PokemonDetail;
