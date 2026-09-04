import { Component, inject, signal } from '@angular/core';
import { GithubService } from '../../services/github.service';
import { Language } from '../../models/language.model';
import { Repository } from '../../models/repository.model';
import { RepositoryCard } from '../repository-card/repository-card';

@Component({
  selector: 'app-repository-finder',
  imports: [RepositoryCard],
  templateUrl: './repository-finder.html',
  styleUrl: './repository-finder.css',
})
export class RepositoryFinder {
  // Recupero il service che gestisce le chiamate alla GitHub API.
  private githubService = inject(GithubService);

  // Elenco dei linguaggi disponibili nel menu a tendina.
  languages = signal<Language[]>([]);

  // Linguaggio che viene selezionato dall'utente.
  selectedLanguage = signal('');

  // Repository casuale trovato.
  repository = signal<Repository | null>(null);

  // Stato di loading.
  isLoading = signal(false);

  // Stato di error.
  hasError = signal(false);

  constructor() {
    // Recupero i linguaggi quando viene creato il componente e poi recupero l'elenco dei linguaggi dal file JSON.
    this.loadLanguages();
  }
  loadLanguages() {
    this.githubService.getLanguages().subscribe({
      next: (languages) => {
        this.languages.set(languages);
      },

      error: () => {
        this.hasError.set(true);
      },
    });
  }

  // Leggo il valore del linguaggio selezionato.
  onLanguageChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectLanguage(select.value);
  }

  // Aggiorno il linguaggio selezionato.
  selectLanguage(language: string) {
    this.selectedLanguage.set(language);

    // Resetto i dati precedenti.
    this.repository.set(null);
    this.hasError.set(false);

    // Se non è stato selezionato nessun linguaggio torno allo stato iniziale.
    if (language === '') {
      return;
    }

    // Cerco un repository del linguaggio scelto.
    this.loadRepository();
  }

  // Recupero i repository del linguaggio selezionato.
  loadRepository() {
    const language = this.selectedLanguage();

    // Se non è stato scelto un linguaggio non effettuo la ricerca.
    if (language === '') {
      return;
    }

    // Mostro lo stato di caricamento.
    this.isLoading.set(true);
    this.hasError.set(false);
    this.githubService.searchRepositories(language).subscribe({
      next: (response) => {
        // Se non vengono trovati repository mostro lo stato di errore.
        if (response.items.length === 0) {
          this.hasError.set(true);
          this.isLoading.set(false);
          return;
        }

        // Scelgo un repository casuale tra quelli ricevuti e lo salvo.
        const randomIndex = Math.floor(Math.random() * response.items.length);
        this.repository.set(response.items[randomIndex]);

        // Termino il caricamento.
        this.isLoading.set(false);
      },

      error: () => {
        // In caso di errore mostro lo stato error.
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  // Riprovo l'operazione che ha generato l'errore.
  retry() {
    if (this.selectedLanguage() === '') {
      this.loadLanguages();
    } else {
      this.loadRepository();
    }
  }
  // Carico un altro repository casuale dello stesso linguaggio.
  refresh() {
    this.loadRepository();
  }
}

// Brevemente: Esempio: Imposto come Programming Language "Ruby" e mi spuntano: homebrew-core,dawarich, geocoder.
// Ruby è il linguaggio mentre homebrew-core è il repository di GitHub.
