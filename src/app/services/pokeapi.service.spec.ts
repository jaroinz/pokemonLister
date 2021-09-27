import { TestBed } from '@angular/core/testing';

import { PokeapiService } from './pokeapi.service';

describe('PokemonService', () => {
  let service: PokeapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokeapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
