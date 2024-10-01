import { fetchPokemonDetails, fetchPokemonList } from './services/api';
import { PokemonDetails, PokemonRaw } from './services/types';

let currentPlayerTurn = 1;
let playerOnePokemons: PokemonDetails[] = [];
let playerTwoPokemons: PokemonDetails[] = [];
let selectedPokemons: PokemonDetails[] = [];

const onSelectPokemon = (pokemon: PokemonDetails) => {
  if (currentPlayerTurn === 1) {
    selectedPokemons = [...selectedPokemons, pokemon];
    currentPlayerTurn = 2;
    updatePlaceholder('player-one-placeholder', pokemon);
  } else if (currentPlayerTurn === 2) {
    selectedPokemons = [...selectedPokemons, pokemon];
    currentPlayerTurn = 1;
    updatePlaceholder('player-two-placeholder', pokemon);
  }

  checkWinner();
};

const updatePlaceholder = (placeholderId: string, pokemon: PokemonDetails) => {
  const placeholderElement = document.getElementById(placeholderId);
  if (placeholderElement) {
    placeholderElement.innerHTML = ''; // Clear previous content
    const cardElement = document.createElement('pokemon-card');
    const cardNameElement = document.createElement('p');
    const cardImgElement = document.createElement('img');

    cardImgElement.slot = 'pokemon-image';
    cardNameElement.slot = 'pokemon-name';

    cardNameElement.textContent = pokemon.name;
    cardImgElement.src = pokemon.sprites.front_default;
    cardImgElement.alt = pokemon.name;

    cardElement.appendChild(cardNameElement);
    cardElement.appendChild(cardImgElement);

    placeholderElement.appendChild(cardElement);
  }
};

const checkWinner = () => {
  if (selectedPokemons.length === 2) {
    const playerOneAttack = selectedPokemons[0].stats.reduce(
      (acc, stat) => acc + stat.base_stat,
      0
    );

    const playerTwoAttack = selectedPokemons[1].stats.reduce(
      (acc, stat) => acc + stat.base_stat,
      0
    );

    if (playerOneAttack > playerTwoAttack) {
      alert('Player one wins');
    } else if (playerOneAttack < playerTwoAttack) {
      alert('Player two wins');
    } else alert('Draw');

    selectedPokemons = [];
  }
};

const fillCardsPlayer = (
  playerCardsZoneElement: HTMLElement,
  preparedPokemons: PokemonDetails[]
) => {
  preparedPokemons.forEach((pokemon) => {
    const cardElement = document.createElement('pokemon-card');
    const cardNameElement = document.createElement('p');
    const cardImgElement = document.createElement('img');

    cardImgElement.slot = 'pokemon-image';
    cardNameElement.slot = 'pokemon-name';

    cardNameElement.textContent = pokemon.name;
    cardImgElement.src = pokemon.sprites.front_default;
    cardImgElement.alt = pokemon.name;

    pokemon.types.forEach((type) => {
      const cardTypesElement = document.createElement('span');
      cardTypesElement.slot = 'pokemon-type';
      cardTypesElement.textContent = type.type.name;
      cardElement.appendChild(cardTypesElement);
    });

    cardElement.appendChild(cardNameElement);
    cardElement.appendChild(cardImgElement);

    cardElement.addEventListener('click', () => {
      onSelectPokemon(pokemon);
    });

    playerCardsZoneElement?.appendChild(cardElement);
  });
};

const preparePokemonDetails = async (pokemonList: PokemonRaw[]) => {
  const mappedUrls = pokemonList.map((pokemon) => pokemon.url);
  const pokemonDetails = await Promise.all(mappedUrls.map(fetchPokemonDetails));

  return pokemonDetails;
};

const init = async () => {
  const pokemonList = await fetchPokemonList(10);

  const preparedPokemons = await preparePokemonDetails(pokemonList.results);
  const pokemonsPlayerOne = preparedPokemons.slice(0, 5);
  const pokemonsPlayerTwo = preparedPokemons.slice(5, 10);

  const playerCardsZoneElementOne = document.getElementById('player-card-zone-1');
  const playerCardsZoneElementTwo = document.getElementById('player-card-zone-2');

  if (!playerCardsZoneElementOne || !playerCardsZoneElementTwo) {
    throw new Error('Player card zone not found');
  }

  fillCardsPlayer(playerCardsZoneElementOne, pokemonsPlayerOne);
  fillCardsPlayer(playerCardsZoneElementTwo, pokemonsPlayerTwo);

  playerOnePokemons = pokemonsPlayerOne;
  playerTwoPokemons = pokemonsPlayerTwo;
};

init();
