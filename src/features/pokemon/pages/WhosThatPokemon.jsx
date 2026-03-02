import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Volume2, Volume1, VolumeX, ArrowLeft } from "lucide-react";
import { fetchQuizRound, genRanges } from "../services/gameService"; 

// --- KOMPONEN VOLUME CONTROL (Absolute Panel - Slide to Left) ---
const VolumeControl = ({ isMuted, volume, toggleMute, handleVolumeChange }) => (
  <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50 group flex items-center justify-end bg-gray-900/60 p-2 md:p-3 rounded-full backdrop-blur-md border border-gray-700/50 shadow-lg transition-all hover:bg-gray-900/80">
    
    <div className="w-0 overflow-hidden opacity-0 transition-all duration-300 ease-out group-hover:w-20 md:group-hover:w-24 group-hover:opacity-100 group-hover:mr-3 flex items-center">
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={isMuted ? 0 : volume}
        onChange={handleVolumeChange}
        className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-yellow-400"
      />
    </div>

    <button 
      onClick={toggleMute}
      onMouseLeave={(e) => e.target.blur()} 
      className="text-white hover:text-yellow-400 transition-colors shrink-0 flex items-center justify-center px-1 outline-none"
    >
      {isMuted || volume === 0 ? <VolumeX size={20} /> : volume < 0.5 ? <Volume1 size={20} /> : <Volume2 size={20} />}
    </button>
  </div>
);

// --- KOMPONEN UTAMA ---
const WhosThatPokemon = () => {
  const [gameState, setGameState] = useState("menu"); 
  const [gameMode, setGameMode] = useState(null); 
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [streak, setStreak] = useState(0);
  
  const [selectedGen, setSelectedGen] = useState("Gen 1 (Kanto)");

  // --- BGM & VOLUME CONTROL ---
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const bgmRef = useRef(null);

  useEffect(() => {
    bgmRef.current = new Audio("/audio/emerald-bgm.mp3");
    bgmRef.current.loop = true;
    bgmRef.current.volume = volume;
    return () => bgmRef.current.pause();
  }, []);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (bgmRef.current) {
      bgmRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (bgmRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      bgmRef.current.volume = newMutedState ? 0 : volume;
    }
  };

  // --- INTERAKTIF LOADING TEXT ---
  const loadingPhrases = ["Searching in tall grass...", "Rustling leaves...", "A wild Pokémon appeared!"];
  const [loadingText, setLoadingText] = useState(loadingPhrases[0]);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["quizRound", gameMode], 
    queryFn: fetchQuizRound,
    enabled: gameState === "playing", 
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    let interval;
    if (isLoading || isFetching) {
      let idx = 0;
      interval = setInterval(() => {
        idx = (idx + 1) % loadingPhrases.length;
        setLoadingText(loadingPhrases[idx]);
      }, 700); 
    }
    return () => clearInterval(interval);
  }, [isLoading, isFetching]);

  const startGame = (mode) => {
    setGameMode(mode);
    setGameState("playing");
    setStreak(0);
    setIsRevealed(false);
    setSelectedOption(null);
    if (bgmRef.current && bgmRef.current.paused && !isMuted) {
      bgmRef.current.play().catch(() => {});
    }
  };

  const backToMenu = () => {
    setGameState("menu");
    setGameMode(null);
  };

  const handleGuess = (guessedName) => {
    if (isRevealed) return; 
    setSelectedOption(guessedName);
    setIsRevealed(true);

    const isCorrect = guessedName === data.target.name;

    if (!isMuted && data.target.cries?.latest) {
      const sfx = new Audio(data.target.cries.latest);
      sfx.volume = volume > 0 ? Math.min(volume + 0.2, 1) : 0.5; 
      sfx.play().catch(() => {});
    }

    if (isCorrect) setStreak(prev => prev + 1);
    else setStreak(0);
  };

  const handleNextRound = () => {
    setIsRevealed(false);
    setSelectedOption(null);
    refetch(); 
  };

  const pixelFont = { fontFamily: "'Press Start 2P', cursive" };

  // --- RENDER MAIN MENU ---
  if (gameState === "menu") {
    return (
      <div className="w-full min-h-[85vh] rounded-3xl overflow-hidden relative border-8 border-gray-800 shadow-2xl flex flex-col items-center justify-center bg-cover bg-center" 
           style={{ backgroundImage: "url('https://camo.githubusercontent.com/f02eeb47242135dc8c8d8b6f37afb722dffc9ceafab31b5c2a7f5a5e39660c6f/68747470czovL2kuaW1ndXIuY29tL1FWeXpGZFAuZ2lm')" }}>
        
        <div className="absolute inset-0 bg-green-900/50 backdrop-blur-[2px]"></div>
        
        <VolumeControl isMuted={isMuted} volume={volume} toggleMute={toggleMute} handleVolumeChange={handleVolumeChange} />

        <div className="relative z-10 flex flex-col items-center p-6 w-full max-w-4xl mt-10 md:mt-0">
          
          <div className="mb-10 drop-shadow-2xl text-center">
            <h1 className="text-yellow-400 text-3xl md:text-5xl lg:text-6xl drop-shadow-[0_4px_0_#2563eb]" style={pixelFont}>
              Who's that
            </h1>
            <h1 className="text-white text-4xl md:text-7xl lg:text-8xl mt-4 drop-shadow-[0_6px_0_#2563eb]" style={pixelFont}>
              Pokémon?
            </h1>
          </div>

          <h2 className="text-white text-lg md:text-xl mb-8 drop-shadow-md text-center" style={pixelFont}>
            Choose a gamemode
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full px-2">
            
            {/* STARTER MODE */}
            <div className="flex flex-col items-center justify-between text-center bg-black/20 p-4 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-colors">
              <div className="w-full">
                <button onClick={() => startGame("starters")} className="w-full bg-white border-[6px] border-gray-800 hover:scale-105 active:scale-95 transition-transform px-4 py-4 rounded-xl shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                  <span className="text-gray-800 text-sm md:text-base" style={pixelFont}>Starters mode</span>
                </button>
                <p className="text-white text-[9px] md:text-[10px] mt-4 mb-2 drop-shadow-md leading-relaxed font-bold max-w-[250px] mx-auto" style={pixelFont}>
                  Try to guess as many starter pokémon as you can!
                </p>
              </div>
              <div className="flex justify-center -space-x-3">
                {[1, 4, 7, 152, 258].map(id => <img key={id} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`} alt="sprite" className="w-10 h-10 rendering-pixelated" />)}
              </div>
            </div>

            {/* GEN MODE */}
            <div className="flex flex-col items-center justify-between text-center bg-black/20 p-4 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-colors">
              <div className="w-full">
                <button onClick={() => startGame(selectedGen)} className="w-full bg-white border-[6px] border-gray-800 hover:scale-105 active:scale-95 transition-transform px-4 py-3 rounded-xl shadow-[6px_6px_0_rgba(0,0,0,0.5)] mb-3">
                  <span className="text-gray-800 text-sm md:text-base" style={pixelFont}>Gen Mode</span>
                </button>
                
                <select 
                  value={selectedGen}
                  onChange={(e) => setSelectedGen(e.target.value)}
                  className="w-full bg-gray-800 text-yellow-400 text-[10px] md:text-xs p-2.5 rounded-lg border-2 border-gray-600 focus:outline-none focus:border-yellow-400 cursor-pointer shadow-inner transition-colors"
                  style={pixelFont}
                >
                  {Object.keys(genRanges).map(gen => (
                    <option key={gen} value={gen}>{gen}</option>
                  ))}
                </select>
                
                <p className="text-white text-[9px] md:text-[10px] mt-3 drop-shadow-md leading-relaxed font-bold max-w-[250px] mx-auto" style={pixelFont}>
                  Guess pokémon from {selectedGen.split(" ")[0]}!
                </p>
              </div>
              <div className="flex justify-center -space-x-3 mt-1">
                {[143, 9, 149, 132].map(id => <img key={id} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`} alt="sprite" className="w-10 h-10 rendering-pixelated" />)}
              </div>
            </div>

            {/* LEGENDARY MODE */}
            <div className="flex flex-col items-center justify-between text-center bg-black/20 p-4 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-colors">
              <div className="w-full">
                <button onClick={() => startGame("legendary")} className="w-full bg-white border-[6px] border-gray-800 hover:scale-105 active:scale-95 transition-transform px-4 py-4 rounded-xl shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                  <span className="text-gray-800 text-sm md:text-base" style={pixelFont}>Legendary mode</span>
                </button>
                <p className="text-white text-[9px] md:text-[10px] mt-4 mb-2 drop-shadow-md leading-relaxed font-bold max-w-[250px] mx-auto" style={pixelFont}>
                  Try to guess as many legendary pokémon as you can!
                </p>
              </div>
              <div className="flex justify-center -space-x-3">
                {[144, 145, 146, 150].map(id => <img key={id} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`} alt="sprite" className="w-10 h-10 rendering-pixelated" />)}
              </div>
            </div>

            {/* INSANE MODE */}
            <div className="flex flex-col items-center justify-between text-center bg-black/20 p-4 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-black/40 transition-colors">
              <div className="w-full">
                <button onClick={() => startGame("insane")} className="w-full bg-white border-[6px] border-gray-800 hover:scale-105 active:scale-95 transition-transform px-4 py-4 rounded-xl shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
                  <span className="text-gray-800 text-sm md:text-base" style={pixelFont}>Insane mode</span>
                </button>
                <p className="text-white text-[9px] md:text-[10px] mt-4 mb-2 drop-shadow-md leading-relaxed font-bold max-w-[250px] mx-auto" style={pixelFont}>
                  Guess pokémon from all nine generations!
                </p>
              </div>
              <div className="flex justify-center -space-x-3">
                {[722, 725, 728, 810, 816].map(id => <img key={id} src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`} alt="sprite" className="w-10 h-10 rendering-pixelated" />)}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // --- RENDER GAME ARENA ---
  return (
    <div className="w-full min-h-[85vh] rounded-3xl overflow-hidden relative border-8 border-gray-800 shadow-2xl flex flex-col bg-cover bg-center"
         style={{ backgroundImage: "url('https://camo.githubusercontent.com/f02eeb47242135dc8c8d8b6f37afb722dffc9ceafab31b5c2a7f5a5e39660c6f/68747470czovL2kuaW1ndXIuY29tL1FWeXpGZFAuZ2lm')" }}>
      
      <div className="absolute inset-0 bg-green-900/70 backdrop-blur-[2px]"></div>

      {/* HEADER ARENA */}
      <div className="relative z-10 flex items-center h-16 md:h-20 p-4 md:p-6 bg-gray-900/80 border-b-4 border-gray-800">
        <button onClick={backToMenu} className="relative z-20 flex items-center gap-2 text-white hover:text-yellow-400 transition-colors" style={pixelFont}>
          <ArrowLeft size={20} /> <span className="text-[10px] md:text-xs hidden sm:block">MENU</span>
        </button>
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-yellow-400 text-sm md:text-base drop-shadow-md" style={pixelFont}>
            STREAK: <span className="text-white">{streak}</span>
          </div>
        </div>

        <VolumeControl isMuted={isMuted} volume={volume} toggleMute={toggleMute} handleVolumeChange={handleVolumeChange} />
      </div>

      {/* STAGE ARENA */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        {isLoading || isFetching ? (
          <div className="flex flex-col items-center h-full justify-center">
            <img 
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" 
              alt="Loading" 
              className="w-16 h-16 rendering-pixelated animate-spin mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
            />
            <p className="text-white text-[10px] md:text-xs text-center leading-loose tracking-widest drop-shadow-md h-8" style={pixelFont}>
              {loadingText}
            </p>
          </div>
        ) : data ? (
          <div className="w-full max-w-3xl flex flex-col items-center">
            
            <div className="relative w-56 h-56 md:w-72 md:h-72 flex items-center justify-center mb-6">
              <div className="absolute inset-0 bg-black/40 rounded-full border-4 border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.2)]"></div>
              <img
                src={data.target.sprites.other["official-artwork"].front_default || data.target.sprites.front_default}
                alt="Mystery Pokemon"
                className={`w-[80%] h-[80%] object-contain relative z-20 transition-all duration-700 ease-out 
                  ${!isRevealed 
                    ? "brightness-0 contrast-100 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
                    : "scale-110 drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)] translate-y-[-10px]"}`}
              />
            </div>

            <div className="min-h-[60px] text-center mb-6 w-full flex flex-col items-center justify-center">
              {isRevealed ? (
                <>
                  <p className={`text-sm md:text-base mb-3 drop-shadow-md ${selectedOption === data.target.name ? "text-green-400" : "text-red-400"}`} style={pixelFont}>
                    {selectedOption === data.target.name ? "CORRECT!" : "WRONG!"}
                  </p>
                  <p className="text-white text-lg md:text-xl drop-shadow-md leading-relaxed" style={pixelFont}>
                    It's <span className="text-yellow-400">{data.target.name.toUpperCase()}</span>!
                  </p>
                </>
              ) : (
                <p className="text-white text-xs md:text-sm drop-shadow-md leading-loose" style={pixelFont}>
                  Who's that Pokémon?
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full px-2 md:px-8">
              {data.options.map((optionName) => {
                let btnClass = "bg-white text-gray-900 hover:bg-gray-200 border-b-[6px] border-gray-400";
                
                if (isRevealed) {
                  if (optionName === data.target.name) btnClass = "bg-green-500 text-white border-b-[6px] border-green-700 z-10 scale-105 shadow-[0_0_20px_rgba(34,197,94,0.5)]";
                  else if (optionName === selectedOption) btnClass = "bg-red-500 text-white border-b-[6px] border-red-700";
                  else btnClass = "bg-gray-400 text-gray-600 opacity-50 border-b-[6px] border-gray-500";
                }

                return (
                  <button
                    key={optionName}
                    onClick={() => handleGuess(optionName)}
                    disabled={isRevealed}
                    className={`px-3 py-5 md:py-6 rounded-xl border-2 border-gray-800 uppercase text-[10px] md:text-[11px] leading-relaxed shadow-lg transition-all 
                    ${!isRevealed ? "active:border-b-2 active:translate-y-1" : "translate-y-1 border-b-2"} ${btnClass}`}
                    style={pixelFont}
                  >
                    {optionName}
                  </button>
                );
              })}
            </div>

            {isRevealed && (
              <button
                onClick={handleNextRound}
                className="mt-8 bg-yellow-400 hover:bg-yellow-300 text-gray-900 border-2 border-gray-900 border-b-[6px] hover:border-b-[4px] hover:translate-y-[2px] active:border-b-0 active:translate-y-[6px] px-8 py-4 rounded-xl uppercase text-[10px] md:text-xs shadow-xl transition-all"
                style={pixelFont}
              >
                Next Pokémon
              </button>
            )}

          </div>
        ) : null}
      </div>
    </div>
  );
};

export default WhosThatPokemon;