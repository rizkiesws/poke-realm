import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMachineDetail } from "../services/machineService";
import { X } from "lucide-react";

/**
 * MachineDetailSkeleton Component
 * Displays loading placeholder for machine/TM detail view
 */
const MachineDetailSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden min-h-[40vh] animate-pulse transition-colors duration-300">
    <div className="bg-gray-200 dark:bg-gray-700 p-6 h-[180px] relative"></div>
    <div className="pt-12 px-8 pb-8 space-y-6">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mx-auto mb-8"></div>
      <div className="flex justify-between mt-6 gap-4">
        <div className="flex-1 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
        <div className="flex-1 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
      </div>
    </div>
  </div>
);

/**
 * MachineDetail Component
 * Displays detailed information about a specific TM/HM machine
 */
const MachineDetail = ({ id, onClose }) => {
  const {
    data: machine,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["machine", id],
    queryFn: () => fetchMachineDetail(id),
  });

  if (isLoading) return <MachineDetailSkeleton />;
  if (isError || !machine)
    return (
      <div className="p-10 text-center text-red-500 font-bold bg-white dark:bg-gray-800 rounded-3xl">
        Machine not found!
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden relative transition-colors duration-300">
      {/* Header section with orange theme for machines */}
      <div className="bg-orange-500 dark:bg-orange-900 relative text-white h-[180px] flex items-center justify-center transition-colors duration-500 rounded-t-3xl">
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-20">
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/40 rounded-full p-2 backdrop-blur-sm transition cursor-pointer"
          >
            <X size={24} />
          </button>
          <span className="text-xs font-bold opacity-90 uppercase px-3 py-1 bg-white/20 rounded-full tracking-wider shadow-sm flex items-center gap-1.5">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-normal.png"
              alt="TM"
              className="w-4 h-4 object-contain"
            />
            TM / HM
          </span>
        </div>

        <div className="z-10 text-center pb-6">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-widest drop-shadow-md">
            {machine.item.name.replace(/-/g, " ")}
          </h1>
          <p className="text-orange-100 dark:text-orange-200 font-medium mt-2 text-sm tracking-wide">
            Machine #{machine.id}
          </p>
        </div>

        {/* TM disc image display */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-20 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg border-4 border-gray-100 dark:border-gray-700 transition-colors duration-300">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-normal.png"
            alt="TM Disc"
            className="w-16 h-16 object-contain drop-shadow-md opacity-90"
          />
        </div>
      </div>

      {/* Body content section */}
      <div className="pt-16 px-8 pb-8">
        {/* Move and version information boxes */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          {/* Box displaying the move taught by this machine */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 p-5 rounded-2xl text-center border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all flex flex-col items-center">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/expert-belt.png"
              alt="Move"
              className="w-8 h-8 mb-2 object-contain"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
              Teaches Move
            </p>
            <p className="text-xl font-black text-gray-800 dark:text-gray-100 capitalize transition-colors">
              {machine.move.name.replace(/-/g, " ")}
            </p>
          </div>

          {/* Box displaying the game version for this machine */}
          <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 p-5 rounded-2xl text-center border border-gray-100 dark:border-gray-600 hover:shadow-md transition-all flex flex-col items-center">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png"
              alt="Game"
              className="w-8 h-8 mb-2 object-contain"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
              Game Version
            </p>
            <p className="text-xl font-black text-gray-800 dark:text-gray-100 capitalize text-center leading-tight transition-colors">
              {machine.version_group.name.replace(/-/g, " ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineDetail;
