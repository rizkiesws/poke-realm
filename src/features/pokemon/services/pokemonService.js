import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2";

/**
 * Fetches a paginated list of Pokémon
 */
export const fetchPokemonList = async (limit = 20, offset = 0) => {
  const response = await axios.get(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  return response.data;
};

/**
 * Fetches detailed Pokémon information including species data
 */
export const fetchPokemonDetail = async (name) => {
  const [pokemonRes, speciesRes] = await Promise.all([
    axios.get(`${BASE_URL}/pokemon/${name}`),
    axios.get(`${BASE_URL}/pokemon-species/${name}`),
  ]);

  return {
    ...pokemonRes.data,
    species: speciesRes.data,
  };
};

/**
 * Fetches all available Pokémon type names
 */
export const fetchTypes = async () => {
  const response = await axios.get(`${BASE_URL}/type`);
  return response.data.results;
};

/**
 * Fetches all Pokémon of a specific type
 */
export const fetchPokemonByType = async (type) => {
  const response = await axios.get(`${BASE_URL}/type/${type}`);
  return response.data.pokemon.map((p) => p.pokemon);
};

/**
 * Fetches the complete evolution chain for a Pokémon
 */
export const fetchEvolutionChain = async (pokemonName) => {
  try {
    const speciesRes = await axios.get(`${BASE_URL}/pokemon-species/${pokemonName}`);
    const evolutionUrl = speciesRes.data.evolution_chain.url;

    const evolutionRes = await axios.get(evolutionUrl);
    return evolutionRes.data.chain;
  } catch (error) {
    console.error("Failed to fetch evolution data:", error);
    return null;
  }
};

/**
 * Fetches all Pokémon names for search functionality
 * Includes all variants and special forms
 */
export const fetchAllPokemon = async () => {
  const response = await axios.get(`${BASE_URL}/pokemon?limit=10000`);
  return response.data.results;
};

/**
 * Fetches encounter locations where a Pokémon can be caught
 */
export const fetchPokemonEncounters = async (id) => {
  const response = await axios.get(`${BASE_URL}/pokemon/${id}/encounters`);
  return response.data;
};

/**
 * Fetches detailed type information for multiple types
 */
export const fetchTypeDetails = async (typeUrls) => {
  const promises = typeUrls.map((url) => axios.get(url).then((res) => res.data));
  return Promise.all(promises);
};
