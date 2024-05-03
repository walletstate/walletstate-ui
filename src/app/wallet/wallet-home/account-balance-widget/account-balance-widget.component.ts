import { Component, Input, OnInit } from '@angular/core';
import { Account, AccountsHttpClient, Asset, AssetBalance } from '@walletstate/angular-client';
import { Observable } from 'rxjs';
import { AssetsService } from '../../shared/assets.service';

@Component({
  selector: 'app-account-balance-widget',
  templateUrl: './account-balance-widget.component.html',
  styleUrl: './account-balance-widget.component.scss',
})
export class AccountBalanceWidgetComponent implements OnInit {
  @Input() account: Account;

  balances: Observable<AssetBalance[]>;

  constructor(
    private accountsClient: AccountsHttpClient,
    private assetsService: AssetsService
  ) {}

  ngOnInit(): void {
    this.balances = this.accountsClient.getBalance(this.account.id);
  }

  getAsset(id: string): Asset {
    return this.assetsService.assetsMap.value.get(id);
  }
}
