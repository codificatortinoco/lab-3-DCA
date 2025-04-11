import { Pokemon } from '../types';
import { fetchPokemon } from '../services';

class PokemonsContainer extends HTMLElement {
    private pokemons: Pokemon[] = [];
    private selectedPokemon: Pokemon | null = null;
    private isLoading: boolean = true;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        this.render(); // Initial render with loading state
        await this.loadPokemons();
        this.setupEventListeners();
    }

    private setupEventListeners() {
        this.shadowRoot?.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const card = target.closest('.pokemon-card');
            if (card) {
                const pokemonId = card.getAttribute('data-pokemon-id');
                this.selectedPokemon = this.pokemons.find(p => p.id.toString() === pokemonId) || null;
                this.render();
            }

            if (target.classList.contains('modal-overlay') || target.classList.contains('close-button')) {
                this.selectedPokemon = null;
                this.render();
            }
        });
    }

    async loadPokemons(): Promise<void> {
        try {
            this.isLoading = true;
            this.render();
            
            const randomIds = Array.from({ length: 10 }, () => 
                Math.floor(Math.random() * 1000) + 1
            );
            
            const pokemonPromises = randomIds.map(id => fetchPokemon(id));
            this.pokemons = await Promise.all(pokemonPromises);
            
            this.isLoading = false;
            this.render();
        } catch (error) {
            console.error("Error loading pokemons:", error);
            this.isLoading = false;
            this.render();
        }
    }
    
    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
             <style>
                .container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    padding: 20px;
                }
                .pokemon-card {
                    background: white;
                    border-radius: 15px;
                    padding: 20px;
                    text-align: center;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                    cursor: pointer;
                    transition: transform 0.3s ease;
                }
                .pokemon-card:hover {
                    transform: translateY(-5px);
                }
                .pokemon-card img {
                    width: 120px;
                    height: 120px;
                }
                .loading {
                    text-align: center;
                    padding: 2rem;
                    font-size: 1.2rem;
                    color: #666;
                }
                .error {
                    text-align: center;
                    padding: 2rem;
                    color: #ff6b6b;
                }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    padding: 30px;
                    border-radius: 20px;
                    max-width: 500px;
                    width: 90%;
                    position: relative;
                    animation: modalIn 0.3s ease-out;
                }
                .close-button {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 5px;
                }
                .modal-image {
                    width: 200px;
                    height: 200px;
                }
                .stats-container {
                    margin-top: 20px;
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 15px;
                }
                .stats-grid {
                    display: grid;
                    gap: 15px;
                    margin-top: 10px;
                }
                .stat-item {
                    display: grid;
                    grid-template-columns: 120px 1fr;
                    align-items: center;
                    gap: 15px;
                }
                .stat-name {
                    text-transform: capitalize;
                    font-weight: bold;
                    color: #333;
                }
                .stat-bar {
                    background: #e9ecef;
                    border-radius: 10px;
                    height: 20px;
                    overflow: hidden;
                    position: relative;
                }
                .stat-fill {
                    background: linear-gradient(90deg, #ff6b6b, #ff8787);
                    height: 100%;
                    display: flex;
                    align-items: center;
                    padding-left: 8px;
                    color: white;
                    font-size: 12px;
                    transition: width 0.3s ease;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
                }
                .modal-header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .modal-header img {
                    width: 180px;
                    height: 180px;
                    margin-bottom: 10px;
                }
                .pokemon-info {
                    margin: 15px 0;
                    padding: 10px;
                    background: #f8f9fa;
                    border-radius: 10px;
                    text-align: center;
                }
                @keyframes modalIn {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .pokemon-type {
                    display: inline-block;
                    padding: 4px 8px;
                    margin: 2px;
                    border-radius: 12px;
                    font-size: 0.9em;
                    color: white;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                }
            </style>


            ${this.isLoading ? 
                `<div class="loading">Loading Pokémon...</div>` :
                !this.pokemons.length ? 
                    `<div class="error">No Pokémon found. Please try again.</div>` :
                    `<div class="container">
                        ${this.pokemons.map(pokemon => pokemon ? `
                            <div class="pokemon-card" data-pokemon-id="${pokemon.id}">
                                <img src="${pokemon.sprites.front_default || ''}" alt="${pokemon.name}">
                                <h3>${pokemon.name.toUpperCase()}</h3>
                                <div>
                                    ${pokemon.types.map(type => `
                                        <span class="pokemon-type" style="background-color: ${this.getTypeColor(type.type.name)}">
                                            ${type.type.name}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                        ` : '').join('')}
                    </div>`
            }

            ${this.selectedPokemon ? `
                <div class="modal-overlay">
                    <div class="modal-content">
                        <button class="close-button">&times;</button>
                        
                        <div class="modal-header">
                            <img src="${this.selectedPokemon.sprites.front_default || ''}" 
                                 alt="${this.selectedPokemon.name}">
                            <h2>${this.selectedPokemon.name.toUpperCase()}</h2>
                            <div>
                                ${this.selectedPokemon.types.map(type => `
                                    <span class="pokemon-type" style="background-color: ${this.getTypeColor(type.type.name)}">
                                        ${type.type.name}
                                    </span>
                                `).join('')}
                            </div>
                        </div>

                        <div class="pokemon-info">
                            <p><strong>Height:</strong> ${this.selectedPokemon.height/10}m | <strong>Weight:</strong> ${this.selectedPokemon.weight/10}kg</p>
                        </div>

                        <div class="stats-container">
                            <h3>Base Stats</h3>
                            <div class="stats-grid">
                                ${this.selectedPokemon.stats.map(stat => `
                                    <div class="stat-item">
                                        <div class="stat-name">${stat.stat.name}</div>
                                        <div class="stat-bar">
                                            <div class="stat-fill" style="width: ${(stat.base_stat/255)*100}%;">
                                                ${stat.base_stat}
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            ` : ''}
        `;
    }

    private getTypeColor(type: string): string {
        const typeColors: { [key: string]: string } = {
            normal: '#A8A878',
            fire: '#F08030',
            water: '#6890F0',
            electric: '#F8D030',
            grass: '#78C850',
            ice: '#98D8D8',
            fighting: '#C03028',
            poison: '#A040A0',
            ground: '#E0C068',
            flying: '#A890F0',
            psychic: '#F85888',
            bug: '#A8B820',
            rock: '#B8A038',
            ghost: '#705898',
            dragon: '#7038F8',
            dark: '#705848',
            steel: '#B8B8D0',
            fairy: '#EE99AC'
        };
        return typeColors[type] || '#888888';
    }
}

export default PokemonsContainer; 