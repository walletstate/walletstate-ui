import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountsHttpClient, Asset, AssetBalance } from '@walletstate/angular-client';
import { Subscription, switchMap } from 'rxjs';
import { AssetsService } from '../../../shared/assets.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss'],
})
export class AccountInfoComponent implements OnInit, OnDestroy {
  balances: AssetBalance[] = [];
  assetsMap: Map<string, Asset>;

  paramsSubscription: Subscription;

  displayedColumns = ['asset', 'amount'];

  constructor(
    private assetsService: AssetsService,
    private accountsClient: AccountsHttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.assetsService.assetsMap.subscribe(map => (this.assetsMap = map));
    this.assetsService.list().subscribe();

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
}
