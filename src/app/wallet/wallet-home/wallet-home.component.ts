import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RecordDialogComponent } from '../shared/record-dialog/record-dialog.component';
import { AccountsService } from '../shared/accounts.service';
import { Account, Grouped } from '@walletstate/angular-client';
import { Observable } from 'rxjs';
import { AssetsService } from '../shared/assets.service';

@Component({
  selector: 'app-wallet-home',
  templateUrl: './wallet-home.component.html',
  styleUrls: ['./wallet-home.component.scss'],
})
export class WalletHomeComponent implements OnInit, OnDestroy {
  accounts: Observable<Grouped<Account>[]>;

  constructor(
    private accountsService: AccountsService,
    private assetsService: AssetsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.accounts = this.accountsService.loadGrouped();
    this.assetsService.loadAssets().subscribe(); //prefetch assets for widgets
  }

  ngOnDestroy(): void {}

  createRecordDialog(): void {
    const dialogRef = this.dialog.open(RecordDialogComponent, {
      // height: '400px',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(() => console.log('closed'));
  }
}
