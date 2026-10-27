import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpManagerService } from '../../http-manager/http-manager.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpManagerService);

  private isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor() { }

  getToken() {
    const token = localStorage.getItem("token");
    return token;
  };

  login(payload: { email: string, password: string }): Observable<any> {
    return this.http.post('https://hiring-dev.internal.kloudspot.com/' + 'api/auth/login', payload).pipe(tap(res => {
      localStorage.setItem('token', res.token);
      this.isLoggedIn.next(true);
    }));
  }
}
