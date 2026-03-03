import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2";

/**
 * Fetches a paginated list of TM/HM machines
 */
export const fetchMachineList = async (limit = 20, offset = 0) => {
  const response = await axios.get(`${BASE_URL}/machine?limit=${limit}&offset=${offset}`);
  return response.data;
};

/**
 * Fetches all available Pokémon machines (TMs and HMs)
 */
export const fetchAllMachines = async () => {
  const response = await axios.get(`${BASE_URL}/machine?limit=2000`);
  return response.data.results;
};

/**
 * Fetches detailed information about a specific machine
 */
export const fetchMachineDetail = async (id) => {
  const response = await axios.get(`${BASE_URL}/machine/${id}`);
  return response.data;
};
