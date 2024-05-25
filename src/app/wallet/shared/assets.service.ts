import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Asset, AssetsHttpClient, CreateAsset, UpdateAsset } from '@walletstate/angular-client';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  private _assets: BehaviorSubject<Asset[]> = new BehaviorSubject<Asset[]>([]);
  private _assetsMap: Map<string, Asset> = new Map();

  constructor(private assetsClient: AssetsHttpClient) {}

  get assets(): Observable<Asset[]> {
    return this._assets.asObservable();
  }

  asset(id: string): Asset {
    return this._assetsMap.get(id);
  }

  private updateLocalState(newAssetsFn: (current: Asset[]) => Asset[]): Asset[] {
    const updatedAssets: Asset[] = newAssetsFn([...this._assets.value]);
    this._assetsMap = new Map(updatedAssets.map(a => [a.id, a]));
    this._assets.next(updatedAssets);
    return updatedAssets;
  }

  loadAssets(): Observable<Asset[]> {
    return this.assetsClient.list().pipe(
      tap(assets => {
        this.updateLocalState(() => assets);
      })
    );
  }

  create(data: CreateAsset): Observable<Asset> {
    return this.assetsClient.create(data).pipe(
      tap(asset => {
        this.updateLocalState(current => [...current, asset]);
      })
    );
  }

  update(id: string, data: UpdateAsset): Observable<void> {
    return this.assetsClient.update(id, data).pipe(
      tap(() => {
        this.updateLocalState((current: Asset[]) => {
          const asset = current.find(a => a.id === id);
          Object.assign(asset, data);
          return [...current];
        });
      })
    );
  }
}
