import {Component} from '@angular/core';
import {LocationService} from '../location.service';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {

  constructor(private service: LocationService) {
  }

  addLocation(zipcode: string) {
    if (!zipcode) {
      return;
    }
    // zipcode must be numeric and max 6 digits
    if (!/^\d{1,6}$/.test(zipcode)) {
      return;
    }

    this.service.addLocation(zipcode);
  }

}
