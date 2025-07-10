// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { EnvironmentConfiguration } from "../app/models/environment-configuration";


const serverUrl='http://localhost:7179/api';


// The list of file replacements can be found in `angular.json`.
export const environment: EnvironmentConfiguration = {
  env_name: 'dev',
  production: true,
  apiUrl: serverUrl,
  apiEndpoints: {
    userProfile:'user-profiles'
  },
  adConfig: {
    clientId: 'e70ef2ea-f1d0-4241-ae4e-32bb96934b24',
    readScopeUrl: 'api://6fcc55ff-4a12-4c07-b5f9-93fc0b5ba326/Ecom.Read',
    writeScopeUrl: 'api://6fcc55ff-4a12-4c07-b5f9-93fc0b5ba326/Ecom.Write',
    scopeUrls: [
      'api://6fcc55ff-4a12-4c07-b5f9-93fc0b5ba326/Ecom.Read',
      'api://6fcc55ff-4a12-4c07-b5f9-93fc0b5ba326/Ecom.Write'
    ],
    apiEndpointUrl: 'http://localhost:7179/api',
    tenantId: "97243ff1-7d76-4a18-820e-3e4dc39e1319"
  },
  cacheTimeInMinutes: 30,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

// run this app in 4200 port

/*
azure ad user credentials, it will not work after 15 days of I created, comment in channel to send you new one

karthik@learnsmartcodinggmail.onmicrosoft.com or kannan@learnsmartcodinggmail.onmicrosoft.com
LSCamu745406
*/