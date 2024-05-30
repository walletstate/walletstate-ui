import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountsHttpClient, Asset, AssetAmount } from '@walletstate/angular-client';
import { Subscription, switchMap } from 'rxjs';
import { AssetsService } from '../../../shared/assets.service';
import { AssetIcon } from '../../../../shared/icons';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
})
export class AccountInfoComponent implements OnInit, OnDestroy {
  balances: AssetAmount[] = [];

  paramsSubscription: Subscription;
  defaultAssetIcon = AssetIcon;

  displayedColumns = ['asset', 'amount'];

  constructor(
    private assetsService: AssetsService,
    private accountsClient: AccountsHttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.assetsService.loadGrouped().subscribe();

    this.paramsSubscription = this.route.parent.paramMap
      .pipe(switchMap(params => this.accountsClient.getBalance(params.get('id'))))
      .subscribe(balance => {
        this.balances = balance;
      });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  getAsset(id: string): Asset {
    return this.assetsService.asset(id);
  }
}
