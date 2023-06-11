import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import { AuthService } from './auth.service';

export const walletGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).checkWalletContextOrRedirect();
};
