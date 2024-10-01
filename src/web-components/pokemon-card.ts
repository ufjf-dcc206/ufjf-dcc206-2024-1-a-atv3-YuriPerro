const pokemonCardTemplate = document.createElement('template');

pokemonCardTemplate.innerHTML = `
    <style>
      a {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 10px;
        margin: 10px;
        width: 180px;
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        text-decoration: none;
        flex-direction: column;
        background: linear-gradient(45deg, #8888883a 0%, #2f2f2f36 100%);
        box-sizing: border-box;
      }
      a:hover {
        border: 3px solid #ff005d;
        transition: border 0.3s ease;
      }
      .pokemon-name {
        font-size: 0.85rem;
        font-weight: bold;
        text-align: center;
        font-family: 'Roboto', sans-serif;
        margin: 0;
      }
      .name-container {
        background-color: #08080854;
        border-radius: 6px;
        padding-left: 20px;
        padding-right: 20px;
        padding-top: 5px;
        padding-bottom: 5px;
        margin-top: 20px;
      }
      .pokemon-types-container {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 10px;
      }
      .container-type {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #ff005d;
        border-radius: 100px;
        padding-left: 10px;
        padding-right: 10px;
      }
      .pokemon-type {
        color: white;
        padding: 5px;
        font-size: 0.7rem;
        font-weight: bold;
        font-family: 'Roboto', sans-serif;
      }
    </style>

    <a class="pokemon-card">
      <slot name="pokemon-image"></slot>
      <div class="name-container">
        <slot name="pokemon-name" class="pokemon-name"></slot>
      </div>

      <div class="pokemon-types-container">
        <div class="container-type">
          <slot name="pokemon-type" class="pokemon-type"></slot>
        </div>
      </div>
    </a>
`;

export class PokemonCard extends HTMLElement {
  shadowRoot: ShadowRoot | null;

  constructor() {
    super();

    this.shadowRoot = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const clonedCardElement = pokemonCardTemplate.content.cloneNode(true);

    if (this.shadowRoot === null) return;
    this.shadowRoot.append(clonedCardElement);
  }
}

customElements.define('pokemon-card', PokemonCard);
