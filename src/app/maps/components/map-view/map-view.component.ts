import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import { CommonModule } from '@angular/common';
import { Map, Popup, Marker } from 'mapbox-gl';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css',
})
export class MapViewComponent implements AfterViewInit {
  constructor(
    private placesService: PlacesService,
    private mapService: MapService
  ) {}

  @ViewChild('mapViewRef') mapDivElement!: ElementRef;

  ngAfterViewInit(): void {
    if (!this.placesService.useLocation)
      throw Error('No hay placesService.useLocation');
    const map = new Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.placesService.useLocation, // starting position
      zoom: 9, // starting zoom
    });

    const popup = new Popup().setHTML(
      `<h6>Aqui estoy</h6>
    <span>Estoy en este punto del mundo</span>`
    );

    new Marker({
      color: 'red',
    })
      .setLngLat(this.placesService.useLocation)
      .setPopup(popup)
      .addTo(map);

    this.mapService.setMap(map);
  }
}
