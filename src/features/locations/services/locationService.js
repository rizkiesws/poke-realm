import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2";

export const fetchLocationList = async (limit = 20, offset = 0) => {
  const response = await axios.get(`${BASE_URL}/location?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const fetchAllLocations = async () => {
  const response = await axios.get(`${BASE_URL}/location?limit=1000`); 
  return response.data.results;
};

export const fetchLocationDetail = async (name) => {
  const response = await axios.get(`${BASE_URL}/location/${name}`);
  return response.data;
};