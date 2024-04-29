import { Component, OnDestroy, OnInit } from '@angular/core';
import { AssetsService } from '../../shared/assets.service';
import { Asset, AssetType, CreateAsset, UpdateAsset } from '@walletstate/angular-client';
import { Observable, Subscription } from 'rxjs';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-assets-settings',
  standalone: false,
  templateUrl: './assets-settings.component.html',
  styleUrl: './assets-settings.component.scss',
})
export class AssetsSettingsComponent implements OnInit, OnDestroy {
  assets: Observable<Asset[]>;

  assetTypes: AssetType[] = Object.values(AssetType);
  selectedAssetType: AssetType;

  constructor(private assetsService: AssetsService) {}

  ngOnInit(): void {
    this.assets = this.assetsService.assets.asObservable();
    this.assetsService.list().subscribe();
  }

  ngOnDestroy(): void {}

  selectAssetType(type: AssetType) {
    this.selectedAssetType = type;
  }

  updateAsset(id: string, data: UpdateAsset, panelRef: MatExpansionPanel) {
    this.assetsService.update(id, data).subscribe(rs => console.log(rs));
  }

  createAsset(data: CreateAsset, panelRef: MatExpansionPanel) {
    this.assetsService.create(data).subscribe(() => panelRef.close());
  }
}
