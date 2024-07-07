import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { openRecordDialog } from '../shared/record-dialog/record-dialog.component';
import { AccountsService } from '../shared/accounts.service';
import { Account, Grouped } from '@walletstate/angular-client';
import { Observable } from 'rxjs';
import { AssetsService } from '../shared/assets.service';
import { CategoriesService } from '../shared/categories.service';

@Component({
  selector: 'app-wallet-home',
  templateUrl: './wallet-home.component.html',
  styleUrls: ['./wallet-home.component.scss'],
})
export class WalletHomeComponent implements OnInit, OnDestroy {
  accounts: Observable<Grouped<Account>[]>;

  constructor(
    private accountsService: AccountsService,
    private categoriesService: CategoriesService,
    private assetsService: AssetsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    //prefetch data for widgets
    this.accountsService.loadGrouped().subscribe();
    this.assetsService.loadGrouped().subscribe();
    this.categoriesService.loadGrouped().subscribe();
  }

  ngOnDestroy(): void {}

  createRecordDialog(): void {
    openRecordDialog(this.dialog).subscribe(() => console.log('closed'));
  }
}
