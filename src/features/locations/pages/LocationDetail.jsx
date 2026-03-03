import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchLocationDetail } from "../services/locationService";
import { X } from "lucide-react";

/**
 * LocationDetailSkeleton Component
 * Displays loading placeholder for location detail view
 */
const LocationDetailSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden min-h-[50vh] animate-pulse transition-colors duration-300">
    <div className="bg-gray-200 dark:bg-gray-700 p-6 h-[180px] relative"></div>
    <div className="pt-12 px-8 pb-8 space-y-6">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-8"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  </div>
);

/**
 * LocationDetail Component
 * Displays detailed information about a specific Pokémon location
 */
const LocationDetail = ({ name, onClose }) => {
  const {
    data: location,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["location", name],
    queryFn: () => fetchLocationDetail(name),
  });

  if (isLoading) return <LocationDetailSkeleton />;
  if (isError || !location)
    return (
      <div className="p-10 text-center text-red-500 font-bold bg-white dark:bg-gray-800 rounded-3xl">
        Location not found!
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden relative transition-colors duration-300">
      {/* Header section with blue theme for world/locations */}
      <div className="bg-blue-600 dark:bg-blue-900 relative text-white h-[180px] flex items-center justify-center transition-colors duration-500 rounded-t-3xl">
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-20">
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/40 rounded-full p-2 backdrop-blur-sm transition cursor-pointer"
          >
            <X size={24} />
          </button>
          {location.region && (
            <span className="text-xs font-bold opacity-90 uppercase px-3 py-1 bg-white/20 rounded-full tracking-wider shadow-sm flex items-center gap-1.5">
              <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png"
                alt="Region"
                className="w-4 h-4 object-contain"
              />
              {location.region.name.replace(/-/g, " ")} Region
            </span>
          )}
        </div>

        <div className="z-10 text-center mt-4 px-4">
          <h1 className="text-3xl md:text-4xl font-bold capitalize tracking-wide drop-shadow-md">
            {location.name.replace(/-/g, " ")}
          </h1>
        </div>
      </div>

      {/* Body content section */}
      <div className="pt-8 px-8 pb-8">
        {/* Region information box */}
        <div className="flex items-center gap-4 mb-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shrink-0 border border-blue-100 dark:border-gray-700 shadow-sm transition-colors">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-radar.png"
              alt="Radar"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5">
              Located In
            </p>
            <p className="text-lg font-black text-gray-800 dark:text-white capitalize transition-colors">
              {location.region ? `${location.region.name.replace(/-/g, " ")} Region` : "Unknown Region"}
            </p>
          </div>
        </div>

        {/* List of accessible areas in location */}
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 transition-colors">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/bicycle.png"
            alt="Explore"
            className="w-6 h-6 object-contain"
          />
          Explore Areas ({location.areas?.length || 0})
        </h3>

        {location.areas && location.areas.length > 0 ? (
          <div className="flex flex-wrap gap-2 max-h-[250px] overflow-y-auto pr-2 scrollbar-hide">
            {location.areas.map((area) => (
              <span
                key={area.name}
                className="px-4 py-2 bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold capitalize border border-gray-200 dark:border-gray-600 cursor-default transition-colors"
              >
                {area.name.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic mt-3 transition-colors">
            No specific areas found in this location.
          </p>
        )}
      </div>
    </div>
  );
};

export default LocationDetail;
