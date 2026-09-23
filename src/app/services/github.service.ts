import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Language } from '../models/language.model';
import { RepositorySearchResponse } from '../models/repository.model';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  // Recupero HttpClient per effettuare le chiamate HTTP.
  private http = inject(HttpClient);

  // URL della GitHub Repository Search API.
  private apiUrl = 'https://api.github.com/search/repositories';

  // Percorso del file locale con i linguaggi.
  private languagesUrl = '/data/languages.json';

  // Recupero l'elenco dei linguaggi.
  getLanguages() {
    return this.http.get<Language[]>(this.languagesUrl);
  }

  // Il metodo prende il linguaggio selezionato, crea i parametri della ricerca e invia una richiesta GET alla GitHub API per ottenere i repository corrispondenti.
  searchRepositories(language: string) {
    const params = new HttpParams()
      .set('q', `language:${language}`)
      // Richiedo fino a 100 repository per pag.
      .set('per_page', '100');
    return this.http.get<RepositorySearchResponse>(this.apiUrl, { params });
  }
}
