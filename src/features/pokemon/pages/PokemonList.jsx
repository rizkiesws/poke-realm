import React, { useState, useEffect, useRef } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetchPokemonList, fetchTypes, fetchPokemonByType, fetchAllPokemon } from "../services/pokemonService";
import { Loader2, Search, ArrowUp, X, ChevronDown } from "lucide-react";
import SkeletonCard from "../../../components/UI/SkeletonCard";
import PokemonDetail from "./PokemonDetail";

const PokemonList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedType = searchParams.get("type") || null;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPokemonModal, setSelectedPokemonModal] = useState(null);

  const topRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [selectedGen, setSelectedGen] = useState(null); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const generations = [
    { label: "All Gen", value: null, range: [1, 9999] },
    { label: "Gen 1 (Kanto)", value: 1, range: [1, 151] },
    { label: "Gen 2 (Johto)", value: 2, range: [152, 251] },
    { label: "Gen 3 (Hoenn)", value: 3, range: [252, 386] },
    { label: "Gen 4 (Sinnoh)", value: 4, range: [387, 493] },
    { label: "Gen 5 (Unova)", value: 5, range: [494, 649] },
    { label: "Gen 6 (Kalos)", value: 6, range: [650, 721] },
    { label: "Gen 7 (Alola)", value: 7, range: [722, 809] },
    { label: "Gen 8 (Galar)", value: 8, range: [810, 905] },
    { label: "Gen 9 (Paldea)", value: 9, range: [906, 1025] },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Intersection Observer for scroll-to-top button
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setShowScrollTop(!entry.isIntersecting), {
      rootMargin: "-300px 0px 0px 0px",
    });
    if (topRef.current) observer.observe(topRef.current);
    return () => {
      if (topRef.current) observer.unobserve(topRef.current);
    };
  }, []);

  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });

  const handleTypeSelect = (type) => {
    setSearchTerm("");
    if (type === null) {
      searchParams.delete("type");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ type });
    }
  };

  const { data: types } = useQuery({ queryKey: ["types"], queryFn: fetchTypes });

  const infiniteQuery = useInfiniteQuery({
    queryKey: ["pokemonList"],
    queryFn: ({ pageParam = 0 }) => fetchPokemonList(20, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => (lastPage.next ? allPages.length * 20 : undefined),
    enabled: !selectedType && selectedGen === null,
  });

  const filterQuery = useQuery({
    queryKey: ["pokemonByType", selectedType],
    queryFn: () => fetchPokemonByType(selectedType),
    enabled: !!selectedType,
  });

  const { data: allPokemon } = useQuery({
    queryKey: ["allPokemonList"],
    queryFn: fetchAllPokemon,
    staleTime: Infinity,
  });

  const validTypes = types?.filter((t) => t.name !== "unknown" && t.name !== "stellar");
  const isSearching = searchTerm.trim().length > 0;

  const getPokemonId = (url) => url.split("/")[url.split("/").length - 2];
  let rawPokemonData = [];

  if (isSearching) {
    rawPokemonData =
      allPokemon?.filter((p) => {
        const id = getPokemonId(p.url);
        const matchName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchId = id.includes(searchTerm);
        return matchName || matchId;
      }) || [];
  } else if (selectedType) {
    rawPokemonData = filterQuery.data || [];
  } else if (selectedGen !== null) {
    rawPokemonData = allPokemon || []; 
  } else {
    rawPokemonData = infiniteQuery.data?.pages.flatMap((page) => page.results) || [];
  }

  const validPokemonList = rawPokemonData.filter((pokemon) => {
    const id = parseInt(getPokemonId(pokemon.url));
    if (id >= 10000) return false;

    if (selectedGen !== null && !isSearching) {
      const genInfo = generations.find((g) => g.value === selectedGen);
      if (genInfo && (id < genInfo.range[0] || id > genInfo.range[1])) {
        return false;
      }
    }
    return true;
  });

  const isLoading = selectedType
    ? filterQuery.isLoading
    : selectedGen !== null
      ? !allPokemon
      : infiniteQuery.status === "pending";
  const isError = selectedType ? filterQuery.isError : infiniteQuery.status === "error";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && validPokemonList.length > 0) {
      setSelectedPokemonModal(validPokemonList[0].name);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 relative">
      <div ref={topRef} className="absolute top-0" />

      {selectedPokemonModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all"
          onClick={() => setSelectedPokemonModal(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <PokemonDetail
              key={selectedPokemonModal}
              name={selectedPokemonModal}
              onClose={() => setSelectedPokemonModal(null)}
              onEvolutionClick={setSelectedPokemonModal}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4 mt-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors">Pokédex</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 transition-colors">Explore the complete list of Pokémon.</p>
        </div>
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search Pokémon name or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (selectedType && e.target.value.length > 0) handleTypeSelect(null);
            }}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors shadow-sm"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 w-5 h-5 transition-colors" />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </form>
      </div>

      <div className="my-2 relative z-30 flex items-center gap-2 md:gap-3">
        {/* Dropdown Gen Container - Z-Index changed to 40 */}
        <div className="relative shrink-0 z-40" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`px-4 md:px-5 py-2.5 rounded-full font-bold text-sm shadow-md flex items-center gap-2 transition-all active:scale-95 ${
              selectedGen !== null
                ? "bg-gradient-to-r from-red-500 to-rose-500 text-white ring-2 ring-red-300 dark:ring-red-900 ring-offset-2 dark:ring-offset-gray-900 shadow-red-500/30"
                : "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
            }`}
          >
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
              alt="Pokeball"
              className="w-4 h-4 object-contain"
            />
            <span className="whitespace-nowrap">
              {generations.find((g) => g.value === selectedGen)?.label.replace(/ \(.+\)/, "") || "All Gen"}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-3 w-48 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {generations.map((gen) => (
                <button
                  key={gen.label}
                  onClick={() => {
                    setSelectedGen(gen.value);
                    setIsDropdownOpen(false);
                    setSearchTerm("");
                  }}
                  className={`w-full text-left px-5 py-3 text-sm font-bold transition-colors ${
                    selectedGen === gen.value
                      ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-l-4 border-red-500"
                      : "text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 border-l-4 border-transparent"
                  }`}
                >
                  {gen.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 shrink-0 hidden md:block transition-colors"></div>

        <div className="flex-1 flex gap-3 overflow-x-auto scrollbar-hide py-4 px-1 snap-x items-center">
          <button
            onClick={() => handleTypeSelect(null)}
            className={`snap-start shrink-0 px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
              selectedType === null && !isSearching
                ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 shadow-inner"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            All Types
          </button>

          {validTypes?.map((t) => (
            <button
              key={t.name}
              onClick={() => handleTypeSelect(t.name)}
              className={`snap-start shrink-0 px-6 py-2.5 rounded-full font-bold text-sm capitalize transition-all ${
                selectedType === t.name
                  ? "bg-gray-800 dark:bg-white text-white dark:text-gray-900 shadow-lg scale-105"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-800 dark:hover:text-white hover:shadow-sm"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}
      
      {isError && <div className="text-center p-10 text-red-500">Failed to load data.</div>}
      
      {isSearching && validPokemonList.length === 0 && (
        <div className="text-center p-10 text-gray-400 dark:text-gray-500 font-medium transition-colors">No Pokémon found matching "{searchTerm}"</div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {validPokemonList.map((pokemon) => {
            const id = getPokemonId(pokemon.url);
            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

            return (
              <div
                key={pokemon.name}
                onClick={() => setSelectedPokemonModal(pokemon.name)}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-xl dark:hover:shadow-lg dark:hover:shadow-red-500/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 group flex flex-col items-center"
              >
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4 flex justify-center relative w-full transition-colors">
                  <span className="absolute top-2 left-3 text-xs font-bold text-gray-400 dark:text-gray-500">#{id.padStart(3, "0")}</span>
                  <img
                    src={imageUrl}
                    alt={pokemon.name}
                    className="w-32 h-32 object-contain group-hover:scale-110 transition-transform drop-shadow-sm"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-center font-bold text-gray-700 dark:text-gray-100 capitalize text-lg transition-colors">
                  {pokemon.name.replace("-", " ")}
                </h3>
              </div>
            );
          })}
        </div>
      )}

      {!selectedType && selectedGen === null && !isSearching && infiniteQuery.status === "success" && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => infiniteQuery.fetchNextPage()}
            disabled={!infiniteQuery.hasNextPage || infiniteQuery.isFetchingNextPage}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
          >
            {infiniteQuery.isFetchingNextPage ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" /> Loading...
              </>
            ) : infiniteQuery.hasNextPage ? (
              "Load More Pokémon"
            ) : (
              "End of List"
            )}
          </button>
        </div>
      )}

      {/* Floating Action Button - Z-Index changed to 40 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-4 bg-red-500 text-white rounded-full shadow-lg shadow-red-500/40 hover:bg-red-600 hover:-translate-y-1 transition-all z-40 flex items-center justify-center group"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} className="group-hover:animate-bounce" />
        </button>
      )}
    </div>
  );
};

export default PokemonList;