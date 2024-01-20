import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import { CommonModule } from '@angular/common';
import { Feature } from '../../interfaces/places';

@Component({
  selector: 'app-search-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-result.component.html',
  styleUrl: './search-result.component.css',
})
export class SearchResultComponent {
  public selectedId: string = '';
  constructor(
    private placesService: PlacesService,
    private mapService: MapService
  ) {}

  get isLoadingPlaces(): boolean {
    return this.placesService.isLoadingPlaces;
  }

  get places(): Feature[] {
    return this.placesService.places;
  }

  flyTo(place: Feature) {
    const [lng, lat] = place.center;
    this.selectedId = place.id;
    this.mapService.flyTo([lng, lat]);
  }

  getDirections(place: Feature) {
    if (!this.placesService.useLocation) throw Error('No hay userLocation');
    const start = this.placesService.useLocation!;
    const end = place.center as [number, number];
    this.mapService.getRouteBetweenPoints(start, end);
    this.placesService.cleanPlaces();
  }
}
