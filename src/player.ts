import { PokemonDetails } from './services/types';

export class Player {
  _name: string;
  _pokemons: PokemonDetails[] = [];

  constructor(name: string) {
    this._name = name;
  }

  public addPokemon(pokemon: PokemonDetails) {
    this.pokemons.push(pokemon);
  }

  public removePokemon(pokemon: PokemonDetails) {
    this._pokemons = this.pokemons.filter((p: PokemonDetails) => p !== pokemon);
  }

  public get name(): string {
    return this.name;
  }

  public get pokemons(): PokemonDetails[] {
    return this.pokemons;
  }
}
