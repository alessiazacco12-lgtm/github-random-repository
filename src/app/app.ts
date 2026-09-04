import { Component } from '@angular/core';
import { RepositoryFinder } from './components/repository-finder/repository-finder';

@Component({
  selector: 'app-root',
  imports: [RepositoryFinder],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
