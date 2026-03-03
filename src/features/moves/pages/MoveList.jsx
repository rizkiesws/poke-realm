import React, { useState, useEffect, useRef } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchMoveList, fetchAllMoves } from "../services/moveService";
import { Loader2, Search, ArrowUp, X } from "lucide-react";
import SkeletonCard from "../../../components/UI/SkeletonCard";
import MoveDetail from "./MoveDetail";

/**
 * MoveList Component
 * Displays paginated list of Pokémon moves with search functionality
 */
const MoveList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMoveModal, setSelectedMoveModal] = useState(null);
  const topRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setShowScrollTop(!entry.isIntersecting), {
      rootMargin: "-300px 0px 0px 0px",
    });
    const currentRef = topRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });

  const infiniteQuery = useInfiniteQuery({
    queryKey: ["moveList"],
    queryFn: ({ pageParam = 0 }) => fetchMoveList(20, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => (lastPage.next ? allPages.length * 20 : undefined),
  });

  const { data: allMoves } = useQuery({ queryKey: ["allMovesList"], queryFn: fetchAllMoves, staleTime: Infinity });
  const isSearching = searchTerm.trim().length > 0;
  const getMoveId = (url) => url.split("/")[url.split("/").length - 2];

  const rawMovesData = isSearching
    ? allMoves?.filter((move) => {
        const id = getMoveId(move.url);
        return move.name.toLowerCase().includes(searchTerm.toLowerCase()) || id.includes(searchTerm);
      }) || []
    : infiniteQuery.data?.pages.flatMap((page) => page.results) || [];

  const movesToDisplay = rawMovesData.filter((move) => parseInt(getMoveId(move.url)) < 10000);
  const isLoading = infiniteQuery.status === "pending";
  const isError = infiniteQuery.status === "error";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() && movesToDisplay.length > 0) setSelectedMoveModal(movesToDisplay[0].name);
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 relative">
      <div ref={topRef} className="absolute top-0" />

      {selectedMoveModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all"
          onClick={() => setSelectedMoveModal(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <MoveDetail name={selectedMoveModal} onClose={() => setSelectedMoveModal(null)} />
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4 mt-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white transition-colors">Moves</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 transition-colors">
            Explore the complete list of Pokémon moves.
          </p>
        </div>
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search Moves name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors shadow-sm"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500 w-5 h-5 transition-colors" />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </form>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}
      {isError && <div className="text-center p-10 text-red-500">Failed to load data.</div>}
      {isSearching && movesToDisplay.length === 0 && (
        <div className="text-center p-10 text-gray-400 dark:text-gray-500 font-medium transition-colors">
          No moves found matching "{searchTerm}"
        </div>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movesToDisplay.map((move) => {
            const id = getMoveId(move.url);
            return (
              <div
                key={move.name}
                onClick={() => setSelectedMoveModal(move.name)}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-xl dark:hover:shadow-lg dark:hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 group flex flex-col items-center"
              >
                <div className="bg-violet-50/50 dark:bg-violet-900/20 rounded-xl p-4 mb-4 flex justify-center relative w-full min-h-[120px] items-center transition-colors">
                  <span className="absolute top-2 left-3 text-xs font-bold text-violet-400 dark:text-violet-400/60">
                    #{id.padStart(3, "0")}
                  </span>
                  <img
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-normal.png"
                    alt="Move TM"
                    className="w-14 h-14 object-contain group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 drop-shadow-sm opacity-80"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-center font-bold text-gray-700 dark:text-gray-100 capitalize text-lg transition-colors">
                  {move.name.replace(/-/g, " ")}
                </h3>
              </div>
            );
          })}
        </div>
      )}

      {!isSearching && infiniteQuery.status === "success" && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => infiniteQuery.fetchNextPage()}
            disabled={!infiniteQuery.hasNextPage || infiniteQuery.isFetchingNextPage}
            className="bg-violet-500 hover:bg-violet-600 dark:bg-violet-600 dark:hover:bg-violet-700 text-white font-semibold px-8 py-3 rounded-full shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {infiniteQuery.isFetchingNextPage ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" /> Loading...
              </>
            ) : infiniteQuery.hasNextPage ? (
              "Load More Moves"
            ) : (
              "End of List"
            )}
          </button>
        </div>
      )}

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-4 bg-violet-500 text-white rounded-full shadow-lg shadow-violet-500/40 hover:bg-violet-600 hover:-translate-y-1 transition-all z-[40] flex items-center justify-center group"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} className="group-hover:animate-bounce" />
        </button>
      )}
    </div>
  );
};

export default MoveList;
