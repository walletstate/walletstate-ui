import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AppAnalyticsFilter } from '../../analytics-filter/analytics-filter.model';
import { AnalyticsHttpClient, RecordSingleTransaction } from '@walletstate/angular-client';

@Component({
  selector: 'app-records-list-modal',
  templateUrl: './records-list-modal.component.html',
  styleUrl: './records-list-modal.component.scss',
})
export class RecordsListModalComponent implements OnInit {
  filter: AppAnalyticsFilter;
  records: RecordSingleTransaction[] = [];

  constructor(
    private analyticsClient: AnalyticsHttpClient,
    @Inject(MAT_DIALOG_DATA) public data: { filter: AppAnalyticsFilter }
  ) {
    this.filter = data.filter;
  }

  ngOnInit(): void {
    this.analyticsClient.records(this.filter).subscribe(page => {
      console.log(page);
      this.records = page.items;
    });
  }
}

export function openRecordsListDialog(dialog: MatDialog, filter: AppAnalyticsFilter): Observable<any> {
  const dialogRef = dialog.open(RecordsListModalComponent, {
    width: '500px',
    maxHeight: '500px',
    data: { filter },
  });

  return dialogRef.afterClosed();
}
