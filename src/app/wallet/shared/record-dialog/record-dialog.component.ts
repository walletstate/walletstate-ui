import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountsService } from '../accounts.service';
import { CategoriesService } from '../categories.service';
import { AssetsService } from '../assets.service';
import { Observable } from 'rxjs';
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

@Component({
  selector: 'app-record-dialog',
  templateUrl: './record-dialog.component.html',
  styleUrl: './record-dialog.component.scss',
})
export class RecordDialogComponent implements OnInit {
  @Input() record?: FullRecord = null;

  assets: Observable<Asset[]>;
  accounts: Observable<Grouped<Account>[]>;
  categories: Observable<Grouped<Category>[]>;

  recordType = RecordType;
  assetTypes: AssetType[] = Object.values(AssetType);
  recordForm;

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

    this.assetsService.list().subscribe();
    this.accountsService.getGrouped().subscribe();
    this.categoriesService.getGrouped().subscribe();

    console.log('record', this.record);
    this.recordForm = this.initForm(this.record);
    this.disableFormFields(this.recordForm.get('type').value ?? RecordType.Transfer);

    //todo unsubscribe
    this.recordForm.controls['type'].valueChanges.subscribe(v => this.disableFormFields(v));
  }

  initForm(record?: FullRecord) {
    return this.fb.group({
      type: [record?.type ?? RecordType.Transfer, [Validators.required]],
      from: this.fromToGroup(record?.from),
      to: this.fromToGroup(record?.to),
      category: [record?.category, [Validators.required]],
      datetime: [record?.datetime ?? new Date(), [Validators.required]],
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

  disableFormFields(type: RecordType) {
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
