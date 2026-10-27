import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LiveUpdateService {

  connect(siteId: string): Observable<unknown> {

    const socket$ = webSocket<unknown>(`${environment.apiUrl}?siteId=${siteId}`);

    return socket$.pipe(retry({ delay: 3000 }));
  }
}
