import {inject, TestBed, waitForAsync} from '@angular/core/testing';

import { PokeapiService } from './pokeapi.service';
import {HttpClientModule} from "@angular/common/http";

describe('PokemonService', () => {
  let service: PokeapiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [PokeapiService]
    });
    service = TestBed.inject(PokeapiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
