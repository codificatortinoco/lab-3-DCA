import { Pokemon } from './types';

export async function fetchPokemon(nameOrId: string | number): Promise<Pokemon> {
    const url = `https://pokeapi.co/api/v2/pokemon/${nameOrId}`;

    const response = await fetch(url);
    if (!response.ok) {
    throw new Error(`Failed to fetch Pokémon: ${response.statusText}`);
    }

    const data: Pokemon = await response.json();
    return data;
}
