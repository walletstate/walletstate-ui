import { Component, EventEmitter, OnInit } from '@angular/core';
import { AnalyticsGroupBy, AnalyticsHttpClient } from '@walletstate/angular-client';
import { AccountsService } from '../shared/accounts.service';
import { CategoriesService } from '../shared/categories.service';
import { AssetsService } from '../shared/assets.service';
import { AppAnalyticsFilter } from './analytics-filter/analytics-filter.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent implements OnInit {
  filter: BehaviorSubject<AppAnalyticsFilter> = new BehaviorSubject<AppAnalyticsFilter>(AppAnalyticsFilter.empty());

  constructor(
    private accountsService: AccountsService,
    private categoriesService: CategoriesService,
    private assetsService: AssetsService
  ) {}

  ngOnInit(): void {
    this.categoriesService.loadGrouped().subscribe();
    this.accountsService.loadGrouped().subscribe();
    this.assetsService.loadGrouped().subscribe();
  }

  onApplyFilter(filter: AppAnalyticsFilter) {
    this.filter.next(filter);
  }
}
