import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(tap({ next: this.onSuccess, error: this.onError.bind(this) }));
  }

  private onSuccess() {
    // console.log(event);
  }

  private onError(errorResponse) {
    console.log(errorResponse);
    if (errorResponse.status === 401) {
      if (errorResponse?.error?.error === 'InvalidAuthContext') {
        this.router.navigate(['/wallet-init']);
      } else {
        this.authService.updateUserContext(null);
        this.router.navigate(['/login']);
      }
    }
  }
}
