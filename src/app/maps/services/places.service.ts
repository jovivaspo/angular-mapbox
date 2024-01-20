import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature, Places } from '../interfaces/places';
import { PlacesApiClient } from '../api/placesApliClient';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  public useLocation: [number, number] | undefined;
  public isLoadingPlaces = false;
  public places: Feature[] = [];

  constructor(
    private placesApi: PlacesApiClient,
    private mapService: MapService
  ) {
    this.getUserLocation();
  }

  get isUserLocationReady(): boolean {
    return !!this.useLocation;
  }

  public async getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        this.useLocation = [coords.longitude, coords.latitude];
        resolve(this.useLocation);
      }),
        (err: any) => {
          alert('No se pudo obtener la geolocalización');
          console.log(err);
          reject();
        };
    });
  }

  getPlacesByQuery(query: string = '') {
    this.isLoadingPlaces = true;
    this.placesApi
      .get<Places>('/' + query + '.json', {
        params: {
          proximity: this.useLocation?.join(',') || '',
        },
      })
      .subscribe((resp) => {
        this.isLoadingPlaces = false;
        this.places = resp.features;
        this.mapService.createMarkersFromPlaces(
          resp.features,
          this.useLocation!
        );
      });
  }

  cleanPlaces() {
    this.isLoadingPlaces = false;
    this.places = [];
  }
}
