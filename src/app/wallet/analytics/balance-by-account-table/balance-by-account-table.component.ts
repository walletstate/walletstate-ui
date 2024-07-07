import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, debounceTime, forkJoin, Observable, Subscription, switchMap } from 'rxjs';
import { AppAnalyticsFilter } from '../analytics-filter/analytics-filter.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from '../../shared/accounts.service';
import { AssetsService } from '../../shared/assets.service';
import {
  Account,
  AnalyticsGroupBy,
  AnalyticsGroupedResult,
  AnalyticsHttpClient,
  Asset,
  AssetAmount,
  Grouped,
} from '@walletstate/angular-client';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { map, tap } from 'rxjs/operators';

type DataSourceValueType = Grouped<Account> | Account;

@Component({
  selector: 'app-balance-by-account-table',
  templateUrl: './balance-by-account-table.component.html',
  styleUrl: './balance-by-account-table.component.scss',
})
export class BalanceByAccountTableComponent implements OnInit {
  // sidebar filter
  @Input() filter: BehaviorSubject<AppAnalyticsFilter>;
  // top row filter
  filterForm: FormGroup;

  isLoading: boolean = false;

  columns = ['name', 'expand'];
  allAssetsIds: string[] = [];

  dataSource: MatTableDataSource<DataSourceValueType, MatPaginator> = new MatTableDataSource([]);

  expandedGroup: Grouped<Account> | null;

  analyticsResults: Map<string, Map<string, number>> = new Map();

  filterSubscription: Subscription;
  datetimeChangeSubscription: Subscription;
  finalAssetCheckboxChangeSubscription: Subscription;

  constructor(
    private accountsService: AccountsService,
    private assetsService: AssetsService,
    private analyticsClient: AnalyticsHttpClient
  ) {}

  ngOnInit(): void {
    this.filterForm = this.initFilterForm();

    this.assetsService.groups.subscribe(assetGroups => {
      this.allAssetsIds = assetGroups.flatMap(group => group.items.map(a => a.id));
      this.buildColumns();
    });

    this.dataSource.filterPredicate = (data, filter) =>
      this.isGroup(data) || (filter && data['group'] && data['group'] === filter);

    this.accountsService.groups.subscribe(groups => {
      this.dataSource.data = groups.flatMap(group => [group, ...group.items]);
      this.dataSource.filter = 'none';
    });

    this.datetimeChangeSubscription = this.datetimeChangeListener();
    this.filterSubscription = this.filterChangesListener();
    this.finalAssetCheckboxChangeSubscription = this.finalAssetCheckboxListener();
  }

  isGroup(item: DataSourceValueType): boolean {
    return !!item['items'];
  }

  getAsset(id: string): Asset {
    return this.assetsService.asset(id);
  }

  getCellValue(rowId: string, columnId: string): number {
    return this.analyticsResults.get(rowId)?.get(columnId) ?? 0;
  }

  isAssetValueNotZero(id: string): boolean {
    return this.dataSource.filteredData.some(accountOrGroup => this.getCellValue(accountOrGroup.id, id) !== 0);
  }

  private buildColumns() {
    const nonZeroAssetsIds = this.allAssetsIds.filter(assetId => this.isAssetValueNotZero(assetId));
    this.columns = ['name', ...nonZeroAssetsIds, 'expand'];
  }

  toggleGroup(group: Grouped<Account>) {
    if (this.expandedGroup === group) {
      this.expandedGroup = null;
      this.dataSource.filter = 'none';
    } else {
      this.loadAnalytics(group).subscribe(() => {
        this.expandedGroup = group;
        this.dataSource.filter = group.id;
      });
    }
  }

  private initFilterForm() {
    return new FormGroup({
      datetime: new FormControl(new Date(), [Validators.required]),
      byFinalAsset: new FormControl(false, []),
    });
  }

  ////////////////////////////////////////////////////////
  // Listeners
  datetimeChangeListener() {
    return this.filterForm
      .get('datetime')
      .valueChanges.pipe(
        debounceTime(500),
        switchMap(() => this.loadAnalytics()),
        tap(() => this.buildColumns())
      )
      .subscribe(() => console.log(`Datetime changed. Data reloaded`));
  }

  finalAssetCheckboxListener() {
    return this.filterForm
      .get('byFinalAsset')
      .valueChanges.pipe(
        debounceTime(500),
        switchMap(() => this.loadAnalytics()),
        tap(() => this.buildColumns())
      )
      .subscribe(() => console.log('Final asset checkbox changed. Data reloaded'));
  }

  filterChangesListener() {
    return this.filter.subscribe(filter => {
      console.log('Filter changed', filter);
      this.loadAnalytics()
        .pipe(tap(() => this.buildColumns()))
        .subscribe(() => console.log('Filter changed. Data reloaded'));
    });
  }

  ////////////////////////////////////////////////////////
  // Data load
  private loadAnalytics(group?: Grouped<Account>): Observable<AnalyticsGroupedResult[]> {
    const datetime: Date = this.filterForm.get('datetime').value;
    datetime.setHours(23, 59, 59);

    const byFinalAsset = this.filterForm.get('byFinalAsset').value;

    const filterWithEndDate = this.filter.getValue().withEndDate(datetime);

    const byAccountsGroups: Observable<AnalyticsGroupedResult[]> = this.analyticsClient.grouped(
      filterWithEndDate.groupBy(AnalyticsGroupBy.AccountGroup, byFinalAsset)
    );

    const byAccount: (groupId: string) => Observable<AnalyticsGroupedResult[]> = (groupId: string) => {
      const finalFilter = filterWithEndDate.withAccountGroup(groupId);
      return this.analyticsClient.grouped(finalFilter.groupBy(AnalyticsGroupBy.Account, byFinalAsset));
    };

    const totalBalance: Observable<AnalyticsGroupedResult[]> = this.analyticsClient
      .aggregated(filterWithEndDate.aggregate(byFinalAsset))
      .pipe(map(assetAmount => [{ group: 'total-balance', assets: assetAmount }]));

    let dataToLoad: Observable<AnalyticsGroupedResult[]>[] = [];

    // load data for one category group if group parameter specified, otherwise reload all data
    if (group) {
      dataToLoad.push(byAccount(group.id));
    } else {
      const forExpandedGroup = this.expandedGroup ? [byAccount(this.expandedGroup.id)] : [];
      dataToLoad = forExpandedGroup.concat(byAccountsGroups, totalBalance);
    }

    this.isLoading = true;

    return forkJoin(dataToLoad).pipe(
      map(res => res.flatMap(v => v)),
      tap(res => this.setLocalAnalyticsResults(res, !group)),
      tap(() => (this.isLoading = false))
    );
  }

  private setLocalAnalyticsResults(results: AnalyticsGroupedResult[], isFullReload: boolean) {
    if (isFullReload) {
      this.analyticsResults = new Map();
    }
    results.forEach(result => this.analyticsResults.set(result.group, this.assetAmountToMap(result.assets)));
  }

  private assetAmountToMap(assetAmount: AssetAmount[]): Map<string, number> {
    return new Map(assetAmount.map(asset => [asset.asset, asset.amount]));
  }
}
