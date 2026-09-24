import { Component, computed } from '@angular/core';
import { HttpParams, httpResource } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import { Language } from '../../models/language.model';
import { Repository, RepositorySearchResponse } from '../../models/repository.model';
import { RepositoryCard } from '../repository-card/repository-card';

@Component({
  selector: 'app-repository-finder',
  imports: [RepositoryCard, ReactiveFormsModule],
  templateUrl: './repository-finder.html',
  styleUrl: './repository-finder.css',
})
export class RepositoryFinder {
  // Controllo del form per il linguaggio selezionato.
  languageControl = new FormControl('', { nonNullable: true });

  // Trasformo il valore del FormControl in un Signal.
  selectedLanguage = toSignal(this.languageControl.valueChanges, {
    initialValue: this.languageControl.value,
  });

  // Recupero l'elenco dei linguaggi tramite httpResource.
  languagesResource = httpResource<Language[]>(() => '/data/languages.json', {
    defaultValue: [],
  });

  // Recupero i repository in base al linguaggio selezionato.
  repositoryResource = httpResource<RepositorySearchResponse>(() => {
    const language = this.selectedLanguage();

    // Se non è stato selezionato un linguaggio non effettuo la richiesta.
    if (language === '') {
      return undefined;
    }

    const params = new HttpParams().set('q', `language:${language}`).set('per_page', '100');

    return {
      url: 'https://api.github.com/search/repositories',
      params,
    };
  });

  // Repository casuale ricavato dalla risposta della Resource.
  repository = computed<Repository | null>(() => {
    if (!this.repositoryResource.hasValue()) {
      return null;
    }

    const repositories = this.repositoryResource.value().items;

    if (repositories.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * repositories.length);

    return repositories[randomIndex];
  });

  // Stato di errore.
  hasError = computed(() => {
    if (this.languagesResource.error() || this.repositoryResource.error()) {
      return true;
    }

    if (this.selectedLanguage() === '' || !this.repositoryResource.hasValue()) {
      return false;
    }

    return this.repositoryResource.value().items.length === 0;
  });

  // Riprovo l'operazione che ha generato l'errore.
  retry() {
    if (this.selectedLanguage() === '') {
      this.languagesResource.reload();
    } else {
      this.repositoryResource.reload();
    }
  }

  // Carico nuovamente i repository dello stessno linguaggio.
  refresh() {
    this.repositoryResource.reload();
  }
}
