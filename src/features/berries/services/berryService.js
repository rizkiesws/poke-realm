import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2";

/**
 * Fetches a paginated list of berries
 */
export const fetchBerryList = async (limit = 20, offset = 0) => {
  const response = await axios.get(`${BASE_URL}/berry?limit=${limit}&offset=${offset}`);
  return response.data;
};

/**
 * Fetches all available Pokémon berries
 */
export const fetchAllBerries = async () => {
  const response = await axios.get(`${BASE_URL}/berry?limit=150`);
  return response.data.results;
};

/**
 * Fetches detailed information about a specific berry
 */
export const fetchBerryDetail = async (name) => {
  const response = await axios.get(`${BASE_URL}/berry/${name}`);
  return response.data;
};
