import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2";

/**
 * Fetches a paginated list of items for infinite scroll
 */
export const fetchItemList = async (limit = 20, offset = 0) => {
  try {
    const response = await axios.get(`${BASE_URL}/item?limit=${limit}&offset=${offset}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching item list:", error);
    throw error;
  }
};

/**
 * Fetches detailed information about a specific item
 */
export const fetchItemDetail = async (name) => {
  try {
    const response = await axios.get(`${BASE_URL}/item/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching detail for item ${name}:`, error);
    throw error;
  }
};

/**
 * Fetches all available Pokémon items for search functionality
 */
export const fetchAllItems = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/item?limit=2000`);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching all items:", error);
    throw error;
  }
};
