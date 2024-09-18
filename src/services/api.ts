import { PokemonDetails, PokemonRaw } from './types';

const baseURL = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(numberOfPokemon = 1) {
  const response = await fetch(`${baseURL}/pokemon?limit=${numberOfPokemon}`);
  const data = (await response.json()) as { results: PokemonRaw[] };

  return data;
}

export async function fetchPokemonDetails(url: string) {
  const response = await fetch(url);
  const data = (await response.json()) as PokemonDetails;

  return data;
}
