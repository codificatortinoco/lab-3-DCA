import { Pokemon } from '../src/types';
import { fetchPokemon } from './services';

class PokemonsContainer extends HTMLElement {
    private pokemons: Pokemon[] = [];

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        console.log("Pokemon Container component mounted.");
        await this.loadPokemons();
    }

    async loadPokemons(): Promise<void> {
        try {
            const randomIds = Array.from({ length: 10 }, () => 
                Math.floor(Math.random() * 1000) + 1
            );
            
            const pokemonPromises = randomIds.map(id => fetchPokemon(id));
            this.pokemons = await Promise.all(pokemonPromises);
            this.render();
        } catch (error) {
            console.error("Error loading pokemons:", error);
        }
    }
    
    render() {
        console.log("Rendering pokemons:", this.pokemons);
        if (!this.shadowRoot) return;
        this.shadowRoot.innerHTML = `
            <div>
                ${this.pokemons.length > 0
                    ? this.pokemons.map(
                        (pokemon) => `
                            <div class="pokemon-card">
                                <img src="${pokemon.sprites.front_default}" alt="Sprite of ${pokemon.name}" />
                                <p><strong>${pokemon.name}</strong></p>
                                <p>Types: ${pokemon.types.map(type => type.type.name).join(', ')}</p>
                                <p>Height: ${pokemon.height} | Weight: ${pokemon.weight}</p>
                                <div class="stats">
                                    ${pokemon.stats.map(stat => 
                                        `<span>${stat.stat.name}: ${stat.base_stat}</span>`
                                    ).join('')}
                                </div>
                            </div>`
                    ).join("")
                    : "<p>No Pokemon loaded yet.</p>"}
            </div>
        `;
    }
}

export default PokemonsContainer;