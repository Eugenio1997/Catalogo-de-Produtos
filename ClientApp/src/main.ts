import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const Config = {
  BASE_URL: "https://localhost:7063/"
};

export function getBaseUrlFromBackend() {
  return Config.BASE_URL;
}


export function getBaseUrlFromFrontend() {
  return document.getElementsByTagName('base')[0].href;
}

const providers = [
  { provide: 'FRONTEND_BASE_URL', useFactory: getBaseUrlFromFrontend, deps: []},
  { provide: 'BACKEND_BASE_URL', useFactory: getBaseUrlFromBackend, deps: []},
];

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.log(err));
