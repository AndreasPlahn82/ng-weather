import {Injectable, Signal, signal} from '@angular/core';
import {Observable, of} from 'rxjs';

import {HttpClient} from '@angular/common/http';
import {CurrentConditions} from './current-conditions/current-conditions.type';
import {ConditionsAndZip} from './conditions-and-zip.type';
import {Forecast} from './forecasts-list/forecast.type';
import {LocationService} from './location.service';
import {CacheService} from './cache.service';
import {tap} from 'rxjs/operators';

@Injectable()
export class WeatherService {
  
  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  
  static CURRENT_CONDITIONS_CACHE_PREFIX = 'CURRENT_';
  static FORECAST_CACHE_PREFIX = 'FORECAST_';
  private currentConditions = signal<ConditionsAndZip[]>([]);
  
  constructor(private http: HttpClient, private cacheService: CacheService, locationService: LocationService) {
    locationService.locationRemovedEmitter.subscribe(zipcode => {
      this.removeCurrentConditions(zipcode);
    });
    locationService.locationAddedEmitter.subscribe(zipcode => {
      this.addCurrentConditions(zipcode);
    });
  }
  
  addCurrentConditions(zipcode: string): void {
    const cacheKey = `${WeatherService.CURRENT_CONDITIONS_CACHE_PREFIX}${zipcode}`;
    
    const cachedData = this.cacheService.get(cacheKey) as CurrentConditions;
    if (cachedData) {
      this.currentConditions.update(conditions => [...conditions, {zip: zipcode, data: cachedData}]);
      return;
    }
    
    const url = `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`;
    this.http.get<CurrentConditions>(url)
    .subscribe(
      response => {
        this.cacheService.set(cacheKey, response);
        this.currentConditions.update(conditions => [...conditions, {zip: zipcode, data: response}]);
      },
      error => {
        alert(`Failed to retrieve current conditions for ${zipcode}: ${error.message}`);
        this.removeCurrentConditions(zipcode);
      }
    );
  }
  
  removeCurrentConditions(zipcode: string) {
    this.currentConditions.update(conditions => {
      for (const i in conditions) {
        if (conditions[i].zip === zipcode) {
          conditions.splice(+i, 1);
        }
      }
      return conditions;
    })
  }
  
  getCurrentConditions(locations: string[]): Signal<ConditionsAndZip[]> {
    if (locations.length > 0) {
      locations.forEach(zipcode => this.addCurrentConditions(zipcode));
    }
    return this.currentConditions.asReadonly();
  }
  
  getForecast(zipcode: string): Observable<Forecast> {
    const cacheKey = `${WeatherService.FORECAST_CACHE_PREFIX}${zipcode}`;
    const cachedData = this.cacheService.get(cacheKey) as Forecast;
    if (cachedData) {
      return of(cachedData); // return cached data if available
    }
    
    const url = `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`;
    return this.http.get<Forecast>(url).pipe(
      tap(response => this.cacheService.set(cacheKey, response))
    );
  }
  
  getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232) {
      return WeatherService.ICON_URL + 'art_storm.png';
    } else if (id >= 501 && id <= 511) {
      return WeatherService.ICON_URL + 'art_rain.png';
    } else if (id === 500 || (id >= 520 && id <= 531)) {
      return WeatherService.ICON_URL + 'art_light_rain.png';
    } else if (id >= 600 && id <= 622) {
      return WeatherService.ICON_URL + 'art_snow.png';
    } else if (id >= 801 && id <= 804) {
      return WeatherService.ICON_URL + 'art_clouds.png';
    } else if (id === 741 || id === 761) {
      return WeatherService.ICON_URL + 'art_fog.png';
    } else {
      return WeatherService.ICON_URL + 'art_clear.png';
    }
  }
}
