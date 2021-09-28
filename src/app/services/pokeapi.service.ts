import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

/**
 * handling http requests
 */
export class PokeapiService {

  apiURL = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  listPokemon(next: any, previous: any): Observable<any>
  {
    if (next) {
      return this.http.get(`${next}`);
    }
    if (previous) {
      return this.http.get(`${previous}`);
    }
    return this.http.get(`${this.apiURL}/pokemon`);
  }

  viewPokemon(pokeId: string): Observable<any>
  {
    return this.http.get(`${this.apiURL}/pokemon/${pokeId}`);
  }

  viewSpecies(speciesUrl: string): Observable<any>
  {
    return this.http.get(`${speciesUrl}`);
  }

  viewEvolution(evolutionUrl: string): Observable<any>
  {
    return this.http.get(`${evolutionUrl}`);
  }

}
