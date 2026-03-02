import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2";

export const fetchMachineList = async (limit = 20, offset = 0) => {
  const response = await axios.get(`${BASE_URL}/machine?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const fetchAllMachines = async () => {
  // Total machine ada sekitar 1600-an
  const response = await axios.get(`${BASE_URL}/machine?limit=2000`); 
  return response.data.results;
};

export const fetchMachineDetail = async (id) => {
  const response = await axios.get(`${BASE_URL}/machine/${id}`);
  return response.data;
};