import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideFirebaseApp(() =>
      // replace it with your keys.
      initializeApp({
        apiKey: "AIzaSyDU6LIlpXrUJQofX5-5BN1z-nVfxaOMMtg",
  authDomain: "tareas-ca648.firebaseapp.com",
  projectId: "tareas-ca648",
  storageBucket: "tareas-ca648.firebasestorage.app",
  messagingSenderId: "773748754709",
  appId: "1:773748754709:web:b050b32ed450350ea4011c"
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
