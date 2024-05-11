import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountsService } from '../accounts.service';
import { CategoriesService } from '../categories.service';
import { AssetsService } from '../assets.service';
import { Observable, Subscription } from 'rxjs';
import {
  Account,
  Asset,
  AssetType,
  Category,
  Grouped,
  RecordsHttpClient,
  RecordType,
  FullRecord,
  TransactionData,
} from '@walletstate/angular-client';
import { FormBuilder, Validators } from '@angular/forms';
import { AccountIcon, AssetIcon, CategoryIcon } from '../../../shared/icons';

@Component({
  selector: 'app-record-dialog',
  templateUrl: './record-dialog.component.html',
  styleUrl: './record-dialog.component.scss',
})
export class RecordDialogComponent implements OnInit, OnDestroy {
  @Input() record?: FullRecord = null;

  assets: Observable<Asset[]>;
  accounts: Observable<Grouped<Account>[]>;
  accountsMap: Map<string, Account>;
  categories: Observable<Grouped<Category>[]>;

  recordType = RecordType;
  assetTypes: AssetType[] = Object.values(AssetType);
  recordForm;

  readonly defaultAssetIcon = AssetIcon;
  readonly defaultAccountIcon = AccountIcon;
  readonly defaultCategoryIcon = CategoryIcon;

  accountsMapSubscription: Subscription;

  constructor(
    private accountsService: AccountsService,
    private categoriesService: CategoriesService,
    private assetsService: AssetsService,
    private recordsClient: RecordsHttpClient,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RecordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { record: FullRecord }
  ) {
    this.record = data?.record;
  }

  ngOnInit(): void {
    this.assets = this.assetsService.assets.asObservable();
    this.accounts = this.accountsService.groups.asObservable();
    this.categories = this.categoriesService.groups.asObservable();
    this.accountsMapSubscription = this.accountsService.accountsMap.subscribe(map => (this.accountsMap = map));

    this.assetsService.list().subscribe();
    this.accountsService.getGrouped().subscribe();
    this.categoriesService.getGrouped().subscribe();

    this.recordForm = this.initForm(this.record);
    this.disableFormFields(this.recordForm.get('type').value ?? RecordType.Transfer);

    //todo unsubscribe
    this.recordForm.controls['type'].valueChanges.subscribe(v => this.disableFormFields(v));
    this.recordForm
      .get('from')
      .get('account')
      .valueChanges.subscribe(account => {
        if (account && !this.recordForm.get('from').get('asset').touched) {
          this.recordForm.get('from').get('asset').patchValue(this.accountsMap.get(account).defaultAsset);
        }
      });
    this.recordForm
      .get('to')
      .get('account')
      .valueChanges.subscribe(account => {
        if (account && !this.recordForm.get('to').get('asset').touched) {
          this.recordForm.get('to').get('asset').patchValue(this.accountsMap.get(account).defaultAsset);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.accountsMapSubscription) {
      this.accountsMapSubscription.unsubscribe();
    }
  }

  initForm(record?: FullRecord) {
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
        break;
      case RecordType.Spending:
        this.recordForm.get('from').enable();
        this.recordForm.get('from').patchValue(this.record?.from);
        this.recordForm.get('to').reset();
        this.recordForm.get('to').disable();
        break;
      case RecordType.Transfer:
        this.recordForm.get('from').enable();
        this.recordForm.get('from').patchValue(this.record?.from);
        this.recordForm.get('to').enable();
        this.recordForm.get('to').patchValue(this.record?.to);
        break;
    }
  }
}
