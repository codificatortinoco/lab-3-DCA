
import { Pokemon } from '../src/types';
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
    }
  }

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  connectedCallback() {
    this.render()
  }

  render() {
    if (!this.shadowRoot) return;
    
    this.shadowRoot.innerHTML = `
      <div class="pokemon-card">
        <img src="${this.sprite}" alt="Sprite of ${this.name}" />
        <p><strong>${this.name}</strong></p>
        <p>Types: ${this.types}</p>
        <p>Height: ${this.height} | Weight: ${this.weight}</p>
        <div class="stats">
          ${this.stats}
        </div>
      </div>
    `
  }
}

export default PokemonsCards;