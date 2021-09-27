import { Component, OnInit } from '@angular/core';
import {PokeapiService} from "../services/pokeapi.service";
import {Pokemon} from "../models/pokemon";
import {Chain} from "../models/chain";

@Component({
  selector: 'app-lister',
  templateUrl: './lister.component.html',
  styleUrls: ['./lister.component.css']
})
export class ListerComponent implements OnInit {

  constructor(private pokeService: PokeapiService) { }

  pokemonList: Pokemon[] = [];

  evolutionChain: any[] =[];

  count = '';
  next: any;
  previous: any;

  currentDetailsView = -1;
  currentEvolutionView = -1;

  ngOnInit(): void {

    this.pokeService.listPokemon(null, null).subscribe(
      result => {
        if (result) {
          this.loader(result);
        }
      });
  }

  nextPage() {
    if (this.next) {
      this.pokemonList = [];
      this.pokeService.listPokemon(this.next, null).subscribe(
        result => {
          if (result) {
            this.loader(result);
          }
        }
      )
    }
  }

  previousPage() {
    if (this.previous) {
      this.pokemonList = [];
      this.pokeService.listPokemon(null,this.previous).subscribe(
        result => {
          if (result) {
            this.loader(result);
          }
        }
      )
    }
  }

  viewDetails(pokeId: string, index: number) {
    this.currentEvolutionView = -1;
    if (this.currentDetailsView === index) {
      this.currentDetailsView = -1;
    }
    else {
      this.pokeService.viewPokemon(pokeId).subscribe(
        result => {
          if (result) {
            this.currentDetailsView = index;
            const pokemonDetail = this.pokemonList[index];
            pokemonDetail.speciesUrl = result.species?.url;
            pokemonDetail.speciesName = result.species?.name;
            pokemonDetail.artUrl = result.sprites?.other?.dream_world?.front_default;

            if (pokemonDetail.speciesUrl) {
              this.loadEvolution(pokemonDetail);
            }
          }
        })
    }
  }

  viewChain(chain: Chain, index: number) {
    if (this.currentEvolutionView === index ) {
      this.currentEvolutionView = -1;
    }
    else {
      const tokens = chain.url.split('/');
      const pokemonId = tokens?.[6];
      this.currentEvolutionView = index;
      for (const pokemon of this.pokemonList) {
        if (pokemon.id === pokemonId) {
          chain.pokemon = pokemon;
          break;
        }
      }
      if (!chain.pokemon || !chain.pokemon.artUrl) {
        this.pokeService.viewPokemon(pokemonId).subscribe(
          result => {
            if (result) {
              chain.pokemon.speciesUrl = result.species?.url;
              chain.pokemon.speciesName = result.species?.name;
              chain.pokemon.artUrl = result.sprites?.other?.dream_world?.front_default;
              this.loadEvolution(chain.pokemon);
            }
          })
      }
    }

  }

  // ========== private functions ===========

  private loadEvolution(pokemonDetail: Pokemon) {
    this.pokeService.viewSpecies(pokemonDetail.speciesUrl).subscribe(
      speciesResult => {
        if (speciesResult) {

          const tokens = speciesResult.evolution_chain?.url.split('/');
          const chainId = tokens?.[6];

          if(chainId) {

            if (this.evolutionChain[chainId]) {
              pokemonDetail.evolutionChain = this.evolutionChain[chainId];
            }
            else {
              if (speciesResult.evolution_chain?.url) {

                this.pokeService.viewEvolution(speciesResult.evolution_chain.url).subscribe(
                  evolutionResult => {
                    if (evolutionResult) {
                      this.evolutionChain[chainId] = [];
                      if (pokemonDetail.name !== evolutionResult.chain?.species?.name) {
                        const chain = new Chain();
                        chain.name = evolutionResult.chain?.species?.name;
                        chain.url = evolutionResult.chain?.species?.url;
                        this.evolutionChain[chainId].push(chain);
                      }
                      if (evolutionResult.chain?.evolves_to) {
                        this.loadChains(chainId, evolutionResult.chain.evolves_to, pokemonDetail);
                      }
                      pokemonDetail.evolutionChain = this.evolutionChain[chainId];
                    }
                  })
              }
            }
          }
        }
      })
  }

  private loadChains(chainId: any, evolvesTo: any, pokemon: Pokemon) {
    for (const evolve of evolvesTo) {
      if (pokemon.name !== evolve?.species?.name) {
        const chain = new Chain();
        chain.name = evolve?.species?.name;
        chain.url = evolve?.species?.url;
        this.evolutionChain[chainId].push(chain);
      }
      if (evolvesTo?.length > 0 && evolvesTo[0].evolves_to) {
        this.loadChains(chainId, evolvesTo[0].evolves_to, pokemon);
      }
    }
  }

  private loader(result: any) {
    if (result.count) {
      this.count = result.count;
    }
    if (result.next) {
      this.next = result.next
    }
    if (result.previous) {
      this.previous = result.previous
    }
    if (result.results?.length > 0) {
      for (const pokemon of result.results) {
        const tokens = pokemon.url.split('/');
        if (tokens?.[6]) {
          pokemon.id = tokens[6];
        }
        this.pokemonList.push(pokemon)
      }
    }
  }
}
