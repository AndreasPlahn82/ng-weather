import {Injectable, signal} from '@angular/core';

export const LOCATIONS = 'locations';

@Injectable()
export class LocationService {

  locationRemovedEmitter = signal<string>(undefined);
  locationAddedEmitter = signal<string>(undefined);
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
    debugger;
    // remove from sessionStorage
    const index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      sessionStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      // notify subscribers
      this.emitRemoved(zipcode);
    }
  }

  private emitAdded(zipcode: string) {
    // add zipcode
    this.locationAddedEmitter.set(zipcode);
  }

  private emitRemoved(zipcode: string) {
    // remove zipcode
    this.locationRemovedEmitter.set(zipcode);
  }
}
