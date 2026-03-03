import React, { useState, useMemo, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAllPokemon, fetchPokemonDetail } from "../services/pokemonService";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { X } from "lucide-react";

// Hex color values for type badges in chart
const TYPE_COLORS = {
  grass: "#22c55e",
  fire: "#ef4444",
  water: "#3b82f6",
  bug: "#65a30d",
  normal: "#9ca3af",
  poison: "#a855f7",
  electric: "#eab308",
  ground: "#d97706",
  fairy: "#f472b6",
  fighting: "#c2410c",
  psychic: "#db2777",
  rock: "#57534e",
  ghost: "#3730a3",
  ice: "#67e8f9",
  dragon: "#4f46e5",
  dark: "#1f2937",
  steel: "#6b7280",
  flying: "#38bdf8",
};

// Tailwind classes for type backgrounds
const TYPE_BG_CLASSES = {
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

const STAT_NAMES = ["HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"];

/**
 * CustomTooltip Component
 * Displays stats information in radar chart tooltip
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl">
        <p className="font-black text-gray-800 dark:text-white mb-2">{label}</p>
        {payload.map((entry) => (
          <p
            key={entry.name}
            className="text-sm font-bold flex justify-between gap-4 capitalize"
            style={{ color: entry.color }}
          >
            <span>{entry.name.replace("-", " ")}:</span>
            <span>{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * PokemonSearchBox Component
 * Searchable dropdown for selecting a Pokémon to compare
 */
const PokemonSearchBox = ({ label, onSelect, allPokemon }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    if (!searchTerm || !allPokemon) return [];
    return allPokemon
      .filter((p) => {
        const id = parseInt(p.url.split("/").filter(Boolean).pop());
        if (id >= 10000) return false;
        return p.name.includes(searchTerm.toLowerCase());
      })
      .slice(0, 10);
  }, [searchTerm, allPokemon]);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-inner border-2 border-gray-100 dark:border-gray-700 flex items-center gap-2">
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-radar.png"
          alt="Search"
          className="w-6 h-6 object-contain ml-2 animate-pulse"
        />
        <input
          type="text"
          placeholder={`Search ${label}...`}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-transparent outline-none font-bold text-gray-700 dark:text-gray-200 placeholder-gray-400"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="mr-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {isOpen && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          {filtered.map((p) => {
            const id = p.url.split("/").filter(Boolean).pop();
            return (
              <button
                key={p.name}
                onClick={() => {
                  onSelect(p.name);
                  setSearchTerm("");
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors text-left border-b border-gray-50 dark:border-gray-700/50 last:border-0 group cursor-pointer"
              >
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                  alt={p.name}
                  className="w-10 h-10 object-contain group-hover:scale-110 transition-transform rendering-pixelated"
                />
                <span className="font-bold capitalize text-gray-700 dark:text-gray-200">
                  {p.name.replace("-", " ")}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ComparePokemon = () => {
  const [pokemon1Name, setPokemon1Name] = useState(null);
  const [pokemon2Name, setPokemon2Name] = useState(null);

  const { data: allPokemon } = useQuery({ queryKey: ["allPokemon"], queryFn: fetchAllPokemon, staleTime: Infinity });

  const { data: p1 } = useQuery({
    queryKey: ["pokemon", pokemon1Name],
    queryFn: () => fetchPokemonDetail(pokemon1Name),
    enabled: !!pokemon1Name,
  });
  const { data: p2 } = useQuery({
    queryKey: ["pokemon", pokemon2Name],
    queryFn: () => fetchPokemonDetail(pokemon2Name),
    enabled: !!pokemon2Name,
  });

  // PENTING: Cari tahu Pokemon mana yang jadi patokan kalau salah satu di close
  const basePokemon = p1 || p2;

  // Best Practice Logika Warna Tipe
  const { c1, c2 } = useMemo(() => {
    let color1 = p1 ? TYPE_COLORS[p1.types[0].type.name] : "#9ca3af";
    let color2 = p2 ? TYPE_COLORS[p2.types[0].type.name] : "#9ca3af";

    // Kalau warnanya sama persis (misal sama-sama Fire)
    if (p1 && p2 && color1 === color2) {
      if (p2.types[1] && TYPE_COLORS[p2.types[1].type.name] !== color1) {
        color2 = TYPE_COLORS[p2.types[1].type.name]; // Pakai tipe ke-2 P2
      } else if (p1.types[1] && TYPE_COLORS[p1.types[1].type.name] !== color2) {
        color1 = TYPE_COLORS[p1.types[1].type.name]; // Pakai tipe ke-2 P1
      } else {
        color2 = "#94a3b8"; // Kalau murni sama, kasih warna Slate/Netral buat P2 biar keliatan bedanya
      }
    }
    return { c1: color1, c2: color2 };
  }, [p1, p2]);

  // Format data for Recharts Radar (Handle if one is missing)
  const radarData = useMemo(() => {
    if (!basePokemon) return [];
    return basePokemon.stats.map((s, index) => {
      const dataPoint = { stat: STAT_NAMES[index], fullMark: 255 };
      if (p1) dataPoint[p1.name] = p1.stats[index].base_stat;
      if (p2) dataPoint[p2.name] = p2.stats[index].base_stat;
      return dataPoint;
    });
  }, [p1, p2, basePokemon]);

  // Render Kartu Pokemon
  const renderCard = (pData, onRemove) => {
    if (!pData) return null;
    const primaryType = pData.types[0].type.name;
    const typeColorClass = TYPE_BG_CLASSES[primaryType] || "bg-gray-500";
    const imgUrl = pData.sprites.other["official-artwork"].front_default || pData.sprites.front_default;

    return (
      <div className="relative flex flex-col items-center bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-xl border-4 border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-500 w-full max-w-sm overflow-hidden group">
        <div
          className={`absolute top-0 left-0 w-full h-32 ${typeColorClass} opacity-20 dark:opacity-40 transition-colors`}
        ></div>
        <button
          onClick={onRemove}
          className="absolute top-4 right-4 z-10 bg-white/50 hover:bg-red-500 hover:text-white rounded-full p-1.5 backdrop-blur-sm transition-colors text-gray-500 cursor-pointer"
        >
          <X size={16} />
        </button>
        <img
          src={imgUrl}
          alt={pData.name}
          className="w-40 h-40 object-contain z-10 drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
        />
        <h2 className="text-2xl font-black capitalize text-gray-800 dark:text-white mt-4 z-10">
          {pData.name.replace("-", " ")}
        </h2>
        <div className="flex gap-2 mt-2 z-10">
          {pData.types.map((t) => {
            const badgeColor = TYPE_BG_CLASSES[t.type.name] || "bg-gray-500";
            return (
              <span
                key={t.type.name}
                className={`px-3 py-1 ${badgeColor} text-white rounded-full text-xs font-bold capitalize shadow-sm flex items-center gap-1.5`}
              >
                <img
                  src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${t.type.name}.svg`}
                  alt={t.type.name}
                  className="w-3.5 h-3.5 object-contain drop-shadow-sm"
                />
                {t.type.name}
              </span>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Slot Kosong (Dengan Tema Bola)
  const renderEmptySlot = (label, onSelect, isRedCorner) => {
    const ballImg = isRedCorner
      ? "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cherish-ball.png"
      : "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/dive-ball.png";

    return (
      <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-8 bg-gray-50/50 dark:bg-gray-800/20 rounded-[2rem] border-2 border-dashed border-gray-300 dark:border-gray-700 relative">
        <img src={ballImg} alt="Empty Slot" className="w-20 h-20 opacity-30 grayscale drop-shadow-sm mb-6" />
        <PokemonSearchBox label={label} onSelect={onSelect} allPokemon={allPokemon} />
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4 mt-6">
      {/* HEADER ARENA */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <img
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png"
          alt="VS"
          className="w-10 h-10 object-contain drop-shadow-md animate-bounce"
        />
        <h1 className="text-3xl md:text-4xl font-black text-gray-800 dark:text-white uppercase tracking-tight italic">
          Versus <span className="text-red-500">Arena</span>
        </h1>
      </div>

      {/* SELECTOR & CARDS AREA */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-8 lg:gap-12 mb-12">
        <div className="w-full flex-1 flex flex-col items-center gap-4">
          {!p1 ? renderEmptySlot("Red Corner", setPokemon1Name, true) : renderCard(p1, () => setPokemon1Name(null))}
        </div>

        <div className="shrink-0 flex flex-col items-center z-10">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-red-500/30 border-4 border-white dark:border-gray-900 transform -rotate-12">
            VS
          </div>
        </div>

        <div className="w-full flex-1 flex flex-col items-center gap-4">
          {!p2 ? renderEmptySlot("Blue Corner", setPokemon2Name, false) : renderCard(p2, () => setPokemon2Name(null))}
        </div>
      </div>

      {/* STAGE: RADAR CHART & STATS (Ditampilkan selama minimal ada 1 Pokemon) */}
      {basePokemon && (
        <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-6 md:p-10 shadow-2xl border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-700 flex flex-col lg:flex-row items-center gap-10">
          <div className="w-full lg:w-1/2 h-[350px] md:h-[450px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid strokeOpacity={0.3} className="stroke-gray-400 dark:stroke-gray-500" />
                <PolarAngleAxis dataKey="stat" tick={{ fill: "#888888", fontWeight: "bold", fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 200]} tick={false} axisLine={false} />
                <Tooltip content={CustomTooltip} />
                <Legend wrapperStyle={{ paddingTop: "20px", fontWeight: "bold", textTransform: "capitalize" }} />

                {p1 && (
                  <Radar
                    name={p1.name.replace("-", " ")}
                    dataKey={p1.name}
                    stroke={c1}
                    fill={c1}
                    fillOpacity={0.4}
                    strokeWidth={3}
                  />
                )}
                {p2 && (
                  <Radar
                    name={p2.name.replace("-", " ")}
                    dataKey={p2.name}
                    stroke={c2}
                    fill={c2}
                    fillOpacity={0.4}
                    strokeWidth={3}
                  />
                )}
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col gap-3">
            <h3 className="text-xl font-black text-center text-gray-800 dark:text-white mb-4 flex items-center justify-center gap-2">
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/data-card-01.png"
                alt="Data"
                className="w-6 h-6 object-contain"
              />
              Stat Breakdown
            </h3>

            {basePokemon.stats.map((stat, idx) => {
              const val1 = p1 ? p1.stats[idx].base_stat : "-";
              const val2 = p2 ? p2.stats[idx].base_stat : "-";
              const statName = STAT_NAMES[idx];

              const p1Wins = p1 && p2 && val1 > val2;
              const p2Wins = p1 && p2 && val2 > val1;

              return (
                <div
                  key={statName}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-3 md:p-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-default"
                >
                  <div
                    className={`w-16 text-center font-black text-lg md:text-xl transition-all ${p1Wins ? "drop-shadow-sm scale-110" : p2Wins ? "text-gray-400 dark:text-gray-500 text-base" : "text-yellow-500"}`}
                    style={p1Wins ? { color: c1 } : {}}
                  >
                    {val1}
                  </div>
                  <div className="flex-1 text-center font-bold text-xs md:text-sm tracking-widest text-gray-500 dark:text-gray-400 uppercase">
                    {statName}
                  </div>
                  <div
                    className={`w-16 text-center font-black text-lg md:text-xl transition-all ${p2Wins ? "drop-shadow-sm scale-110" : p1Wins ? "text-gray-400 dark:text-gray-500 text-base" : "text-yellow-500"}`}
                    style={p2Wins ? { color: c2 } : {}}
                  >
                    {val2}
                  </div>
                </div>
              );
            })}

            <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-900 p-4 rounded-2xl text-white mt-2 shadow-inner border border-gray-700">
              <div
                className="w-16 text-center font-black text-xl transition-colors"
                style={
                  p1 &&
                  p2 &&
                  p1.stats.reduce((a, b) => a + b.base_stat, 0) > p2.stats.reduce((a, b) => a + b.base_stat, 0)
                    ? { color: c1 }
                    : {}
                }
              >
                {p1 ? p1.stats.reduce((acc, curr) => acc + curr.base_stat, 0) : "-"}
              </div>
              <div className="flex-1 text-center font-black text-xs md:text-sm tracking-widest text-gray-400 uppercase">
                TOTAL
              </div>
              <div
                className="w-16 text-center font-black text-xl transition-colors"
                style={
                  p1 &&
                  p2 &&
                  p2.stats.reduce((a, b) => a + b.base_stat, 0) > p1.stats.reduce((a, b) => a + b.base_stat, 0)
                    ? { color: c2 }
                    : {}
                }
              >
                {p2 ? p2.stats.reduce((acc, curr) => acc + curr.base_stat, 0) : "-"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparePokemon;
