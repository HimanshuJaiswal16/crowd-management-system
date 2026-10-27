import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
  useClass: HttpClient
})
export class HttpManagerService {

  constructor(private http: HttpClient) { }

  get(url: string): Observable<any> {
    return this.http.get(url, httpOptions);
  }

  post(url: string, body: Object, customHeader?: any): Observable<any> {
    return this.http.post(
      url,
      body,
      customHeader ? customHeader : httpOptions
    );
  }

  put(url: string, body: Object): Observable<any> {
    return this.http.put(url, body, httpOptions);
  }

  delete(url: string): Observable<any> {
    return this.http.delete(url, httpOptions);
  }
}
