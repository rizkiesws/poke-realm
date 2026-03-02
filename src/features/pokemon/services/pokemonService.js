import axios from "axios";

const BASE_URL = "https://pokeapi.co/api/v2";

// 1. Mengambil list Pokemon dengan pagination
export const fetchPokemonList = async (limit = 20, offset = 0) => {
  const response = await axios.get(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  return response.data;
};

// 2. Mengambil detail lengkap Pokemon (termasuk species)
export const fetchPokemonDetail = async (name) => {
  const [pokemonRes, speciesRes] = await Promise.all([
    axios.get(`${BASE_URL}/pokemon/${name}`),
    axios.get(`${BASE_URL}/pokemon-species/${name}`)
  ]);

  return {
    ...pokemonRes.data,
    species: speciesRes.data,
  };
};

// 3. Mengambil daftar semua Tipe Pokemon
export const fetchTypes = async () => {
  const response = await axios.get(`${BASE_URL}/type`);
  return response.data.results;
};

// 4. Mengambil list Pokemon berdasarkan Tipe yang dipilih
export const fetchPokemonByType = async (type) => {
  const response = await axios.get(`${BASE_URL}/type/${type}`);
  return response.data.pokemon.map((p) => p.pokemon);
};

// 5. Mengambil rantai evolusi (Silsilah) Pokemon
export const fetchEvolutionChain = async (pokemonName) => {
  try {
    const speciesRes = await axios.get(`${BASE_URL}/pokemon-species/${pokemonName}`);
    const evolutionUrl = speciesRes.data.evolution_chain.url;

    // Pakai axios langsung karena evolutionUrl sudah berupa URL lengkap dari API
    const evolutionRes = await axios.get(evolutionUrl);
    return evolutionRes.data.chain;
  } catch (error) {
    console.error("Gagal mengambil data evolusi:", error);
    return null;
  }
};

// 6. Mengambil SEMUA nama Pokemon untuk fitur Live Search
export const fetchAllPokemon = async () => {
  // Pakai limit 10000 untuk memastikan semua varian/mega evolution ikut ketarik
  const response = await axios.get(`${BASE_URL}/pokemon?limit=10000`);
  return response.data.results;
};

// 7. Mengambil data lokasi Pokemon berdasarkan ID
export const fetchPokemonEncounters = async (id) => {
  const response = await axios.get(`${BASE_URL}/pokemon/${id}/encounters`);
  return response.data;
};

// 8. Mengambil detail mendalam dari beberapa Tipe (menggunakan array URL)
export const fetchTypeDetails = async (typeUrls) => {
  const promises = typeUrls.map(url => axios.get(url).then(res => res.data));
  return Promise.all(promises);
};