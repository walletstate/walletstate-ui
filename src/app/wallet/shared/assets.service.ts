import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Asset, AssetsHttpClient, CreateAsset, UpdateAsset } from '@walletstate/angular-client';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  assets: BehaviorSubject<Asset[]> = new BehaviorSubject<Asset[]>([]);
  assetsMap: BehaviorSubject<Map<string, Asset>> = new BehaviorSubject<Map<string, Asset>>(new Map());

  constructor(private assetsClient: AssetsHttpClient) {}

  list(): Observable<Asset[]> {
    return this.assetsClient.list().pipe(
      map(assets => {
        this.updateLocalData(assets);
        return assets;
      })
    );
  }

  create(data: CreateAsset): Observable<Asset> {
    return this.assetsClient.create(data).pipe(
      map(asset => {
        this.updateLocalData([...this.assets.value, asset]);
        return asset;
      })
    );
  }

  update(id: string, data: UpdateAsset): Observable<Asset> {
    return this.assetsClient.update(id, data).pipe(
      map(() => {
        const asset = this.assets.value.find(a => a.id === id);
        Object.assign(asset, data);
        this.updateLocalData([...this.assets.value]);
        return asset;
      })
    );
  }

  private updateLocalData(assets: Asset[]) {
    this.assets.next(assets);
    this.assetsMap.next(new Map(assets.map(a => [a.id, a])));
  }
}
