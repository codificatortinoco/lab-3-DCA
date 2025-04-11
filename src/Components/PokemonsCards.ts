import { Pokemon } from '../types';
class PokemonsCards extends HTMLElement {
  private name: string = '';
  private sprite: string = '';
  private types: string = '';
  private height: string = '';
  private weight: string = '';
  private stats: string = '';

  static get observedAttributes() {
    return ["name", "sprite", "types", "height", "weight", "stats"]
  }

  attributeChangedCallback(prop: string, oldValue: string, newValue: string) {
    if (oldValue !== newValue) {
      switch(prop) {
        case 'name':
          this.name = newValue;
          break;
        case 'sprite':
          this.sprite = newValue;
          break;
        case 'types':
          this.types = newValue;
          break;
        case 'height':
          this.height = newValue;
          break;
        case 'weight':
          this.weight = newValue;
          break;
        case 'stats':
          this.stats = newValue;
          break;
      }
      this.render();
    }
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;
    
    // Only render if we have the required data
    if (!this.name || !this.sprite) {
      this.shadowRoot.innerHTML = ''; // Don't render anything if we don't have the basic data
      return;
    }
    
    this.shadowRoot.innerHTML = `
      <style>
        .pokemon-card {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 16px;
          margin: 16px;
          max-width: 300px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .pokemon-card img {
          width: 150px;
          height: 150px;
          object-fit: contain;
        }
        .stats {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }
      </style>

      <div class="pokemon-card">
        ${this.sprite ? `<img src="${this.sprite}" alt="Sprite of ${this.name}" />` : ''}
        ${this.name ? `<p><strong>${this.name}</strong></p>` : ''}
        ${this.types ? `<p>Types: ${this.types}</p>` : ''}
        ${this.height || this.weight ? 
          `<p>${this.height ? `Height: ${this.height}` : ''} ${this.weight ? `Weight: ${this.weight}` : ''}</p>` 
          : ''}
        ${this.stats ? `
          <div class="stats">
            ${this.stats}
          </div>
        ` : ''}
      </div>
    `;
  }
}

export default PokemonsCards;