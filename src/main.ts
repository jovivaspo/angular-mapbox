import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';


import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

Mapboxgl.accessToken = 'pk.eyJ1Ijoiam9yZXZpcG8iLCJhIjoiY2xyZ2wyeDNlMDd1MTJ2cXZtaHNzYzE4YSJ9.owjtDuWm4UZAAfpzOeaITw';


if( !navigator.geolocation ){
  alert('Navegador no soporta geolocalización');
  throw new Error('Navegador no soporta geolocalización');
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
