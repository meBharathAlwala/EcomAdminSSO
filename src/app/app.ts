import { Component, Inject } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { EventMessage, RedirectRequest ,EventType, InteractionStatus} from '@azure/msal-browser';
import { filter, Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
   imports: [CommonModule]
})
export class App {
  protected title = 'EcomAdmin';
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();
  msalStatus: InteractionStatus = InteractionStatus.None;
/**
 *
 */
constructor(   
  @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
  private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService
 ) {


}


    loginRedirect() {
      console.log('loginRedirect called');
      try {
        // Only allow login if no interaction is in progress
      //  if (this.msalStatus === InteractionStatus.None) {
          if (this.msalGuardConfig.authRequest) {
            this.authService.loginRedirect({
              ...this.msalGuardConfig.authRequest,
            } as RedirectRequest);
          } else {
            this.authService.loginRedirect();
          }
        // } else {
        //   console.warn('MSAL interaction already in progress, loginRedirect not called.');
        // }
      } catch (error) {
        console.error('MSAL loginRedirect error:', error);
        if (error && typeof error === 'object' && 'message' in error) {
          alert('Login failed: ' + (error as { message: string }).message);
        } else {
          alert('Login failed: ' + error);
        }
      }
    }


  ngOnInit(): void {
   this.authService.handleRedirectObservable().subscribe();
   // this.isIframe = window !== window.parent && !window.opener; // Remove this line to use Angular Universal

   // this.setLoginDisplay();

    this.authService.instance.enableAccountStorageEvents(); // Optional - This will enable ACCOUNT_ADDED and ACCOUNT_REMOVED events emitted when a user logs in or out of another tab or window
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.ACCOUNT_ADDED ||
            msg.eventType === EventType.ACCOUNT_REMOVED
        )
      )
      .subscribe((result: EventMessage) => {
        if (this.authService.instance.getAllAccounts().length === 0) {
          window.location.pathname = '/';
        } else {
          this.setLoginDisplay();
        }
      });

    //To subscribe for claims
    // this.loginService.claims$.subscribe((c) => {
    //   this.claims = c;
    // });

    this.msalBroadcastService.inProgress$
      .pipe(takeUntil(this._destroying$))
      .subscribe((status: InteractionStatus) => {
        this.msalStatus = status;
        if (status === InteractionStatus.None) {
          this.setLoginDisplay();
          this.checkAndSetActiveAccount();
        }
      });
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  checkAndSetActiveAccount() {
    /**
     * If no active account set but there are accounts signed in, sets first account to active account
     * To use active account set here, subscribe to inProgress$ first in your component
     * Note: Basic usage demonstrated. Your app may require more complicated account selection logic
     */
    let activeAccount = this.authService.instance.getActiveAccount();

    if (
      !activeAccount &&
      this.authService.instance.getAllAccounts().length > 0
    ) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }
 logout(popup?: boolean) {
    if (popup) {
      this.authService.logoutPopup({
        mainWindowRedirectUri: '/',
      });
    } else {
      this.authService.logoutRedirect();
    }
  }


}
