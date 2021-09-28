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

  currentCount: number = 0 ;
  count: number = 0;
  next: any;
  previous: any;

  ngOnInit(): void {

    this.pokeService.listPokemon(null, null).subscribe(
      result => {
        if (result) {
          this.loader(result);
          this.currentCount = 20;
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
            this.currentCount += 20;
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
            this.currentCount -= 20;
          }
        }
      )
    }
  }

  viewDetails(pokeId: string, index: number) {
    this.pokeService.viewPokemon(pokeId).subscribe(
      result => {
        if (result) {
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

  viewChain(chain: Chain) {
    const tokens = chain.url.split('/');
    const pokemonId = tokens?.[6];
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
                      const chain = new Chain();
                      chain.name = evolutionResult.chain?.species?.name;
                      chain.url = evolutionResult.chain?.species?.url;
                      this.evolutionChain[chainId].push(chain);

                      if (evolutionResult.chain?.evolves_to) {
                        this.loadChains(chainId, evolutionResult.chain.evolves_to);
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

  private loadChains(chainId: any, evolvesTo: any) {
    for (const evolve of evolvesTo) {
      const chain = new Chain();
      chain.name = evolve?.species?.name;
      chain.url = evolve?.species?.url;
      this.evolutionChain[chainId].push(chain);

      if (evolvesTo?.length > 0 && evolvesTo[0].evolves_to) {
        this.loadChains(chainId, evolvesTo[0].evolves_to);
      }
    }
  }

  private loader(result: any) {
    this.count = result.count;
    this.next = result.next
    this.previous = result.previous

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
