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

  retrieveListPokemon(next: any, previous: any): Observable<any>
  {
    if (next) {
      return this.http.get(`${next}`);
    }
    if (previous) {
      return this.http.get(`${previous}`);
    }
    return this.http.get(`${this.apiURL}/pokemon`);
  }

  retrievePokemon(pokeId: string): Observable<any>
  {
    return this.http.get(`${this.apiURL}/pokemon/${pokeId}`);
  }

  retrieveSpecies(speciesUrl: string): Observable<any>
  {
    return this.http.get(`${speciesUrl}`);
  }

  retrieveEvolution(evolutionUrl: string): Observable<any>
  {
    return this.http.get(`${evolutionUrl}`);
  }

}
