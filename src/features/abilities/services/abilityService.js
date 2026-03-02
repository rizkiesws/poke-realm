import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2";

export const fetchAbilityList = async (limit = 20, offset = 0) => {
  const response = await axios.get(`${BASE_URL}/ability?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const fetchAllAbilities = async () => {
  // Total ability di Pokemon ada sekitar 300-an
  const response = await axios.get(`${BASE_URL}/ability?limit=400`); 
  return response.data.results;
};

export const fetchAbilityDetail = async (name) => {
  const response = await axios.get(`${BASE_URL}/ability/${name}`);
  return response.data;
};