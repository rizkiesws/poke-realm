import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2";

export const fetchMoveList = async (limit = 20, offset = 0) => {
  const response = await axios.get(`${BASE_URL}/move?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const fetchAllMoves = async () => {
  const response = await axios.get(`${BASE_URL}/move?limit=1000`); // Total moves sekitar 900-an
  return response.data.results;
};

export const fetchMoveDetail = async (name) => {
  const response = await axios.get(`${BASE_URL}/move/${name}`);
  return response.data;
};