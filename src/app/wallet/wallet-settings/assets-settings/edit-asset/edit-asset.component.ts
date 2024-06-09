import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Asset, AssetData, AssetType } from '@walletstate/angular-client';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IconsDialogComponent } from '../../../../shared/utils/icons-dialog/icons-dialog.component';

@Component({
  selector: 'app-edit-asset',
  templateUrl: './edit-asset.component.html',
  styleUrl: './edit-asset.component.scss',
})
export class EditAssetComponent implements OnInit {
  @Input() asset?: Asset = null;
  @Input() group?: string = null;
  @Input() idx?: number = null;

  @Output() save = new EventEmitter<AssetData>();
  @Output() discard = new EventEmitter<void>();

  defaultIcon = 'b0a03cea92532d56e7dec9848fb81c51b4c80a55721b17fd245bfc90f94df314';
  assetForm;

  assetTypes: AssetType[] = Object.values(AssetType);

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.assetForm = this.buildForm();
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
