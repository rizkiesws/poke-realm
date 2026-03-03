import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2";

/**
 * Fetches a paginated list of moves
 */
export const fetchMoveList = async (limit = 20, offset = 0) => {
  const response = await axios.get(`${BASE_URL}/move?limit=${limit}&offset=${offset}`);
  return response.data;
};

/**
 * Fetches all available Pokémon moves
 */
export const fetchAllMoves = async () => {
  const response = await axios.get(`${BASE_URL}/move?limit=1000`);
  return response.data.results;
};

/**
 * Fetches detailed information about a specific move
 */
export const fetchMoveDetail = async (name) => {
  const response = await axios.get(`${BASE_URL}/move/${name}`);
  return response.data;
};
