import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Asset, AssetsHttpClient, CreateAsset, UpdateAsset } from '@walletstate/angular-client';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  assets: BehaviorSubject<Asset[]> = new BehaviorSubject<Asset[]>([]);

  constructor(private assetsClient: AssetsHttpClient) {}

  list(): Observable<Asset[]> {
    return this.assetsClient.list().pipe(
      map(assets => {
        this.assets.next(assets);
        return assets;
      })
    );
  }

  create(data: CreateAsset): Observable<Asset> {
    return this.assetsClient.create(data).pipe(
      map(asset => {
        this.assets.next([...this.assets.value, asset]);
        return asset;
      })
    );
  }

  update(id: string, data: UpdateAsset): Observable<Asset> {
    return this.assetsClient.update(id, data).pipe(
      map(() => {
        const asset = this.assets.value.find(a => a.id === id);
        Object.assign(asset, data);
        return asset;
      })
    );
  }
}
