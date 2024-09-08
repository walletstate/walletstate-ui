import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AnalyticsGroupBy,
  AnalyticsGroupedResult,
  AnalyticsHttpClient,
  Asset,
  AssetAmount,
  Category,
  Grouped,
  RecordType,
} from '@walletstate/angular-client';
import { CategoriesService } from '../../shared/categories.service';
import { AssetsService } from '../../shared/assets.service';
import { AppAnalyticsFilter } from '../analytics-filter/analytics-filter.model';
import { BehaviorSubject, debounceTime, EMPTY, filter, forkJoin, Observable, Subscription, switchMap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { map, tap } from 'rxjs/operators';
import { openRecordsListDialog } from './records-list-modal/records-list-modal.component';
import { MatDialog } from '@angular/material/dialog';

type DataSourceValueType = Grouped<Category> | Category;
type Period = 'first' | 'second';

@Component({
  selector: 'app-analytics-by-category-table',
  templateUrl: './analytics-by-category-table.component.html',
  styleUrl: './analytics-by-category-table.component.scss',
})
export class AnalyticsByCategoryTableComponent implements OnInit, OnDestroy {
  // sidebar filter
  @Input() filter: BehaviorSubject<AppAnalyticsFilter>;
  // top row filter
  filterForm: FormGroup;

  periods: Period[] = ['first', 'second'];

  isLoading: boolean = false;

  filterSubscription: Subscription;
  recordTypeChangeSubscription: Subscription;
  firstPeriodChangeSubscription: Subscription;
  secondPeriodChangeSubscription: Subscription;
  finalAssetCheckboxChangeSubscription: Subscription;

  dataSource: MatTableDataSource<DataSourceValueType, MatPaginator> = new MatTableDataSource([]);

  headerColumns = ['name', 'first-header', 'second-header', 'diff-header', 'expand'];
  subheaderColumns = ['first', 'second', 'diff', 'expand'];
  valuesColumns = ['name', ...this.subheaderColumns];
  totalIncomeColumns = this.valuesColumns.map(c => this.totalIncomeColumn(c));
  totalSpendingColumns = this.valuesColumns.map(c => this.totalSpendingColumn(c));

  expandedGroup: Grouped<Category> | null;

  //
  allAssetsIds: string[] = [];
  nonZeroAssetsIds: string[] = [];

  readonly spendingRecordType = RecordType.Spending;
  readonly incomeRecordType = RecordType.Income;

  analyticsResults: Map<Period, Map<string, Map<string, number>>> = new Map([
    ['first', new Map()],
    ['second', new Map()],
  ]);

  currentFilters: Map<Period, AppAnalyticsFilter> = new Map([
    ['first', null],
    ['second', null],
  ]);

  constructor(
    private analyticsClient: AnalyticsHttpClient,
    private categoriesService: CategoriesService,
    private assetsService: AssetsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.filterForm = this.initFilterForm();

    this.assetsService.groups.subscribe(assetGroups => {
      this.allAssetsIds = assetGroups.flatMap(group => group.items.map(a => a.id));
      this.buildColumns();
    });

    this.dataSource.filterPredicate = (data, filter) =>
      this.isGroup(data) || (filter && data['group'] && data['group'] === filter);

    this.categoriesService.groups.subscribe(groups => {
      this.dataSource.data = groups.flatMap(group => [group, ...group.items]);
      this.dataSource.filter = 'none';
    });

    this.recordTypeChangeSubscription = this.recordTypeChangeListener();
    this.firstPeriodChangeSubscription = this.periodChangeListener('first');
    this.secondPeriodChangeSubscription = this.periodChangeListener('second');
    this.filterSubscription = this.filterChangesListener();
    this.finalAssetCheckboxChangeSubscription = this.finalAssetCheckboxListener();
  }

  ngOnDestroy(): void {
    this.filterSubscription && this.filterSubscription.unsubscribe();
    this.firstPeriodChangeSubscription && this.firstPeriodChangeSubscription.unsubscribe();
    this.secondPeriodChangeSubscription && this.secondPeriodChangeSubscription.unsubscribe();
    this.recordTypeChangeSubscription && this.recordTypeChangeSubscription.unsubscribe();
    this.finalAssetCheckboxChangeSubscription && this.finalAssetCheckboxChangeSubscription.unsubscribe();
  }

  toggleGroup(group: Grouped<Category>) {
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

  isGroup(item: DataSourceValueType): boolean {
    return !!item['items'];
  }

  //////////////////////////////////////
  // Filter changes listeners
  //////////////////////////////////////
  recordTypeChangeListener() {
    return this.filterForm
      .get('recordType')
      .valueChanges.pipe(
        switchMap(() => this.loadAnalytics()),
        tap(() => this.buildColumns())
      )
      .subscribe(() => console.log('Record type changed. data reloaded'));
  }

  periodChangeListener(period: Period) {
    return this.filterForm
      .get(period)
      .valueChanges.pipe(
        debounceTime(500),
        switchMap(periodValue => (periodValue.start && periodValue.end ? this.loadAnalyticsForPeriod(period) : EMPTY)),
        tap(() => this.buildColumns())
      )
      .subscribe(() => console.log(`${period} period changed. Data reloaded`));
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

  //////////////////////////////////////
  // analytics loading
  //////////////////////////////////////
  private loadAnalytics(group?: Grouped<Category>): Observable<AnalyticsGroupedResult[]> {
    return forkJoin(this.periods.map(period => this.loadAnalyticsForPeriod(period, group))).pipe(
      map(rs => rs.flatMap(r => r))
    );
  }

  private loadAnalyticsForPeriod(period: Period, group?: Grouped<Category>): Observable<AnalyticsGroupedResult[]> {
    const start: Date = this.filterForm.get(period).value.start;
    const end: Date = this.filterForm.get(period).value.end;

    start.setHours(0, 0, 0);
    end.setHours(23, 59, 59);

    const byFinalAsset = this.filterForm.get('byFinalAsset').value;

    const filterWithPeriod = this.filter.getValue().withPeriod(start, end);
    const filterWithSelectedRecordType = filterWithPeriod.withRecordType(this.filterForm.get('recordType').value);

    const byCategoryGroups: Observable<AnalyticsGroupedResult[]> = this.analyticsClient.grouped(
      filterWithSelectedRecordType.groupBy(AnalyticsGroupBy.CategoryGroup, byFinalAsset)
    );

    const byCategory: (groupId: string) => Observable<AnalyticsGroupedResult[]> = (groupId: string) => {
      const finalFilter = filterWithSelectedRecordType.withCategoryGroup(groupId);
      return this.analyticsClient.grouped(finalFilter.groupBy(AnalyticsGroupBy.Category, byFinalAsset));
    };

    const totalIncome: Observable<AnalyticsGroupedResult[]> = this.analyticsClient
      .aggregated(filterWithPeriod.withRecordType(RecordType.Income).aggregate(byFinalAsset))
      .pipe(map(assetAmount => [{ group: 'total-income', assets: assetAmount }]));

    const totalSpending: Observable<AnalyticsGroupedResult[]> = this.analyticsClient
      .aggregated(filterWithPeriod.withRecordType(RecordType.Spending).aggregate(byFinalAsset))
      .pipe(map(assetAmount => [{ group: 'total-spending', assets: assetAmount }]));

    const totalProfit: Observable<AnalyticsGroupedResult[]> = this.analyticsClient
      .aggregated(filterWithPeriod.withRecordTypes([RecordType.Spending, RecordType.Income]).aggregate(byFinalAsset))
      .pipe(map(assetAmount => [{ group: 'total-profit', assets: assetAmount }]));

    let dataToLoad: Observable<AnalyticsGroupedResult[]>[] = [];

    // load data for one category group if group parameter specified, otherwise reload all data
    if (group) {
      dataToLoad.push(byCategory(group.id));
    } else {
      const forExpandedGroup = this.expandedGroup ? [byCategory(this.expandedGroup.id)] : [];
      dataToLoad = forExpandedGroup.concat(byCategoryGroups, totalIncome, totalSpending, totalProfit);
    }

    this.isLoading = true;

    return forkJoin(dataToLoad).pipe(
      map(res => res.flatMap(v => v)),
      tap(res => this.setLocalAnalyticsResults(period, res, !group)),
      tap(() => this.setCurrentFilters(period, filterWithSelectedRecordType)),
      tap(() => (this.isLoading = false))
    );
  }

  private setLocalAnalyticsResults(period: Period, results: AnalyticsGroupedResult[], isFullReload: boolean) {
    if (isFullReload) {
      this.analyticsResults.set(period, new Map());
    }
    results.forEach(result =>
      this.analyticsResults.get(period).set(result.group, this.assetAmountToMap(result.assets))
    );
  }

  private assetAmountToMap(assetAmount: AssetAmount[]): Map<string, number> {
    return new Map(assetAmount.map(asset => [asset.asset, asset.amount]));
  }

  private setCurrentFilters(period: Period, filter: AppAnalyticsFilter) {
    this.currentFilters.set(period, filter);
  }

  //////////////////////////////////////
  // get columns values
  //////////////////////////////////////
  getColumnValue(period: Period, groupId: string, assetId: string): number {
    return this.analyticsResults.get(period).get(groupId)?.get(assetId) ?? 0;
  }

  // TODO validate and make correct calculations
  getDiffValue(groupId: string, assetId: string): string {
    const firstAbs = Math.abs(this.getColumnValue('first', groupId, assetId));
    const secondAbs = Math.abs(this.getColumnValue('second', groupId, assetId));
    if (firstAbs === 0 && secondAbs === 0) {
      return '';
    } else if (secondAbs === 0) {
      return '+100%';
    } else if (firstAbs >= secondAbs) {
      return `+${Math.round((firstAbs / secondAbs - 1) * 100)}%`;
    } else {
      return `-${Math.round((1 - firstAbs / secondAbs) * 100)}%`;
    }
  }

  getAsset(id: string): Asset {
    return this.assetsService.asset(id);
  }

  isAssetValueNotZero(id: string): boolean {
    return this.periods.some(
      p => this.getColumnValue(p, 'total-income', id) !== 0 || this.getColumnValue(p, 'total-spending', id) !== 0
    );
  }

  //////////////////////////////////////
  // build table columns
  //////////////////////////////////////
  assetColumn(period: Period | 'diff', id: string): string {
    return `${period}-${id}`;
  }

  assetColumns(period: Period | 'diff', ids: string[]): string[] {
    return ids.map(id => this.assetColumn(period, id));
  }

  totalIncomeColumn(name: string): string {
    return this.prefixedColumn('total-income', name);
  }

  totalSpendingColumn(name: string): string {
    return this.prefixedColumn('total-spending', name);
  }

  private prefixedColumn(prefix: string, name: string): string {
    return name === 'expand' ? name : `${prefix}-${name}`;
  }

  private buildColumns() {
    this.nonZeroAssetsIds = this.allAssetsIds.filter(assetId => this.isAssetValueNotZero(assetId));

    //show at least one column if each asset is zero
    if (this.nonZeroAssetsIds.length === 0 && this.allAssetsIds.length > 0)
      this.nonZeroAssetsIds = [this.allAssetsIds[0]];

    this.subheaderColumns = [
      ...this.assetColumns('first', this.nonZeroAssetsIds),
      ...this.assetColumns('second', this.nonZeroAssetsIds),
      ...this.assetColumns('diff', this.nonZeroAssetsIds),
      'expand',
    ];
    this.valuesColumns = ['name', ...this.subheaderColumns];
    this.totalIncomeColumns = this.valuesColumns.map(c => this.totalIncomeColumn(c));
    this.totalSpendingColumns = this.valuesColumns.map(c => this.totalSpendingColumn(c));
  }

  //////////////////////////////////////
  // Init filter form
  //////////////////////////////////////
  private initFilterForm(): FormGroup {
    // default periods: current and previous months
    const thisMonth = new Date();
    const prevMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() - 1);

    return new FormGroup({
      recordType: new FormControl<RecordType>(RecordType.Spending, [Validators.required]),
      first: this.initPeriodFormGroup(thisMonth),
      second: this.initPeriodFormGroup(prevMonth),
      byFinalAsset: new FormControl(false),
    });
  }

  private initPeriodFormGroup(date: Date): FormGroup {
    return new FormGroup({
      start: new FormControl(this.startOfTheMonth(date), [Validators.required]),
      end: new FormControl(this.endOfTheMonth(date), [Validators.required]),
    });
  }

  private startOfTheMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
  }

  private endOfTheMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
  }

  showRecordsList(period: Period, categoryId: string, assetId: string) {
    if (this.currentFilters.get(period)) {
      const filter = this.currentFilters.get(period).withCategory(categoryId).withAsset(assetId);
      openRecordsListDialog(this.dialog, filter).subscribe(rs => console.log(`closed ${rs}`));
    }
  }
}
