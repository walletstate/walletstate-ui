import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Account, Asset, CreateAccount, UpdateAccount } from '@walletstate/angular-client';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IconsDialogComponent } from '../../../../shared/utils/icons-dialog/icons-dialog.component';
import { AssetsService } from '../../../shared/assets.service';
import { AssetIcon } from '../../../../shared/icons';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrl: './edit-account.component.scss',
})
export class EditAccountComponent implements OnInit {
  @Input() account?: Account = null;
  @Input() group?: string = null;
  @Input() idx?: number = null;

  @Output() save = new EventEmitter<CreateAccount | UpdateAccount>();
  @Output() discard = new EventEmitter<void>();

  defaultIcon = 'b0a03cea92532d56e7dec9848fb81c51b4c80a55721b17fd245bfc90f94df314';
  readonly defaultAssetIcon = AssetIcon;
  accountForm;

  getAssetId = (asset: Asset) => asset.id;
  getAssetTicker = (asset: Asset) => asset.ticker;
  getAssetIcon = (asset: Asset) => asset.icon;

  constructor(
    public assetsService: AssetsService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.assetsService.loadGrouped().subscribe();
    this.accountForm = this.buildForm();
  }

  buildForm() {
    return this.fb.group({
      name: this.fb.control(this.account?.name, [Validators.required]),
      icon: this.fb.control(this.account?.icon),
      tags: this.fb.control([...(this.account?.tags ?? [])]),
      defaultAsset: this.fb.control(this.account?.defaultAsset, []),
      group: this.fb.control(this.account?.group ?? this.group),
      idx: this.fb.control(this.account?.idx ?? this.idx),
    });
  }

  onSubmit() {
    this.save.emit(this.accountForm.value);
  }

  onClose(): void {
    this.discard.emit();
  }

  openIconsModal(): void {
    const dialogRef = this.dialog.open(IconsDialogComponent, {
      height: '400px',
      width: '600px',
      data: { tag: 'accounts' },
    });

    dialogRef.afterClosed().subscribe(iconId => {
      if (iconId) this.accountForm.patchValue({ icon: iconId });
    });
  }
}
