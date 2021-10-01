import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { ListerComponent } from './lister.component';
import {HttpClientModule} from "@angular/common/http";
import {PokeapiService} from "../services/pokeapi.service";
import {delay} from "rxjs/operators";
import {of} from "rxjs";
import {Pokemon} from "../models/pokemon";
import {Link} from "../models/link";

describe('ListerComponent', () => {
  let component: ListerComponent;
  let fixture: ComponentFixture<ListerComponent>;
  const POKEMON_NAME = "pokemonTest";
  const POKEMON_URL = "https://pokeapi.co/api/v2/pokemon/1/";
  const ART_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/2.svg";
  const EVOLUTION_URL = "https://pokeapi.co/api/v2/evolution-chain/1/";
  const EVOLUTION_URL_FAKE = "https://pokeapi.co/api/v2evolution-chain1";

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ ListerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ListerComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit and get response as empty array', fakeAsync(() => {
    const fixture = TestBed.createComponent(ListerComponent);
    const component = fixture.debugElement.componentInstance;
    const service = fixture.debugElement.injector.get(PokeapiService);
    spyOn(service,"retrieveListPokemon").and.callFake(() => {
      return of([]).pipe(delay(100));
    });
    component.ngOnInit();
    tick(100);
    expect(component.pokemonList).toEqual([]);
  }))


  it('should call viewDetails and expect: pokemon evolution links get set and set display as true'
    , fakeAsync(() => {
    const fixture = TestBed.createComponent(ListerComponent);
    const component = fixture.debugElement.componentInstance;

    spyOn(PokeapiService.prototype,"retrieveSpecies").and.callFake(() => {
      return of({"evolution_chain": {"url": EVOLUTION_URL}}).pipe(delay(100));
    });

    component.evolutionLinks['1'] = [];
    const link = new Link();
    link.name = 'LINK_DEMO_NAME'
    link.pokemon = new Pokemon();
    link.pokemon.artUrl = ART_URL;
    link.display = false;
    component.evolutionLinks['1'].push(link);

    const pokemon = new Pokemon();
    pokemon.evolutionLinks = component.evolutionLinks['1'];
    component.pokemonList.push(pokemon);

    expect(pokemon.evolutionLinks[0].display).toBe(false);
    component.viewDetails('1', 0);
    tick(100);
    expect(pokemon.evolutionLinks).toBe(component.evolutionLinks['1']);
    expect(pokemon.evolutionLinks[0].display).toBe(true);
  }))

  it('should call loadEvolution and pokemonDetail should contain all evolution links', fakeAsync(() => {
    const fixture = TestBed.createComponent(ListerComponent);
    const component = fixture.debugElement.componentInstance;

    spyOn(PokeapiService.prototype,"retrieveEvolution").and.callFake(() => {
      return of(
        {"chain": { "evolves_to": [
                {
                  "evolves_to":
                    [{ "species": {"name": "venusaur","url": "https://pokeapi.co/api/v2/pokemon-species/3/"}}],
                  "species": {"name": "ivysaur","url": "https://pokeapi.co/api/v2/pokemon-species/2/"}
                }
              ], "species": {"name": "bulbasaur","url": "https://pokeapi.co/api/v2/pokemon-species/1/"}}})
        .pipe(delay(100));
    });

    const pokemonDetail = new Pokemon();
    pokemonDetail.speciesUrl = "https://pokeapi.co/api/v2/pokemon-species/1/";

    const link = new Link();
    component.evolutionLinks[ 1 ] = link;
    component.loadEvolution(pokemonDetail, 1, "");
    tick(100);
    expect(pokemonDetail.evolutionLinks).toBe(component.evolutionLinks[ 1 ]);
    expect(pokemonDetail.evolutionLinks.length).toBe(3);
  }))

});
