import React, { useState, useEffect, useRef } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchMachineList, fetchAllMachines } from "../services/machineService"; 
import { Loader2, Search, ArrowUp, X } from "lucide-react";
import SkeletonCard from "../../../components/UI/SkeletonCard"; 
import MachineDetail from "./MachineDetail"; 

const MachineList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // Untuk machine, kita menggunakan ID sebagai identitas utamanya
  const [selectedMachineId, setSelectedMachineId] = useState(null);
  
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
    queryKey: ["machineList"],
    queryFn: ({ pageParam = 0 }) => fetchMachineList(20, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => lastPage.next ? allPages.length * 20 : undefined,
  });

  const { data: allMachines } = useQuery({
    queryKey: ["allMachinesList"],
    queryFn: fetchAllMachines,
    staleTime: Infinity,
  });

  const isSearching = searchTerm.trim().length > 0;
  const getMachineId = (url) => url.split("/")[url.split("/").length - 2];

  // Logic Search: Hanya menggunakan ID karena endpoint list machine tidak memunculkan nama TM
  const machinesToDisplay = isSearching
    ? allMachines?.filter(machine => {
        const id = getMachineId(machine.url);
        return id.includes(searchTerm);
      }) || []
    : infiniteQuery.data?.pages.flatMap((page) => page.results) || [];

  const isLoading = infiniteQuery.status === "pending";
  const isError = infiniteQuery.status === "error";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && machinesToDisplay.length > 0) {
      setSelectedMachineId(getMachineId(machinesToDisplay[0].url));
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 relative">
      <div ref={topRef} className="absolute top-0" />

      {/* OVERLAY MODAL */}
      {selectedMachineId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all" onClick={() => setSelectedMachineId(null)}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <MachineDetail id={selectedMachineId} onClose={() => setSelectedMachineId(null)} />
          </div>
        </div>
      )}

      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4 mt-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors">Machines</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 transition-colors">Find Technical Machines (TM) & HMs.</p>
        </div>
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by Machine ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors shadow-sm"
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
      {isSearching && machinesToDisplay.length === 0 && <div className="text-center p-10 text-gray-400 dark:text-gray-500 font-medium transition-colors">No machines found with ID "{searchTerm}"</div>}

      {!isLoading && !isError && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {machinesToDisplay.map((machine) => {
            const id = getMachineId(machine.url);

            return (
              <div key={id} onClick={() => setSelectedMachineId(id)} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-xl dark:hover:shadow-lg dark:hover:shadow-orange-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 group flex flex-col items-center justify-between">
                <div className="bg-orange-50/50 dark:bg-orange-900/20 rounded-xl p-4 mb-4 flex justify-center relative w-full min-h-[100px] items-center transition-colors">
                  <span className="absolute top-2 left-3 text-xs font-bold text-orange-300 dark:text-orange-400/70">#{id.padStart(3, "0")}</span>
                  <img 
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-normal.png" 
                    alt="Machine TM" 
                    className="w-14 h-14 object-contain opacity-80 group-hover:opacity-100 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-300 drop-shadow-sm"
                    loading="lazy" 
                  />
                </div>
                <h3 className="text-center font-bold text-gray-700 dark:text-gray-100 capitalize text-sm md:text-base leading-tight transition-colors">
                  Machine #{id}
                </h3>
              </div>
            );
          })}
        </div>
      )}

      {/* LOAD MORE BUTTON */}
      {!isSearching && infiniteQuery.status === "success" && (
        <div className="mt-12 flex justify-center">
          <button onClick={() => infiniteQuery.fetchNextPage()} disabled={!infiniteQuery.hasNextPage || infiniteQuery.isFetchingNextPage} className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all flex items-center gap-2 disabled:opacity-50">
            {infiniteQuery.isFetchingNextPage ? <><Loader2 className="animate-spin w-5 h-5" /> Loading...</> : infiniteQuery.hasNextPage ? "Load More Machines" : "End of List"}
          </button>
        </div>
      )}

      {/* FLOATING ACTION BUTTON */}
      {showScrollTop && (
        <button onClick={scrollToTop} className="fixed bottom-6 right-6 p-4 bg-orange-500 text-white rounded-full shadow-lg shadow-orange-500/40 hover:bg-orange-600 hover:-translate-y-1 transition-all z-[40] flex items-center justify-center group" aria-label="Scroll to top">
          <ArrowUp size={24} className="group-hover:animate-bounce" />
        </button>
      )}
    </div>
  );
};

export default MachineList;