import { Component, OnDestroy, OnInit } from '@angular/core';
import { AssetsService } from '../../../shared/assets.service';
import {
  Account,
  AccountsHttpClient,
  Asset,
  AssetBalance,
  Category,
  FullRecord,
  Page,
  RecordsHttpClient,
  RecordType,
} from '@walletstate/angular-client';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { CategoriesService } from '../../../shared/categories.service';
import { AccountIcon, AssetIcon, CategoryIcon, IncomeIcon, SpendingIcon, TransferIcon } from '../../../../shared/icons';
import { AccountsService } from '../../../shared/accounts.service';
import { RecordDialogComponent } from '../../../shared/record-dialog/record-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-account-records',
  templateUrl: './account-records.component.html',
  styleUrls: ['./account-records.component.scss'],
})
export class AccountRecordsComponent implements OnInit, OnDestroy {
  account?: string = null;
  records: FullRecord[] = [];
  nextPageToken?: string = null;

  isLoading: boolean = false;

  assetsMap: Map<string, Asset>;
  categoriesMap: Map<string, Category>;
  accountsMap: Map<string, Account>;

  readonly recordType = RecordType;
  readonly defaultAssetIcon = AssetIcon;
  readonly defaultAccountIcon = AccountIcon;
  readonly defaultCategoryIcon = CategoryIcon;

  paramsSubscription: Subscription;
  assetsMapSubscription: Subscription;
  categoriesMapSubscription: Subscription;
  accountsMapSubscription: Subscription;

  constructor(
    private assetsService: AssetsService,
    private categoriesService: CategoriesService,
    private accountsService: AccountsService,
    private accountsClient: AccountsHttpClient,
    private recordsClient: RecordsHttpClient,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.assetsMapSubscription = this.assetsService.assetsMap.subscribe(map => (this.assetsMap = map));
    this.categoriesMapSubscription = this.categoriesService.categoriesMap.subscribe(map => (this.categoriesMap = map));
    this.accountsMapSubscription = this.accountsService.accountsMap.subscribe(map => (this.accountsMap = map));
    this.assetsService.list().subscribe();
    this.categoriesService.getGrouped().subscribe();
    this.accountsService.getGrouped().subscribe();

    this.paramsSubscription = this.route.parent.paramMap
      .pipe(
        switchMap(params => {
          this.account = params.get('id');
          this.isLoading = true;
          return this.accountsClient.listRecords(params.get('id'));
        })
      )
      .subscribe(page => {
        this.records = page.items;
        this.isLoading = false;
        this.nextPageToken = page.nextPage;
      });
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
    if (this.assetsMapSubscription) {
      this.assetsMapSubscription.unsubscribe();
    }
    if (this.categoriesMapSubscription) {
      this.categoriesMapSubscription.unsubscribe();
    }
    if (this.accountsMapSubscription) {
      this.accountsMapSubscription.unsubscribe();
    }
  }

  private limitForLoadingReached(currentIndex) {
    return this.records.length < currentIndex + 30;
  }

  loadMore(index) {
    console.log('on scroll ', index);
    if (this.account && this.nextPageToken && !this.isLoading && this.limitForLoadingReached(index)) {
      this.isLoading = true;
      this.accountsClient.listRecords(this.account, this.nextPageToken).subscribe(page => {
        this.records = this.records.concat(page.items);
        this.isLoading = false;
        this.nextPageToken = page.nextPage;
        console.log('load more');
      });
    }
  }

  recordTypeIcon(type: RecordType): string {
    switch (type) {
      case RecordType.Income:
        return IncomeIcon;
      case RecordType.Spending:
        return SpendingIcon;
      case RecordType.Transfer:
        return TransferIcon;
    }
  }

  getCategory(id: string): Category {
    return this.categoriesMap.get(id);
  }

  getAsset(id: string): Asset {
    return this.assetsMap.get(id);
  }

  getAccount(id: string): Account {
    return this.accountsMap.get(id);
  }

  editRecord(record: FullRecord): void {
    const dialogRef = this.dialog.open(RecordDialogComponent, {
      // height: '400px',
      width: '800px',
      data: { record },
    });

    dialogRef.afterClosed().subscribe(() => console.log('closed'));
  }

  deleteRecord(id: string) {
    this.recordsClient.delete(id).subscribe(() => {
      this.records = this.records.filter(r => r.id !== id);
    });
  }
}
