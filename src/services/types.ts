export type PokemonRaw = {
  name: string;
  url: string;
};

export type PokemonDetails = {
  name: string;
  id: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  stats: {
    base_stat: number;
  }[];
};
