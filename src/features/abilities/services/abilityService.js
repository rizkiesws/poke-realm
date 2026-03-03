import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2";

/**
 * Fetches a paginated list of abilities
 */
export const fetchAbilityList = async (limit = 20, offset = 0) => {
  const response = await axios.get(`${BASE_URL}/ability?limit=${limit}&offset=${offset}`);
  return response.data;
};

/**
 * Fetches all Pokémon abilities
 */
export const fetchAllAbilities = async () => {
  const response = await axios.get(`${BASE_URL}/ability?limit=400`);
  return response.data.results;
};

/**
 * Fetches detailed information about a specific ability
 */
export const fetchAbilityDetail = async (name) => {
  const response = await axios.get(`${BASE_URL}/ability/${name}`);
  return response.data;
};
