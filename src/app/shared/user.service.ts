import { Injectable } from '@angular/core';
import { AuthContext } from "./auth-context.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  context: AuthContext

  constructor() {
    const user = sessionStorage.getItem('user');
    const wallet = sessionStorage.getItem('wallet');
    this.context = {user, wallet};
  }

  setContext(user: string, wallet?: string) {
    sessionStorage.setItem('user', user);
    sessionStorage.setItem('wallet', wallet);
    this.context = {user, wallet};
  }

  hasUser(): boolean {
    return !!this.context?.user
  }

  hasWallet(): boolean {
    return !!this.context?.wallet
  }
}
