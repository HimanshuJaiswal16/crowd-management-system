import { inject, Injectable } from '@angular/core';
import { HttpManagerService } from '../../http-manager/http-manager.service';
import { environment } from '../../../environments/environment.development';
import { CONSTANT } from '../../utils/constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private http = inject(HttpManagerService);
  constructor() { }

  getFootFall(payload: {siteId: string, fromUtc: string, toUtc: string}):Observable<any> {
    return this.http.post(
      environment.apiUrl + CONSTANT.API.ANALYTICS.FOOTFALL,
      payload
    );
  };

  getDwell(payload: {siteId: string, fromUtc: string, toUtc: string}):Observable<any> {
    return this.http.post(
      environment.apiUrl + CONSTANT.API.ANALYTICS.DWELL,
      payload
    );
  };

  getOccupancy(payload: {siteId: string, fromUtc: string, toUtc: string}):Observable<any> {
    return this.http.post(
      environment.apiUrl + CONSTANT.API.ANALYTICS.OCCUPANCY,
      payload
    );
  };

  getDemographics(payload: {siteId: string, fromUtc: string, toUtc: string}):Observable<any> {
    return this.http.post(
      environment.apiUrl + CONSTANT.API.ANALYTICS.DEMOGRAPHICS,
      payload
    );
  };

  getEntryExit(payload: {siteId: string, fromUtc: string, toUtc: string, pageSize: number, pageNumber: number}):Observable<any> {
    return this.http.post(
      environment.apiUrl + CONSTANT.API.ANALYTICS.ENTRYEXIT,
      payload
    );
  };
}
