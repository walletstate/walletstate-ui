import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {UserService} from "./shared/user.service";

export const userGuard: CanActivateFn = (route, state) => {
  if (inject(UserService).hasUser()) {
    return true;
  } else {
    return inject(Router).navigate(['/login']);
  }
};

