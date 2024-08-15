import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

export const LOCATIONS = 'locations';

@Injectable()
export class LocationService {

  locationRemovedEmitter: Subject<string> = new Subject<string>();
  locationAddedEmitter: Subject<string> = new Subject<string>();
  private locations: string[] = [];

  constructor() {
    const locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations = JSON.parse(locString);
    }
    for (const loc of this.locations) {
      this.emitAdded(loc);
    }
  }

  addLocation(zipcode: string) {
    // store in localStorage
    if (this.locations.indexOf(zipcode) < 0) {
      this.locations.push(zipcode);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      // notify subscribers
      this.emitAdded(zipcode);
    }
  }

  removeLocation(zipcode: string) {
    // remove from localStorage
    const index = this.locations.indexOf(zipcode);
    if (index > -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      // notify subscribers
      this.emitRemoved(zipcode);
    }
  }

  private emitAdded(zipcode: string) {
    // add zipcode
    this.locationAddedEmitter.next(zipcode);
  }

  private emitRemoved(zipcode: string) {
    // remove zipcode
    this.locationRemovedEmitter.next(zipcode);
  }
}
