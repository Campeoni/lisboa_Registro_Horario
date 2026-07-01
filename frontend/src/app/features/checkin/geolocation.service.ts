import { Injectable } from '@angular/core';

export interface GeolocationCoords {
  lat: number;
  lng: number;
  accuracy: number;
}

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  getCurrentPosition(): Promise<GeolocationCoords> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada por el navegador'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
        },
        (err) => {
          const messages: Record<number, string> = {
            [err.PERMISSION_DENIED]: 'Permiso de ubicación denegado',
            [err.POSITION_UNAVAILABLE]: 'No se pudo obtener la ubicación',
            [err.TIMEOUT]: 'Tiempo de espera agotado',
          };
          reject(new Error(messages[err.code] || 'Error de geolocalización'));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        },
      );
    });
  }
}
