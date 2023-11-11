import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { User } from './auth/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  user: User;
  userSubscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.initUserFromLocalStorage();
    this.userSubscription = this.authService.user.subscribe(user => (this.user = user));
  }

  ngOnDestroy(): void {
    this.authService.clearAutoLogoutTimer();
    this.userSubscription.unsubscribe();
  }
}
