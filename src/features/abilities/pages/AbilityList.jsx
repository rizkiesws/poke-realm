import React, { useState, useEffect, useRef } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchAbilityList, fetchAllAbilities } from "../services/abilityService"; 
import { Loader2, Search, ArrowUp, X } from "lucide-react";
import SkeletonCard from "../../../components/UI/SkeletonCard"; 
import AbilityDetail from "./AbilityDetail"; 

const AbilityList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAbilityModal, setSelectedAbilityModal] = useState(null);
  
  const topRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShowScrollTop(!entry.isIntersecting),
      { rootMargin: "-300px 0px 0px 0px" }
    );
    if (topRef.current) observer.observe(topRef.current);
    return () => { if (topRef.current) observer.unobserve(topRef.current); };
  }, []);

  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });

  const infiniteQuery = useInfiniteQuery({
    queryKey: ["abilityList"],
    queryFn: ({ pageParam = 0 }) => fetchAbilityList(20, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => lastPage.next ? allPages.length * 20 : undefined,
  });

  const { data: allAbilities } = useQuery({
    queryKey: ["allAbilitiesList"],
    queryFn: fetchAllAbilities,
    staleTime: Infinity,
  });

  const isSearching = searchTerm.trim().length > 0;
  const getAbilityId = (url) => url.split("/")[url.split("/").length - 2];

  const rawAbilitiesData = isSearching
    ? allAbilities?.filter(ability => {
        const id = getAbilityId(ability.url);
        const matchName = ability.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchId = id.includes(searchTerm);
        return matchName || matchId;
      }) || []
    : infiniteQuery.data?.pages.flatMap((page) => page.results) || [];

  const abilitiesToDisplay = rawAbilitiesData.filter((ability) => {
    const id = parseInt(getAbilityId(ability.url));
    return id < 10000;
  });

  const isLoading = infiniteQuery.status === "pending";
  const isError = infiniteQuery.status === "error";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && abilitiesToDisplay.length > 0) {
      setSelectedAbilityModal(abilitiesToDisplay[0].name);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 relative">
      <div ref={topRef} className="absolute top-0" />

      {/* OVERLAY MODAL */}
      {selectedAbilityModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all" onClick={() => setSelectedAbilityModal(null)}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <AbilityDetail name={selectedAbilityModal} onClose={() => setSelectedAbilityModal(null)} />
          </div>
        </div>
      )}

      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4 mt-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors">Abilities</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 transition-colors">Explore passive abilities used by Pokémon.</p>
        </div>
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search Abilities name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors shadow-sm"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 w-5 h-5 transition-colors" />
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm("")} className="absolute right-3 top-2.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </form>
      </div>

      {/* LIST KONTEN */}
      {isLoading && <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">{[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}</div>}
      {isError && <div className="text-center p-10 text-red-500">Failed to load data.</div>}
      {isSearching && abilitiesToDisplay.length === 0 && <div className="text-center p-10 text-gray-400 dark:text-gray-500 font-medium transition-colors">No abilities found matching "{searchTerm}"</div>}

      {!isLoading && !isError && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {abilitiesToDisplay.map((ability) => {
            const id = getAbilityId(ability.url);

            return (
              <div key={ability.name} onClick={() => setSelectedAbilityModal(ability.name)} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-xl dark:hover:shadow-lg dark:hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 group flex flex-col items-center justify-between">
                <div className="bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl p-4 mb-4 flex justify-center relative w-full min-h-[100px] items-center transition-colors">
                  <span className="absolute top-2 left-3 text-xs font-bold text-indigo-300 dark:text-indigo-400">#{id.padStart(3, "0")}</span>
                  <img 
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ability-capsule.png" 
                    alt="Ability" 
                    className="w-14 h-14 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300 drop-shadow-sm" 
                    loading="lazy" 
                  />
                </div>
                <h3 className="text-center font-bold text-gray-700 dark:text-gray-100 capitalize text-sm md:text-base leading-tight transition-colors">
                  {ability.name.replace(/-/g, " ")}
                </h3>
              </div>
            );
          })}
        </div>
      )}

      {/* LOAD MORE BUTTON */}
      {!isSearching && infiniteQuery.status === "success" && (
        <div className="mt-12 flex justify-center">
          <button onClick={() => infiniteQuery.fetchNextPage()} disabled={!infiniteQuery.hasNextPage || infiniteQuery.isFetchingNextPage} className="bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all flex items-center gap-2 disabled:opacity-50">
            {infiniteQuery.isFetchingNextPage ? <><Loader2 className="animate-spin w-5 h-5" /> Loading...</> : infiniteQuery.hasNextPage ? "Load More Abilities" : "End of List"}
          </button>
        </div>
      )}

      {/* FLOATING ACTION BUTTON */}
      {showScrollTop && (
        <button onClick={scrollToTop} className="fixed bottom-6 right-6 p-4 bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/40 hover:bg-indigo-600 hover:-translate-y-1 transition-all z-[40] flex items-center justify-center group" aria-label="Scroll to top">
          <ArrowUp size={24} className="group-hover:animate-bounce" />
        </button>
      )}
    </div>
  );
};

export default AbilityList;