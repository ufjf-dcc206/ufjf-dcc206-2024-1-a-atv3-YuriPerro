const pokemonCardTemplate = document.createElement('template');

pokemonCardTemplate.innerHTML = `
    <style>
        .card {
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 10px;
            margin: 10px;
            width: 200px;
            display: inline-block;
        }
        .card img {
            width: 100%;
        }
    </style>

    <div class="card">
        <h3>Bubassauro</h3>
        <img />
    </div>
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
