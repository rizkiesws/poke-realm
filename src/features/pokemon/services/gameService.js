// Pokémon ID pools for different game modes
const STARTER_IDS = [
  1, 4, 7, 152, 155, 158, 252, 255, 258, 387, 390, 393, 495, 498, 501, 650, 653, 656, 722, 725, 728, 810, 813, 815, 906,
  909, 912,
];
const LEGENDARY_IDS = [
  144, 145, 146, 150, 151, 243, 244, 245, 249, 250, 251, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386,
];
const INSANE_RANGE = [1, 1025];

/**
 * Pokémon generation ID ranges for game mode selection
 */
export const genRanges = {
  "Gen 1 (Kanto)": [1, 151],
  "Gen 2 (Johto)": [152, 251],
  "Gen 3 (Hoenn)": [252, 386],
  "Gen 4 (Sinnoh)": [387, 493],
  "Gen 5 (Unova)": [494, 649],
  "Gen 6 (Kalos)": [650, 721],
  "Gen 7 (Alola)": [722, 809],
  "Gen 8 (Galar)": [810, 905],
  "Gen 9 (Paldea)": [906, 1025],
};

/**
 * Generates a quiz round with target Pokémon and multiple choice options
 * Selects 4 random Pokémon and shuffles them as options
 */
export const fetchQuizRound = async ({ queryKey }) => {
  const [_, mode] = queryKey;
  let pool = [];
  let min, max;

  if (mode === "starters") pool = STARTER_IDS;
  else if (mode === "legendary") pool = LEGENDARY_IDS;
  else if (mode === "insane") [min, max] = INSANE_RANGE;
  else [min, max] = genRanges[mode] || genRanges["Gen 1 (Kanto)"];

  const ids = new Set();
  while (ids.size < 4) {
    if (pool.length > 0) ids.add(pool[Math.floor(Math.random() * pool.length)]);
    else ids.add(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  const idArray = Array.from(ids);

  const promises = idArray.map((id) => fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()));
  const results = await Promise.all(promises);

  const target = results[0];
  const options = results.map((r) => r.name).sort(() => Math.random() - 0.5);

  return { target, options };
};
