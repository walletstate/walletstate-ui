import { Component, EventEmitter, Output } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() sidenavToggle = new EventEmitter<void>();

  isSmallScreen: boolean = false;

  constructor(private responsive: BreakpointObserver, private authService: AuthService) {
  }

  ngOnInit() {
    this.responsive.observe(Breakpoints.XSmall)
      .subscribe(result => {
        this.isSmallScreen = result.matches;
      });
  }

  onToggleSidenav() {
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout()
  }

}
