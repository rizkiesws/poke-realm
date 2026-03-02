PokeRealm — The Ultimate Pokédex & Battle Arena

**PokeRealm** is a modern, feature-rich web application built with React that serves as a comprehensive Pokémon encyclopedia. Far beyond a simple list, it features interactive data visualization, recursive evolution trees, mini-games, and a sleek, fully responsive UI wrapped in a dynamic Dark/Light theme.

Powered by the [PokéAPI](https://pokeapi.co/), this project demonstrates advanced frontend development skills including complex state management, data caching, responsive design, and data visualization.

---

## ✨ Key Features

### 📖 Advanced Pokédex

- **Infinite Scrolling** — Seamlessly browse through hundreds of Pokémon without pagination delays.
- **Smart Search & Filters** — Live search by Name or ID, combined with Generation and Type filtering.
- **Optimized Caching** — Powered by TanStack Query (React Query) for lightning-fast data retrieval and minimal API calls.
- **Skeleton Loaders** — Custom loading skeletons that adapt perfectly to both Light and Dark modes.

### 🔍 In-Depth Pokémon Details

- **About & Encounters** — Flavor texts, physical traits, and a dedicated sub-modal mapping out in-game encounter locations.
- **Base Stats & Weaknesses** — Visual progress bars for stats and an automated Type Matchup calculator displaying critical weaknesses.
- **Recursive Evolution Tree** — A dynamically generated, mobile-friendly evolution tree that handles complex branching (e.g., Eevee's 8 evolutions).
- **Immersive Audio & Visuals** — Toggle between Normal and Shiny sprites, and play authentic Pokémon cries directly from the UI.

### ⚔️ Versus Arena

- **Side-by-Side Comparison** — Pit two Pokémon against each other in a dedicated battle arena layout.
- **Dynamic Radar Chart** — Integrated with **Recharts** to visualize and overlap base stats. Chart lines automatically adapt to each Pokémon's primary type color.
- **Head-to-Head Breakdown** — A detailed, color-coded stat table highlighting the statistical winner in each category.

### 🎮 Mini-Game: Who's That Pokémon?

- A nostalgic, interactive guessing game with multiple difficulty modes: Starters, Legendaries, Specific Generations, and Insane Mode.
- Features dynamic loading texts, authentic audio cues, and a streak counter.

### 🌗 Theming & UI/UX

- **Sun/Moon Stone Theme Toggle** — A custom, animated Dark Mode toggle tailored to the Pokémon theme.
- **Fully Responsive** — Optimized for Desktop, Tablet, and Mobile with mobile-specific navigation patterns (hamburger menus, safe-area padding).
- **Flawless Overlay Management** — Proper z-index handling across modals, sidebars, floating action buttons, and dropdowns.

---

## 🛠️ Tech Stack

| Category              | Technology                          |
| --------------------- | ----------------------------------- |
| Core                  | React.js, React Router DOM          |
| Styling               | Tailwind CSS, Lucide React          |
| Data Fetching & State | Axios, TanStack Query (React Query) |
| Data Visualization    | Recharts                            |
| API                   | [PokéAPI v2](https://pokeapi.co/)   |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/poke-realm.git
   cd poke-realm
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`.

---

## 📂 Project Structure

```
src/
├── components/
│   ├── UI/               # Reusable components (SkeletonCard, etc.)
│   └── Layout/           # MainLayout, Sidebar, ThemeToggle
├── features/
│   └── pokemon/
│       ├── PokemonList.jsx       # Infinite scroll Pokédex
│       ├── PokemonDetail.jsx     # Detail modal with Evolution Tree
│       ├── ComparePokemon.jsx    # Recharts visualization arena
│       └── WhosThatPokemon.jsx   # Mini-game component
├── services/
│   └── pokemonService.js         # Centralized API logic and Axios instances
└── App.jsx
```

---

## 🤝 Acknowledgements

- Huge thanks to the creators of [PokéAPI](https://pokeapi.co/) for providing such a detailed and open-source database.
- Sprites and icons sourced from official Pokémon assets and open-source community contributions.

---

Built with ❤️ and a lot of coffee by **Muhammad Rizky**

---
