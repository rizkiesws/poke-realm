import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2";

// --- MENGAMBIL DAFTAR ITEMS (Untuk Infinite Scroll) ---
export const fetchItemList = async (limit = 20, offset = 0) => {
  try {
    const response = await axios.get(`${BASE_URL}/item?limit=${limit}&offset=${offset}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching item list:", error);
    throw error; // Lempar error agar bisa ditangkap oleh React Query
  }
};

// --- MENGAMBIL DETAIL ITEM (Nanti dipakai buat Modal/Popup) ---
export const fetchItemDetail = async (name) => {
  try {
    const response = await axios.get(`${BASE_URL}/item/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching detail for item ${name}:`, error);
    throw error;
  }
};

export const fetchAllItems = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/item?limit=2000`);
    return response.data.results;
  } catch (error) {
    console.error("Error fetching all items:", error);
    throw error;
  }
};