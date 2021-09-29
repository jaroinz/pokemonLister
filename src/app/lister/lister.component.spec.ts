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

  it('should render initial current counter', () => {
    const fixture = TestBed.createComponent(ListerComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('div .currentCounter')?.textContent).toContain('0 of: 0 records');
  });

  it('should render 20 of 40', () => {
    const fixture = TestBed.createComponent(ListerComponent);
    component = fixture.componentInstance;
    component.currentCount = 20;
    component.count = 40;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('div .currentCounter')?.textContent).toContain('20 of: 40 records');
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

  it('should call ngOnInit and get 1 element and currentCount as OFFSET value ', fakeAsync(() => {
    const fixture = TestBed.createComponent(ListerComponent);
    const component = fixture.debugElement.componentInstance;
    const service = fixture.debugElement.injector.get(PokeapiService);
    spyOn(service,"retrieveListPokemon").and.callFake(() => {
      return of({"results": [{"name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon/1/"}]})
        .pipe(delay(100));
    });
    component.ngOnInit();
    tick(100);
    expect(component.pokemonList).toHaveSize(1);
    expect(component.currentCount).toEqual(component.OFFSET);
  }))

  it('should call viewDetails with no species URL', fakeAsync(() => {
    const fixture = TestBed.createComponent(ListerComponent);
    const component = fixture.debugElement.componentInstance;

    spyOn(PokeapiService.prototype,"retrievePokemon").and.callFake(() => {
      return of(
        {"species": { "name": POKEMON_NAME },
                  "sprites": {"other": {"dream_world":
                        {"front_default": ART_URL}}}}).pipe(delay(100));
    });

    const pokemon = new Pokemon();
    component.pokemonList.push(pokemon);
    component.viewDetails('1', 0);
    tick(100);
    expect(pokemon.artUrl).toBe(ART_URL);
  }))

  it('should call loadSpecies with this.evolutionLinks already loaded', fakeAsync(() => {
    const fixture = TestBed.createComponent(ListerComponent);
    const component = fixture.debugElement.componentInstance;

    spyOn(PokeapiService.prototype,"retrieveSpecies").and.callFake(() => {
      return of({"evolution_chain": {"url": EVOLUTION_URL}})
        .pipe(delay(100));
    });

    const pokemonDetail = new Pokemon();
    pokemonDetail.speciesUrl = "https://pokeapi.co/api/v2/pokemon-species/1/";

    const link = new Link();
    component.evolutionLinks[ 1 ] = link;
    component.loadSpecies(pokemonDetail);
    tick(100);
    expect(pokemonDetail.evolutionLinks).toBe(component.evolutionLinks[ 1 ]);
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
