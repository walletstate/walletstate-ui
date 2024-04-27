import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { concatMap, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { CreateWallet, JoinWallet, Wallet, WalletInvite, WalletsHttpClient } from '@walletstate/angular-client';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private walletsClient: WalletsHttpClient
  ) {}

  get(): Observable<Wallet> {
    return this.walletsClient.getCurrent();
  }

  create(data: CreateWallet): Observable<Wallet> {
    return this.walletsClient.create(data).pipe(
      concatMap(wallet => {
        return this.requestWalletAuthCookies(wallet.id).pipe(
          exhaustMap(tokenExpireIn => {
            return this.authService.setWallet(wallet.id, tokenExpireIn).pipe(map(() => wallet));
          })
        );
      })
    );
  }

  join(data: JoinWallet): Observable<Wallet> {
    return this.walletsClient.join(data).pipe(
      concatMap(wallet => {
        return this.requestWalletAuthCookies(wallet.id).pipe(
          exhaustMap(tokenExpireIn => {
            return this.authService.setWallet(wallet.id, tokenExpireIn).pipe(map(() => wallet));
          })
        );
      })
    );
  }

  requestWalletAuthCookies(walletId: string): Observable<number> {
    return this.http
      .post(`/auth/wallet/${walletId}`, {}, { observe: 'response' })
      .pipe(map(response => +response.headers.get('X-Auth-Token-Expire-In')));
  }

  createInvite(): Observable<WalletInvite> {
    return this.walletsClient.createInvite();
  }
}
