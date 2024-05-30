import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Asset,
  AssetsHttpClient,
  CreateAsset,
  Grouped,
  GroupsHttpClient,
  GroupType,
  UpdateAsset,
} from '@walletstate/angular-client';
import { tap } from 'rxjs/operators';
import { GroupsService } from './groups.service';
import { GroupedInterface } from './grouped.interface';

@Injectable({
  providedIn: 'root',
})
export class AssetsService extends GroupsService<Asset> implements GroupedInterface<Asset> {
  private _assetsMap: Map<string, Asset> = new Map();

  constructor(
    private assetsClient: AssetsHttpClient,
    groupsClient: GroupsHttpClient
  ) {
    super(groupsClient, GroupType.Assets);
  }

  asset(id: string): Asset {
    return this._assetsMap.get(id);
  }

  protected override updateLocalState(
    newGroupsFn: (currentGroups: Grouped<Asset>[]) => Grouped<Asset>[]
  ): Grouped<Asset>[] {
    const updateStateFunc = (current: Grouped<Asset>[]) => {
      const updated = newGroupsFn(current);
      this._assetsMap = new Map(updated.flatMap(g => (g.items ?? []).map(a => [a.id, a])));
      return updated;
    };

    return super.updateLocalState(updateStateFunc);
  }

  loadGrouped(): Observable<Grouped<Asset>[]> {
    return this.assetsClient.listGrouped().pipe(
      tap(groupedAssets => {
        this.updateLocalState(() => groupedAssets);
      })
    );
  }

  create(data: CreateAsset): Observable<Asset> {
    return this.assetsClient.create(data).pipe(
      tap(asset => {
        this.updateLocalState((current: Grouped<Asset>[]) => {
          const group = current.find(g => g.id === data.group);
          group.items ? group.items.push(asset) : (group.items = [asset]);
          return current.sort((g1, g2) => g1.idx - g2.idx);
        });
      })
    );
  }

  update(id: string, group: string, data: UpdateAsset): Observable<void> {
    return this.assetsClient.update(id, data).pipe(
      tap(() => {
        this.updateLocalState((current: Grouped<Asset>[]) => {
          //maybe just reload grouped accounts
          const groupForDelete = current.find(g => g.id === group);
          const asset = groupForDelete.items.find(a => a.id === id);
          const index = groupForDelete.items.indexOf(asset);
          groupForDelete.items.splice(index, 1);
          Object.assign(asset, data);
          const groupForAdd = current.find(g => g.id === data.group);
          groupForAdd.items ? groupForAdd.items.push(asset) : (groupForAdd.items = [asset]);
          groupForAdd.items.sort((a1, a2) => a1.idx - a2.idx);

          return current.sort((g1, g2) => g1.idx - g2.idx);
        });
      })
    );
  }
}
