import { Component, OnDestroy, OnInit } from '@angular/core';
import { WalletService } from '../../shared/wallet.service';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { RecordDialogComponent } from '../shared/record-dialog/record-dialog.component';

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
    private authService: AuthService,
    private dialog: MatDialog
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

  openTransactionsDialog(): void {
    const dialogRef = this.dialog.open(RecordDialogComponent, {
      // height: '400px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(() => console.log('closed'));
  }
}
