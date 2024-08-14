import {Injectable, signal} from '@angular/core';

export const LOCATIONS = 'locations';

@Injectable()
export class LocationService {

  locationsEmitter = signal<string[]>([]);
  private readonly locations: string[] = [];

  constructor() {
    const locString = sessionStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations = JSON.parse(locString);
    }
    for (const loc of this.locations) {
      this.emitAdded(loc);
    }
  }

  addLocation(zipcode: string) {
    // store in sessionStorage
    if (this.locations.indexOf(zipcode) === -1) {
      this.locations.push(zipcode);
      sessionStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      // notify subscribers
      this.emitAdded(zipcode);
    }
  }

  removeLocation(zipcode: string) {
    // remove from sessionStorage
    const index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      sessionStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      // notify subscribers
      this.emitRemoved(zipcode);
    }
  }

  private emitAdded(location: string) {
    // add zipcode
    this.locationsEmitter.update(locations => [...locations, location]);
  }

  private emitRemoved(zipcode: string) {
    // remove zipcode
    this.locationsEmitter.update(locations => locations.filter(loc => loc !== zipcode));
  }
}
