import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { User } from './user.model';
import { UserInfo } from './auth.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: BehaviorSubject<User> = new BehaviorSubject<User>(null)

  private autoLogoutTimer = null;

  constructor(private http: HttpClient, private router: Router) {
  }

  checkUserContextOrRedirect(): Observable<boolean> {
    return this.user.pipe(
      take(1),
      map(user => !!user?.id && user.notExpired()),
      tap(hasUserContext => {
        if (!hasUserContext) this.router.navigate(['/login']);
      })
    );
  }

  checkWalletContextOrRedirect(): Observable<boolean> {
    return this.user.pipe(
      take(1),
      map(user => {
        if (!!user?.wallet && user.notExpired) {
          return true;
        } else if (!!user?.id && user.notExpired) {
          this.router.navigate(['/wallet-init']);
          return false;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }

  initUserFromLocalStorage() {
    const user = User.parse(localStorage.getItem('user'))
    if (!!user && user.notExpired()) {
      this.user.next(user);
      this.autoLogout(user);
    }
  }

  updateUserContext(user: User) {
    if (!!user) {
      localStorage.setItem('user', user.toJsonString());
      this.autoLogout(user);
    } else {
      localStorage.removeItem('user');
      this.clearAutoLogoutTimer();
    }
    this.user.next(user);
    return user;
  }

  clearAutoLogoutTimer() {
    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
    }
  }

  autoLogout(user: User) {
    this.clearAutoLogoutTimer();
    this.autoLogoutTimer = setTimeout(() => {
      console.log('auto logout');
      this.updateUserContext(null);
      this.router.navigate(['/login']);
    }, user.expiresInMillis());
  }

  setWallet(wallet: string, expireInSeconds: number) {
    return this.user.pipe(
      take(1),
      map(user => this.updateUserContext(user.withWallet(wallet, expireInSeconds)))
    );
  }

  login(username: string, password: string) {
    return this.http.post<UserInfo>('/auth/login', {username, password}, {observe: 'response'})
      .pipe(
        tap(response => {
          const user = User.build(response.body, +response.headers.get('X-Auth-Token-Expire-In'));
          this.updateUserContext(user);
          if (!!user.wallet) {
            this.router.navigate(['/']);
          } else {
            this.router.navigate(['/wallet-init']);
          }
        })
      );
  }

  logout() {
    this.http.post('/auth/logout', {}, {observe: 'response', responseType: 'text'})
      .subscribe(r => {
        this.updateUserContext(null);
        this.router.navigate(['/login']);
      });
  }

}
