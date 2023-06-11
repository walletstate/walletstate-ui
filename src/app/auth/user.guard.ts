import { CanActivateFn, Router } from '@angular/router';
import { inject } from "@angular/core";
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';


export const userGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).checkUserContextOrRedirect()

};

