import { HttpClient } from '@angular/common/http';
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

  // Cerco i repository in base al linguaggio selezionato.
  searchRepositories(language: string) {
    return this.http.get<RepositorySearchResponse>(
      `${this.apiUrl}?q=language:${encodeURIComponent(language)}&per_page=100`,
    );
  }
}
