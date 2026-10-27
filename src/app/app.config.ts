import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './http-interceptors/http-interceptors.interceptor';
import { provideStore } from '@ngxs/store';
import {APP_STATES} from '../app/store/app.states';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([httpInterceptor])
    ),
    provideStore(
      APP_STATES,
      withNgxsStoragePlugin({
        keys: '*'
      })
    )
  ]
};
