import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { BrowserCacheLocation, InteractionType, IPublicClientApplication, LogLevel, PublicClientApplication } from '@azure/msal-browser';
import { MSAL_GUARD_CONFIG, MSAL_INSTANCE, MSAL_INTERCEPTOR_CONFIG, MsalBroadcastService, MsalGuard, MsalGuardConfiguration, MsalInterceptor, MsalInterceptorConfiguration, MsalService } from '@azure/msal-angular';
import { APP_INITIALIZER } from '@angular/core';
// Ensure MSAL instance is initialized before app loads
export function initializeMsalFactory(msalInstance: IPublicClientApplication) {
  return () => msalInstance.initialize();
}
import { BrowserModule } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';



export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

export function MSALInstanceFactory(): IPublicClientApplication {
 return new PublicClientApplication({
    auth: {
      clientId: environment.adConfig.clientId,
      authority: `https://login.microsoftonline.com/${environment.adConfig.tenantId}`,
      knownAuthorities: [`login.microsoftonline.com`],
      redirectUri: 'http://localhost:4200/',
      postLogoutRedirectUri: 'http://localhost:4200/',
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
    },
    system: {
      //allowNativeBroker: false, // Disables WAM Broker
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false,
      },
    },
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  //have this set if more microservice used or requires different scope for different controllers
  protectedResourceMap.set(
    environment.adConfig.apiEndpointUrl, // This is for all controllers
    environment.adConfig.scopeUrls
  );
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [...environment.adConfig.scopeUrls],
    },
    loginFailedRoute: '/login-failed',
  };
}

export const appConfig: ApplicationConfig = {
  providers: [    
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),    
    importProvidersFrom(
      BrowserModule      
    ),
   provideNoopAnimations(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeMsalFactory,
      deps: [MSAL_INSTANCE],
      multi: true,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],


};
