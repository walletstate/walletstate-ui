import { Component } from '@angular/core';
import { AssetsService } from '../../shared/assets.service';
import { Asset, AssetData, Grouped } from '@walletstate/angular-client';
import { MatExpansionPanel } from '@angular/material/expansion';
import { AssetIcon } from '../../../shared/icons';

@Component({
  selector: 'app-assets-settings',
  standalone: false,
  templateUrl: './assets-settings.component.html',
  styleUrl: './assets-settings.component.scss',
})
export class AssetsSettingsComponent {
  group: Grouped<Asset> = null;

  readonly defaultIcon = AssetIcon;

  constructor(public assetsService: AssetsService) {}

  onSelectGroup(grouped: Grouped<Asset>) {
    this.group = grouped;
  }

  updateAsset(id: string, group: string, data: AssetData) {
    this.assetsService.update(id, group, data).subscribe(rs => console.log(rs));
  }

  createAsset(data: AssetData, panelRef: MatExpansionPanel) {
    this.assetsService.create(data).subscribe(() => panelRef.close());
  }
}
