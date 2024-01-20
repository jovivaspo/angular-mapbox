import { Injectable } from '@angular/core';
import {
  AnySourceData,
  LngLatBounds,
  LngLatLike,
  Map,
  Marker,
  Popup,
} from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { DirectionsApiClient } from '../api/directionsApliClient';
import { Direction, Route } from '../interfaces/directions';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private map?: Map | undefined;
  private markers: Marker[] = [];

  constructor(private directionsApi: DirectionsApiClient) {}

  get isMapReady(): boolean {
    return !!this.map;
  }

  setMap(map: Map) {
    this.map = map;
  }

  flyTo(coords: LngLatLike) {
    if (!this.isMapReady) throw Error('El mapa no esta listo');
    this.map?.flyTo({
      zoom: 14,
      center: coords,
    });
  }

  createMarkersFromPlaces(places: Feature[], userLocation: [number, number]) {
    if (!this.map) throw Error('Mapa no inicializado');
    this.markers.forEach((marker) => marker.remove());

    const newMarkers = [];
    for (const place of places) {
      const [newLng, newLat] = place.center;
      const popup = new Popup().setHTML(`
      <h6>${place.text}</h6>
      <p>${place.place_name}</p>
      
      `);
      const newMarker = new Marker()
        .setLngLat([newLng, newLat])
        .setPopup(popup)
        .addTo(this.map);

      newMarkers.push(newMarker);
      this.markers = newMarkers;

      if (places.length === 0) return;

      const bouds = new LngLatBounds(userLocation, userLocation);
      newMarkers.forEach((marker) => {
        bouds.extend(marker.getLngLat());
      });
      this.map.fitBounds(bouds, {
        padding: 200,
      });
    }
  }

  getRouteBetweenPoints(start: [number, number], end: [number, number]) {
    this.directionsApi
      .get<Direction>(`/${start.join(',')};${end.join(',')}`)
      .subscribe((resp) => {
        this.drawPolyline(resp.routes[0]);
      });
  }

  private drawPolyline(route: Route) {
    if (!this.map) throw Error('Mapa no inicializado');

    const coords = route.geometry.coordinates;

    const bounds = new LngLatBounds();

    coords.forEach((coord) => bounds.extend(coord as [number, number]));

    this.map?.fitBounds(bounds, {
      padding: 200,
    });

    if (this.map.getLayer('route')) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
    }

    const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords,
            },
          },
        ],
      },
    };
    this.map.addSource('route', sourceData);
    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'black',
        'line-width': 3,
      },
    });
  }
}
