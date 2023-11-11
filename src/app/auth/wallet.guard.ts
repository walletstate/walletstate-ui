import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const walletGuard: CanActivateFn = () => {
  return inject(AuthService).checkWalletContextOrRedirect();
};
