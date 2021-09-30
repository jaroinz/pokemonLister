import { Component, OnInit } from '@angular/core';
import {PokeapiService} from "../services/pokeapi.service";
import {Pokemon} from "../models/pokemon";
import {Link} from "../models/link";

@Component({
  selector: 'app-lister',
  templateUrl: './lister.component.html',
  styleUrls: ['./lister.component.css']
})
export class ListerComponent implements OnInit {

  constructor(private pokeService: PokeapiService) { }

  pokemonList: Pokemon[] = [];

  evolutionLinks: any[] =[];

  currentCount: number = 0 ;
  count: number = 0;
  next: any;
  previous: any;

  OFFSET = 20;

  ngOnInit(): void {

    this.pokeService.retrieveListPokemon(null, null).subscribe(
      result => {
        if (result) {
          this.loader(result);
          this.currentCount = this.OFFSET;
        }
      });
  }

  nextPage() {
    if (this.next) {
      this.pokemonList = [];
      this.pokeService.retrieveListPokemon(this.next, null).subscribe(
        result => {
          if (result) {
            this.loader(result);
            this.currentCount += this.OFFSET;
          }
        }
      )
    }
  }

  previousPage() {
    if (this.previous) {
      this.pokemonList = [];
      this.pokeService.retrieveListPokemon(null,this.previous).subscribe(
        result => {
          if (result) {
            this.loader(result);
            this.currentCount -= this.OFFSET;
          }
        }
      )
    }
  }

  async viewDetails(pokeId: string, index: number) {
    const pokemonDetail = this.pokemonList[index];
    if (pokemonDetail.speciesUrl) {
      await this.loadSpecies(pokemonDetail);
    }
  }

  async viewEvolved(link: Link) {
    const tokens = link.url.split('/');
    const pokemonId = tokens?.[6];
    for (const pokemon of this.pokemonList) {
      if (pokemon.id === pokemonId) {
        link.pokemon = pokemon;
        break;
      }
    }
    if (!link.pokemon || !link.pokemon.artUrl) {
      this.pokeService.retrievePokemon(pokemonId).subscribe(
        result => {
          if (result) {
            link.pokemon.speciesUrl = result.species?.url;
            link.pokemon.speciesName = result.species?.name;
            link.pokemon.artUrl = result.sprites?.other?.dream_world?.front_default;
            this.loadSpecies(link.pokemon);
          }
        })
    }
  }

  async loadSpecies(pokemonDetail: Pokemon) {
    let speciesEvolutionLinkUrl = '';

    await this.pokeService.retrieveSpecies(pokemonDetail.speciesUrl).toPromise().then(
      speciesResult => {
        if (speciesResult) {
          speciesEvolutionLinkUrl = speciesResult.evolution_chain?.url;
        }
      });

    const tokens = speciesEvolutionLinkUrl.split('/');
    const linkId : number = +tokens?.[6];

    if(linkId) {
      if (this.evolutionLinks[linkId]) {
        pokemonDetail.evolutionLinks = this.evolutionLinks[linkId];
      }
      else {
        if (speciesEvolutionLinkUrl) {
          await this.loadEvolution(pokemonDetail, linkId, speciesEvolutionLinkUrl);
        }
      }
    }
  }

  async loadEvolution(pokemonDetail: Pokemon, linkId: number, speciesEvolutionLinkUrl: string) {
    let evolutionLinkEvolvesTo = null;
    let found = false;

    await this.pokeService.retrieveEvolution(speciesEvolutionLinkUrl).toPromise().then(
      evolutionResult => {
        if (evolutionResult) {
          this.evolutionLinks[linkId] = [];
          if (evolutionResult.chain?.evolves_to) {
            evolutionLinkEvolvesTo = evolutionResult.chain?.evolves_to;
          }
          found = true;
        }
      });
    if (evolutionLinkEvolvesTo) {
      this.loadLinks(linkId, evolutionLinkEvolvesTo);
    }
    if (found) {
      //assign evolution link
      pokemonDetail.evolutionLinks = this.evolutionLinks[linkId];
    }
  }

  loadLinks(linkId: any, evolvesTo: any) {
    for (const evolve of evolvesTo) {
      const link = new Link();
      link.name = evolve?.species?.name;
      link.url = evolve?.species?.url;
      this.evolutionLinks[linkId].push(link);

      if (evolvesTo?.length > 0 && evolvesTo[0].evolves_to) {
        this.loadLinks(linkId, evolvesTo[0].evolves_to);
      }
    }
  }

  async loader(result: any) {
    this.count = result.count;
    this.next = result.next
    this.previous = result.previous

    if (result.results?.length > 0) {
      for (const pokemon of result.results) {
        const tokens = pokemon.url.split('/');
        if (tokens?.[6]) {
          pokemon.id = tokens[6];
        }

        await this.pokeService.retrievePokemon(pokemon.id).toPromise().then(
          result => {
            if (result) {
              pokemon.speciesUrl = result.species?.url;
              pokemon.speciesName = result.species?.name;
              pokemon.artUrl = result.sprites?.other?.dream_world?.front_default;
            }
          });
        if (pokemon.speciesUrl) {
          let evolvesFromSpecies = '';
          await this.pokeService.retrieveSpecies(pokemon.speciesUrl).toPromise().then(
            speciesResult => {
              if (speciesResult) {
                evolvesFromSpecies = speciesResult?.evolves_from_species;
              }
            });
          if (evolvesFromSpecies === null) {
            this.pokemonList.push(pokemon)
          }
        }
      }
    }
  }
}
