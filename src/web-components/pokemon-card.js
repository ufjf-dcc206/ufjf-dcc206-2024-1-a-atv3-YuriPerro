const pokemonCardTemplate = document.createElement('template');

pokemonCardTemplate.innerHTML = `
    <style>
        a {
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 10px;
            margin: 10px;
            width: 150px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }
        a:hover {
            border-color: '#4f0aff';
            transition: background-color 0.3s;
        }
        .pokemon-name {
            font-size: 20px;
            font-weight: bold;
            text-align: center;
        }
    </style>

    <a class="pokemon-card">
        <slot name="pokemon-name"></slot>
    </a>
`;

export class PokemonCard extends HTMLElement {
  #shadow;
  constructor() {
    super();
  }

  connectedCallback() {
    this.#shadow = this.attachShadow({ mode: 'open' });

    const clonedCardElement = pokemonCardTemplate.content.cloneNode(true);

    this.#shadow.append(clonedCardElement);
  }
}

customElements.define('pokemon-card', PokemonCard);
