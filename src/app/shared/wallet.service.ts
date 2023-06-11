import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateWallet, JoinWallet, Wallet, WalletInvite } from './wallet.model';
import { Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  get() {
    return this.http.get<Wallet>('api/wallets/current')
  }

  create(data: CreateWallet): Observable<Wallet> {
    return this.http.post<Wallet>('/api/wallets', data, {observe: 'response'}).pipe(
      exhaustMap(response => {
        return this.authService.setWallet(response.body.id, +response.headers.get('X-Auth-Token-Expire-In'))
          .pipe(map(u => response.body))
      })
    );
  }

  join(data: JoinWallet): Observable<Wallet> {
    return this.http.post<Wallet>('/api/wallets/join', data, {observe: 'response'}).pipe(
      exhaustMap(response => {
        return this.authService.setWallet(response.body.id, +response.headers.get('X-Auth-Token-Expire-In'))
          .pipe(map(u => response.body))
      })
    );
  }

  createInvite(): Observable<WalletInvite> {
    return this.http.post<WalletInvite>('/api/wallets/invite', {})
  }

}
