import { inject, Injectable } from '@angular/core';
import { HttpManagerService } from '../../http-manager/http-manager.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { CONSTANT } from '../../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  private http = inject(HttpManagerService);
  
  constructor() { }

  startSimulation(): Observable<any> {
    return this.http.get(
      environment.apiUrl + CONSTANT.API.SIMULATION.START
    );
  };

  stopSimulation(): Observable<any> {
    return this.http.get(
      environment.apiUrl + CONSTANT.API.SIMULATION.STOP
    );
  };
}
