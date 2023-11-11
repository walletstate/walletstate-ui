import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../auth/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() sidenavToggle = new EventEmitter<void>();

  isSmallScreen: boolean = false;
  user: User;

  userSubscription: Subscription;
  breakpointsSubscription: Subscription

  constructor(private responsive: BreakpointObserver, private authService: AuthService) {
  }

  ngOnInit() {
    this.breakpointsSubscription = this.responsive.observe(Breakpoints.XSmall)
      .subscribe(result => {
        this.isSmallScreen = result.matches;
      });
    this.userSubscription = this.authService.user.subscribe(user => this.user = user);
  }

  ngOnDestroy(): void {
    this.breakpointsSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout()
  }

}
