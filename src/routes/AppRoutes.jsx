import { Routes, Route } from "react-router-dom";
import PokemonList from "../features/pokemon/pages/PokemonList";
import ItemList from "../features/items/pages/ItemList";
import MoveList from "../features/moves/pages/MoveList";
import BerryList from "../features/berries/pages/BerryList";
import LocationList from "../features/locations/pages/LocationList";
import MachineList from "../features/machines/pages/MachineList";
import AbilityList from "../features/abilities/pages/AbilityList";
import WhosThatPokemon from "../features/pokemon/pages/WhosThatPokemon";
import ComparePokemon from "../features/pokemon/pages/ComparePokemon";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PokemonList />} />
      <Route path="/pokemon" element={<PokemonList />} />
      <Route path="/items" element={<ItemList />} />
      <Route path="/moves" element={<MoveList />} />
      <Route path="/berries" element={<BerryList />} />
      <Route path="/locations" element={<LocationList />} />
      <Route path="/machines" element={<MachineList />} />
      <Route path="/abilities" element={<AbilityList />} />
      <Route path="/whos-that-pokemon" element={<WhosThatPokemon />} />
      <Route path="/compare" element={<ComparePokemon />} />
      <Route path="*" element={<div className="p-10 text-center text-red-500 font-bold">404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
