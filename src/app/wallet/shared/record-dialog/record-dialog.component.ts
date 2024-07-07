import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AccountsService } from '../accounts.service';
import { CategoriesService } from '../categories.service';
import { AssetsService } from '../assets.service';
import {
  Account,
  Asset,
  AssetType,
  Category,
  RecordFull,
  RecordsHttpClient,
  RecordType,
  TransactionData,
} from '@walletstate/angular-client';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountIcon, AssetIcon, CategoryIcon } from '../../../shared/icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-record-dialog',
  templateUrl: './record-dialog.component.html',
  styleUrl: './record-dialog.component.scss',
})
export class RecordDialogComponent implements OnInit {
  @Input() record?: RecordFull = null;

  recordType = RecordType;
  recordForm;

  readonly defaultAssetIcon = AssetIcon;
  readonly defaultAccountIcon = AccountIcon;
  readonly defaultCategoryIcon = CategoryIcon;
  getItemId = (item: Account | Category | Asset) => item.id;
  getItemName = (item: Account | Category | Asset) => item.name;
  getItemIcon = (item: Account | Category | Asset) => item.icon;
  getAssetTicker = (asset: Asset) => asset.ticker;
  notFiat = (asset: Asset) => asset.type !== AssetType.Fiat;

  constructor(
    public accountsService: AccountsService,
    public categoriesService: CategoriesService,
    public assetsService: AssetsService,
    private recordsClient: RecordsHttpClient,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RecordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { record: RecordFull }
  ) {
    this.record = data?.record;
  }

  ngOnInit(): void {
    this.assetsService.loadGrouped().subscribe();
    this.accountsService.loadGrouped().subscribe();
    this.categoriesService.loadGrouped().subscribe();

    this.recordForm = this.initForm(this.record);
    this.disableFormFields(this.recordForm.get('type').value ?? RecordType.Transfer);

    //todo unsubscribe
    this.recordForm.controls['type'].valueChanges.subscribe(v => this.disableFormFields(v));
    this.recordForm
      .get('from')
      .get('account')
      .valueChanges.subscribe(accountId => {
        if (accountId && !this.recordForm.get('from').get('asset').touched) {
          this.recordForm.get('from').get('asset').patchValue(this.accountsService.account(accountId).defaultAsset);
        }
      });
    this.recordForm
      .get('to')
      .get('account')
      .valueChanges.subscribe(accountId => {
        if (accountId && !this.recordForm.get('to').get('asset').touched) {
          this.recordForm.get('to').get('asset').patchValue(this.accountsService.account(accountId).defaultAsset);
        }
      });
  }

  initForm(record?: RecordFull) {
    const datetime = record?.datetime ? new Date(record.datetime) : new Date();
    return this.fb.group({
      type: [record?.type ?? RecordType.Transfer, [Validators.required]],
      from: this.fromToGroup(record?.from),
      to: this.fromToGroup(record?.to),
      category: [record?.category, [Validators.required]],
      datetime: [datetime, [Validators.required]],
      time: [this.getTime(datetime), [Validators.required]],
      description: [record?.description, []],
      tags: [[...(record?.tags ?? [])], []],
      externalId: [record?.externalId],
      spentOn: [record?.spentOn],
      generatedBy: [record?.generatedBy],
    });
  }

  fromToGroup(data?: TransactionData) {
    return this.fb.group(
      {
        account: [data?.account, [Validators.required]],
        asset: [data?.asset, [Validators.required]],
        amount: [data?.amount, [Validators.required]],
      },
      {}
    );
  }

  onSubmit() {
    const [hours, minutes] = this.recordForm.get('time').value.split(':');
    this.recordForm.get('datetime').value.setHours(hours, minutes);

    if (this.record) {
      this.recordsClient.update(this.record.id, this.recordForm.value).subscribe(rs => {
        console.log('updated', rs);
        //todo handle this more correctly/remove from list if current account changed/sort if date changes
        Object.assign(this.record, rs);
        this.dialogRef.close();
      });
    } else {
      this.recordsClient.create(this.recordForm.value).subscribe(rs => {
        console.log('created', rs);
        this.dialogRef.close();
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  private getTime(dateTime: Date) {
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  }

  private disableFormFields(type: RecordType) {
    switch (type) {
      case RecordType.Income:
        this.recordForm.get('from').reset();
        this.recordForm.get('from').disable();
        this.recordForm.get('to').enable();
        this.recordForm.get('to').patchValue(this.record?.to);
        this.recordForm.get('spentOn').reset();
        this.recordForm.get('spentOn').disable();
        this.recordForm.get('generatedBy').enable();
        this.recordForm.get('generatedBy').patchValue(this.record?.generatedBy);
        break;
      case RecordType.Spending:
        this.recordForm.get('from').enable();
        this.recordForm.get('from').patchValue(this.record?.from);
        this.recordForm.get('to').reset();
        this.recordForm.get('to').disable();
        this.recordForm.get('spentOn').enable();
        this.recordForm.get('spentOn').patchValue(this.record?.spentOn);
        this.recordForm.get('generatedBy').disable();
        this.recordForm.get('generatedBy').reset();
        break;
      case RecordType.Transfer:
        this.recordForm.get('from').enable();
        this.recordForm.get('from').patchValue(this.record?.from);
        this.recordForm.get('to').enable();
        this.recordForm.get('to').patchValue(this.record?.to);
        this.recordForm.get('spentOn').enable();
        this.recordForm.get('spentOn').patchValue(this.record?.spentOn);
        this.recordForm.get('generatedBy').enable();
        this.recordForm.get('generatedBy').patchValue(this.record?.generatedBy);
        break;
    }
  }
}

export function openRecordDialog(dialog: MatDialog, record?: RecordFull): Observable<any> {
  const dialogRef = dialog.open(RecordDialogComponent, {
    width: '800px',
    panelClass: 'modal-panel',
    data: { record },
  });

  return dialogRef.afterClosed();
}
