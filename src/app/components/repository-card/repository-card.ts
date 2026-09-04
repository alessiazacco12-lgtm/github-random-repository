import { Component, input } from '@angular/core';
import { Repository } from '../../models/repository.model';

@Component({
  selector: 'app-repository-card',
  imports: [],
  templateUrl: './repository-card.html',
  styleUrl: './repository-card.css',
})
export class RepositoryCard {
  // Ricevo dal componente padre il repository da mostrare.
  repository = input.required<Repository>();
}
