import { Pipe, PipeTransform } from '@angular/core';
import { Asset, AssetType } from '@walletstate/angular-client';

@Pipe({
  name: 'assetsFilter',
  standalone: true,
})
export class AssetsFilterPipe implements PipeTransform {
  transform(assets: Asset[], assetType: AssetType): Asset[] {
    return assets.filter(a => a.type === assetType);
  }
}
