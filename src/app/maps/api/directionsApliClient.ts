import { HttpClient, HttpHandler, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class DirectionsApiClient extends HttpClient {
  public baseIrl: string =
    'https://api.mapbox.com/directions/v5/mapbox/driving';

  constructor(handler: HttpHandler) {
    super(handler);
  }

  public override get<T>(url: string) {
    url = `${this.baseIrl}${url}`;
    return super.get<T>(url, {
      params: {
        alternatives: false,
        geometries: 'geojson',
        language: 'es',
        overview: 'simplified',
        steps: false,
        access_token: environment.apiKey,
      },
    });
  }
}
