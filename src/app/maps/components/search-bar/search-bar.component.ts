import { Component } from '@angular/core';
import { SearchResultComponent } from '../search-result/search-result.component';
import { PlacesService } from '../../services';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [SearchResultComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  constructor(private placesService: PlacesService) {}
  private debounceTimer?: NodeJS.Timeout;

  onQueryChange(query: string = '') {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      if (!!query.length) {
        this.placesService.getPlacesByQuery(query);
      } else {
        this.placesService.cleanPlaces();
      }
    }, 750);
  }
}
