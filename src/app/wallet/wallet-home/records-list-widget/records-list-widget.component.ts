import { Component, OnInit } from '@angular/core';
import {
  AnalyticsHttpClient,
  RecordsHttpClient,
  RecordSingleTransaction,
  RecordType,
} from '@walletstate/angular-client';
import { AppAnalyticsFilter } from '../../analytics/analytics-filter/analytics-filter.model';
import { map } from 'rxjs/operators';
import { AccountsService } from '../../shared/accounts.service';
import { AssetsService } from '../../shared/assets.service';
import { CategoriesService } from '../../shared/categories.service';
import { AccountIcon, AssetIcon, CategoryIcon, IncomeIcon, SpendingIcon, TransferIcon } from '../../../shared/icons';
import { openRecordDialog } from '../../shared/record-dialog/record-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-records-list-widget',
  templateUrl: './records-list-widget.component.html',
  styleUrl: './records-list-widget.component.scss',
})
export class RecordsListWidgetComponent implements OnInit {
  records: RecordSingleTransaction[] = [];

  constructor(
    public accountsService: AccountsService,
    public assetsService: AssetsService,
    public categoriesService: CategoriesService,
    private analyticsClient: AnalyticsHttpClient,
    private recordsClient: RecordsHttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadRecords();
  }

  loadRecords() {
    this.analyticsClient
      .records(AppAnalyticsFilter.empty().withEndDate(new Date()))
      .pipe(map(page => page.items))
      .subscribe(records => (this.records = records));
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

  deleteRecord(id: string) {
    this.recordsClient.delete(id).subscribe(() => this.loadRecords());
  }

  editRecord(id: string) {
    this.recordsClient.get(id).subscribe(record => {
      openRecordDialog(this.dialog, record).subscribe(() => this.loadRecords());
    });
  }

  protected readonly defaultCategoryIcon = CategoryIcon;
  protected readonly defaultAccountIcon = AccountIcon;
  protected readonly defaultAssetIcon = AssetIcon;
}
