import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)  //bootstrapApplication is used to initialize and launch an Angular application in a web browser environment.
  .catch((err) => console.error(err));
