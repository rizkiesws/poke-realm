# PokeRealm - Comprehensive Pokémon Encyclopedia

**PokeRealm** is a modern, feature-rich web application built with React that serves as a comprehensive Pokémon encyclopedia. It provides interactive data visualization, detailed Pokémon information, evolution trees, type comparisons, and an engaging mini-game experience with a fully responsive interface supporting both dark and light themes.

Powered by the [PokéAPI](https://pokeapi.co/), this project demonstrates advanced frontend development skills including complex state management, data caching, responsive design, and data visualization.

---

## Key Features

### Advanced Pokédex

- **Infinite Scrolling** — Seamlessly browse through hundreds of Pokémon without pagination delays.
- **Smart Search and Filters** — Live search by name or ID, combined with generation and type filtering.
- **Optimized Data Caching** — Powered by TanStack Query for fast data retrieval and minimal API calls.
- **Adaptive Loading States** — Custom skeleton loaders that work seamlessly in both light and dark modes.

### Detailed Pokémon Information

- **Comprehensive Profiles** — Flavor text, physical characteristics, and encounter locations.
- **Base Statistics and Type Matchups** — Visual stat indicators with automated type effectiveness calculations.
- **Evolution Tracking** — Dynamically generated evolution trees handling complex branching patterns.
- **Media Integration** — Toggle between standard and shiny sprites with authentic Pokémon audio cries.

### Pokémon Comparison Tool

- **Side-by-Side Analysis** — Compare two Pokémon in a dedicated comparison view.
- **Statistical Visualization** — Radar charts integrated with Recharts to overlay base stats with type-based color coding.
- **Detailed Comparison Table** — Color-coded statistics highlighting comparative strengths across categories.

### Interactive Mini-Game

- **Who's That Pokémon?** — An interactive guessing game with multiple difficulty modes including Starters, Legendaries, Specific Generations, and Expert Mode.
- **Game Features** — Dynamic loading text, authentic audio feedback, and streak tracking.

### Theme Support and Responsive Design

- **Dark and Light Modes** — Seamless theme toggle with persistent user preferences.
- **Fully Responsive** — Optimized layouts for desktop, tablet, and mobile devices with mobile-specific navigation patterns.
- **Proper Overlay Management** — Correct z-index handling for modals, sidebars, and dropdown menus.

---

## Technology Stack

| Category           | Technology                          |
| ------------------ | ----------------------------------- |
| Frontend Framework | React.js, React Router DOM          |
| Styling            | Tailwind CSS, Lucide React          |
| Data Management    | Axios, TanStack Query (React Query) |
| Visualization      | Recharts                            |
| Data Source        | [PokéAPI v2](https://pokeapi.co/)   |

---

## Getting Started

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
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`.

---

## Project Structure

```
src/
├── components/
│   ├── UI/               # Reusable UI components
│   └── Layout/           # Page layout components
├── features/
│   ├── pokemon/          # Pokémon browsing and comparison features
│   ├── abilities/        # Ability information and browsing
│   ├── moves/            # Move encyclopedia
│   ├── items/            # Item database
│   ├── berries/          # Berry information
│   ├── machines/         # TM/HM database
│   └── locations/        # Location information
├── services/             # API integration and data fetching logic
├── routes/               # Application routing configuration
├── utils/                # Utility functions
└── App.jsx
```

---

## Acknowledgements

- Data provided by [PokéAPI](https://pokeapi.co/)
- Sprites and assets sourced from official Pokémon resources and community contributions

---

Developed by **Muhammad Rizky**
