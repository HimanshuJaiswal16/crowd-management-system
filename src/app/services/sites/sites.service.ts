import { inject, Injectable } from '@angular/core';
import { HttpManagerService } from '../../http-manager/http-manager.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { CONSTANT } from '../../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class SitesService {

  private http = inject(HttpManagerService);

  constructor() { }

  getAllSites(): Observable<any> {
    return this.http.get(
      environment.apiUrl + CONSTANT.API.SITES.GETALL
    );
  };

  getSelectSiteBySiteId(payload: {siteId: string}): Observable<any> {
    return this.http.get(
      environment.apiUrl + CONSTANT.API.SITES.GETBYID + `${payload.siteId}`
    );
  };

}
