import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
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
    private dialogRef: MatDialogRef<RecordDialogComponent>
  ) {}

  ngOnInit(): void {
    this.assets = this.assetsService.assets.asObservable();
    this.accounts = this.accountsService.groups.asObservable();
    this.categories = this.categoriesService.groups.asObservable();

    this.assetsService.list().subscribe();
    this.accountsService.getGrouped().subscribe();
    this.categoriesService.getGrouped().subscribe();

    this.recordForm = this.initForm(RecordType.Spending);
    this.recordForm.get('to').disable();
    this.recordForm.controls['type'].valueChanges.subscribe(v => {
      switch (v) {
        case RecordType.Income:
          this.recordForm.get('from').reset();
          this.recordForm.get('from').disable();
          this.recordForm.get('to').enable();
          this.recordForm.get('to').patchValue(this.record?.to);
          break;
        case RecordType.Spending:
          this.recordForm.get('from').enable();
          this.recordForm.get('from').patchValue(this.record?.to);
          this.recordForm.get('to').reset();
          this.recordForm.get('to').disable();
          break;
        case RecordType.Transfer:
          this.recordForm.get('from').enable();
          this.recordForm.get('from').patchValue(this.record?.to);
          this.recordForm.get('to').enable();
          this.recordForm.get('to').patchValue(this.record?.to);
          break;
      }
    });
  }

  initForm(type: RecordType) {
    return this.fb.group({
      type: [type, [Validators.required]],
      from: this.fromToGroup(),
      to: this.fromToGroup(),
      category: [null, [Validators.required]],
      datetime: [new Date(), [Validators.required]],
      description: ['', []],
      tags: [[], []],
      externalId: [null],
      spentOn: [null],
      generatedBy: [null],
    });
  }

  fromToGroup() {
    return this.fb.group(
      {
        account: [null, [Validators.required]],
        asset: [null, [Validators.required]],
        amount: [null, [Validators.required]],
      },
      {}
    );
  }

  onSubmit() {
    this.recordsClient.create(this.recordForm.value).subscribe(rs => {
      console.log(rs);
      this.dialogRef.close();
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
