import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
      );
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      root.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2 rounded-full transition-all duration-300 hover:scale-110 shadow-sm flex items-center justify-center border-2 shrink-0
      ${isDark ? "bg-gray-800 border-gray-600 shadow-purple-500/20" : "bg-orange-50 border-orange-200 shadow-orange-500/20"}`}
      title={isDark ? "Light Mode" : "Dark Mode"}
    >
      <img
        src={
          isDark
            ? "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/moon-stone.png"
            : "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/sun-stone.png"
        }
        alt="Theme Stone"
        className={`w-6 h-6 object-contain transition-transform duration-500 ${isDark ? "-rotate-12" : "rotate-45"}`}
      />
    </button>
  );
};

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* Mobile Overlay - z-[90] ensures it sits above page content but below sidebar */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar - z-[100] ensures it floats above everything including filter & scroll buttons */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-[100] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-all duration-300 ease-in-out flex flex-col
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
        `}
      >
        <div className="h-20 shrink-0 flex items-center px-6 border-b border-gray-100 dark:border-gray-700 gap-3">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png"
            alt="Logo"
            className="w-10 h-10 animate-bounce"
          />
          <span className="text-2xl font-pokemon font-bold tracking-wide text-red-500 drop-shadow-sm">PokeRealm</span>
          <button onClick={closeSidebar} className="md:hidden ml-auto text-gray-500 dark:text-gray-400">
            <X />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          <SectionTitle>Pokedex Data</SectionTitle>
          <NavItem
            to="/"
            label="Pokémon"
            imgUrl="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            onClick={closeSidebar}
          />
          <NavItem
            to="/compare"
            label="VS Arena"
            imgUrl="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png"
            onClick={closeSidebar}
          />
          <NavItem
            to="/moves"
            label="Moves"
            imgUrl="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-normal.png"
            onClick={closeSidebar}
          />
          <NavItem
            to="/abilities"
            label="Abilities"
            imgUrl="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ability-capsule.png"
            onClick={closeSidebar}
          />
          <NavItem
            to="/items"
            label="Items"
            imgUrl="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png"
            onClick={closeSidebar}
          />
          <NavItem
            to="/berries"
            label="Berries"
            imgUrl="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/cheri-berry.png"
            onClick={closeSidebar}
          />

          <SectionTitle>World Info</SectionTitle>
          <NavItem
            to="/locations"
            label="Locations"
            imgUrl="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png"
            onClick={closeSidebar}
          />
          <NavItem
            to="/machines"
            label="Machines"
            imgUrl="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/tm-electric.png"
            onClick={closeSidebar}
          />
          <SectionTitle>Mini Games</SectionTitle>
          <NavItem
            to="/whos-that-pokemon"
            label="Guess Pokémon"
            imgUrl="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-toy.png"
            onClick={closeSidebar}
          />
        </nav>

        {/* Desktop Theme Footer - Hidden on Mobile (hidden md:flex) */}
        <div className="hidden md:flex shrink-0 p-4 border-t border-gray-100 dark:border-gray-700 items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
          <span className="text-sm font-bold text-gray-400 dark:text-gray-500">Theme</span>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="md:hidden h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 justify-between transition-colors duration-300">
          <div className="flex items-center gap-2">
            <img
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
              className="w-8 h-8"
              alt="Pokeball"
            />
            <span className="font-bold font-pokemon tracking-wide text-red-600 text-lg drop-shadow-sm">PokeRealm</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={toggleSidebar}
              className="p-2 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Menu />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 dark:bg-gray-900 scroll-smooth transition-colors duration-300">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

const SectionTitle = ({ children }) => (
  <div className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase px-4 mb-2 mt-6 tracking-wider">
    {children}
  </div>
);

const NavItem = ({ to, imgUrl, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) => `
      flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium group
      ${
        isActive
          ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 shadow-sm border border-red-100 dark:border-red-500/20"
          : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
      }
    `}
  >
    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1 group-hover:bg-white dark:group-hover:bg-gray-600 transition-colors">
      <img src={imgUrl} alt={label} className="w-full h-full object-contain rendering-pixelated drop-shadow-sm" />
    </div>
    <span className="text-sm">{label}</span>
  </NavLink>
);

export default MainLayout;
