import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Account, Asset, AssetData, AssetType, Category } from '@walletstate/angular-client';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IconsDialogComponent } from '../../../../shared/utils/icons-dialog/icons-dialog.component';
import { AssetIcon } from '../../../../shared/icons';
import { AssetsService } from '../../../shared/assets.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-asset',
  templateUrl: './edit-asset.component.html',
  styleUrl: './edit-asset.component.scss',
})
export class EditAssetComponent implements OnInit, OnDestroy {
  @Input() asset?: Asset = null;
  @Input() group?: string = null;
  @Input() idx?: number = null;

  @Output() save = new EventEmitter<AssetData>();
  @Output() discard = new EventEmitter<void>();

  defaultIcon = 'b0a03cea92532d56e7dec9848fb81c51b4c80a55721b17fd245bfc90f94df314';
  assetForm;

  assetTypes: AssetType[] = Object.values(AssetType);

  getItemId = (item: Asset) => item.id;
  getItemIcon = (item: Asset) => item.icon;
  getAssetTicker = (asset: Asset) => asset.ticker;
  isFiatOrCrypto = (asset: Asset) => asset.type === AssetType.Fiat || asset.type === AssetType.Crypto;

  private assetTypeChangeSubscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    public assetsService: AssetsService
  ) {}

  ngOnInit() {
    this.assetForm = this.buildForm();

    if (this.assetForm.get('type').value === AssetType.Fiat || this.assetForm.get('type').value === AssetType.Crypto) {
      this.assetForm.get('denominatedIn').disable();
      this.assetForm.get('denomination').disable();
    } else {
      this.assetForm.get('denominatedIn').enable();
      this.assetForm.get('denomination').enable();
    }

    this.assetTypeChangeSubscription = this.assetForm.get('type').valueChanges.subscribe(newType => {
      if (newType === AssetType.Fiat || newType === AssetType.Crypto) {
        this.assetForm.get('denominatedIn').patchValue(null);
        this.assetForm.get('denominatedIn').disable();
        this.assetForm.get('denomination').patchValue(null);
        this.assetForm.get('denomination').disable();
      } else {
        this.assetForm.get('denominatedIn').patchValue(this.asset?.denominatedIn);
        this.assetForm.get('denominatedIn').enable();
        this.assetForm.get('denomination').patchValue(this.asset?.denomination);
        this.assetForm.get('denomination').enable();
      }
    });
  }

  ngOnDestroy(): void {
    this.assetTypeChangeSubscription && this.assetTypeChangeSubscription.unsubscribe();
  }

  buildForm() {
    return this.fb.group({
      type: this.fb.control(this.asset?.type, [Validators.required]),
      ticker: this.fb.control(this.asset?.ticker, [Validators.required]),
      name: this.fb.control(this.asset?.name, [Validators.required]),
      icon: this.fb.control(this.asset?.icon),
      tags: this.fb.control([...(this.asset?.tags ?? [])]),
      group: this.fb.control(this.asset?.group ?? this.group),
      idx: this.fb.control(this.asset?.idx ?? this.idx),
      denominatedIn: this.fb.control(this.asset?.denominatedIn),
      denomination: this.fb.control(this.asset?.denomination),
    });
  }

  onSubmit() {
    this.save.emit(this.assetForm.value);
  }

  onClose(): void {
    this.discard.emit();
  }

  openIconsModal(): void {
    const dialogRef = this.dialog.open(IconsDialogComponent, {
      height: '400px',
      width: '600px',
      data: { tag: 'assets' },
    });

    dialogRef.afterClosed().subscribe(iconId => {
      if (iconId) this.assetForm.patchValue({ icon: iconId });
    });
  }
}
