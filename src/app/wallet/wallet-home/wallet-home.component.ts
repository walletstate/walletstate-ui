import { Component, OnDestroy, OnInit } from '@angular/core';
import { WalletService } from '../../shared/wallet.service';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wallet-home',
  templateUrl: './wallet-home.component.html',
  styleUrls: ['./wallet-home.component.scss'],
})
export class WalletHomeComponent implements OnInit, OnDestroy {
  wallet;
  user = null;
  private userSubscription: Subscription;

  invite;

  constructor(
    private walletService: WalletService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.user.subscribe(user => (this.user = user));

    this.walletService.get().subscribe(resp => {
      console.log(resp);
      this.wallet = resp;
    });
  }

  ngOnDestroy(): void {
    this.userSubscription && this.userSubscription.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  createInvite() {
    this.walletService.createInvite().subscribe(invite => (this.invite = invite));
  }
}
