import { fetchPokemonDetails, fetchPokemonList } from './services/api';
import { PokemonDetails, PokemonRaw } from './services/types';

let currentPlayerTurn = 1;
let selectedPokemons: PokemonDetails[] = [];

const onSelectPokemon = (pokemon: PokemonDetails) => {
  const playerOnePlaceholder = document.getElementById('player-one-placeholder');
  const playerTwoPlaceholder = document.getElementById('player-two-placeholder');

  // Check if the corresponding placeholder is empty
  if (currentPlayerTurn === 1 && playerOnePlaceholder?.innerHTML.trim() !== 'Card player One') {
    alert('Player One has already selected a Pokémon!');
    return; // Prevent selection if the placeholder is not empty
  } else if (
    currentPlayerTurn === 2 &&
    playerTwoPlaceholder?.innerHTML.trim() !== 'Card player Two'
  ) {
    alert('Player Two has already selected a Pokémon!');
    return; // Prevent selection if the placeholder is not empty
  }

  // Proceed with selection if the placeholder is empty
  if (currentPlayerTurn === 1) {
    selectedPokemons = [...selectedPokemons, pokemon];
    currentPlayerTurn = 2;
    updatePlaceholder('player-one-placeholder', pokemon);
  } else if (currentPlayerTurn === 2) {
    selectedPokemons = [...selectedPokemons, pokemon];
    currentPlayerTurn = 1;
    updatePlaceholder('player-two-placeholder', pokemon);
  }

  // Update player indicators
  updatePlayerIndicators();

  // Enable the battle button if two Pokémon are selected
  const battleButton = document.getElementById('battle-button') as HTMLButtonElement;
  if (selectedPokemons.length === 2) {
    battleButton.disabled = false; // Enable the button
  }
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

    // Add click event to remove the Pokémon from the placeholder
    cardElement.addEventListener('click', () => {
      removePokemonFromPlaceholder(placeholderId, pokemon);
    });

    placeholderElement.appendChild(cardElement);
  }
};

const removePokemonFromPlaceholder = (placeholderId: string, pokemon: PokemonDetails) => {
  const placeholderElement = document.getElementById(placeholderId);
  if (placeholderElement) {
    placeholderElement.innerHTML = ''; // Clear the placeholder
    selectedPokemons = selectedPokemons.filter((p) => p !== pokemon); // Remove from selectedPokemons

    // Disable the battle button if less than 2 Pokémon are selected
    const battleButton = document.getElementById('battle-button') as HTMLButtonElement;
    if (selectedPokemons.length < 2) {
      battleButton.disabled = true; // Disable the button
    }
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
    } else {
      alert('Draw');
    }

    // Clear the placeholders after the game ends
    clearPlaceholders();

    selectedPokemons = [];

    // Disable the battle button again
    const battleButton = document.getElementById('battle-button') as HTMLButtonElement;
    battleButton.disabled = true; // Disable the button
  }
};

const clearPlaceholders = () => {
  const playerOnePlaceholder = document.getElementById('player-one-placeholder');
  const playerTwoPlaceholder = document.getElementById('player-two-placeholder');

  if (playerOnePlaceholder) {
    playerOnePlaceholder.innerHTML = 'Card player One'; // Reset to initial text
  }
  if (playerTwoPlaceholder) {
    playerTwoPlaceholder.innerHTML = 'Card player Two'; // Reset to initial text
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
};

const battleButton = document.getElementById('battle-button') as HTMLButtonElement;
battleButton.addEventListener('click', () => {
  checkWinner();
});

const updatePlayerIndicators = () => {
  const playerOneIndicator = document.getElementById('player-one-indicator');
  const playerTwoIndicator = document.getElementById('player-two-indicator');

  if (!playerOneIndicator || !playerTwoIndicator) {
    throw new Error('Player indicators not found');
  }

  if (currentPlayerTurn === 1) {
    playerOneIndicator.classList.add('active');
    playerOneIndicator.classList.remove('inactive');
    playerTwoIndicator.classList.remove('active');
    playerTwoIndicator.classList.add('inactive');
  } else {
    playerTwoIndicator.classList.add('active');
    playerTwoIndicator.classList.remove('inactive');
    playerOneIndicator.classList.remove('active');
    playerOneIndicator.classList.add('inactive');
  }
};

init();
