import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  CategoriesHttpClient,
  Category,
  CategoryData,
  Grouped,
  GroupsHttpClient,
  GroupType,
} from '@walletstate/angular-client';
import { GroupsService } from './groups.service';
import { GroupedInterface } from './grouped.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService extends GroupsService<Category> implements GroupedInterface<Category> {
  private _categoriesMap: Map<string, Category> = new Map();

  constructor(
    private categoriesClient: CategoriesHttpClient,
    groupsClient: GroupsHttpClient
  ) {
    super(groupsClient, GroupType.Categories);
  }

  category(id: string): Category {
    return this._categoriesMap.get(id);
  }

  protected override updateLocalState(
    newGroupsFn: (currentGroups: Grouped<Category>[]) => Grouped<Category>[]
  ): Grouped<Category>[] {
    const updateStateFunc = (current: Grouped<Category>[]) => {
      const updated = newGroupsFn(current);
      this._categoriesMap = new Map(updated.flatMap(g => (g.items ?? []).map(c => [c.id, c])));
      return updated;
    };

    return super.updateLocalState(updateStateFunc);
  }

  loadGrouped(): Observable<Grouped<Category>[]> {
    return this.categoriesClient.listGrouped().pipe(
      tap(groupedCategories => {
        this.updateLocalState(() => groupedCategories);
      })
    );
  }

  create(data: CategoryData): Observable<Category> {
    return this.categoriesClient.create(data).pipe(
      tap(category => {
        this.updateLocalState((current: Grouped<Category>[]) => {
          const group = current.find(g => g.id === data.group);
          group.items ? group.items.push(category) : (group.items = [category]);
          return current.sort((g1, g2) => g1.idx - g2.idx);
        });
      })
    );
  }

  update(id: string, group: string, data: CategoryData): Observable<void> {
    return this.categoriesClient.update(id, data).pipe(
      tap(() => {
        this.updateLocalState((current: Grouped<Category>[]) => {
          //maybe just reload grouped categories
          const groupForDelete = current.find(g => g.id === group);
          const category = groupForDelete.items.find(c => c.id === id);
          const index = groupForDelete.items.indexOf(category);
          groupForDelete.items.splice(index, 1);
          Object.assign(category, data);

          const groupForAdd = current.find(g => g.id === data.group);
          groupForAdd.items ? groupForAdd.items.push(category) : (groupForAdd.items = [category]);
          groupForAdd.items.sort((c1, c2) => c1.idx - c2.idx);

          return current.sort((g1, g2) => g1.idx - g2.idx);
        });
      })
    );
  }
}
