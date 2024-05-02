import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CategoriesHttpClient,
  Category,
  CreateCategory,
  Grouped,
  GroupsHttpClient,
  GroupType,
  UpdateCategory,
} from '@walletstate/angular-client';
import { GroupsService } from './groups.service';
import { GroupedInterface } from './grouped.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService extends GroupsService<Category> implements GroupedInterface<Category> {
  categoriesMap: Observable<Map<string, Category>> = this.groups.pipe(
    map(arr => new Map(arr.flatMap(g => g.items.map(c => [c.id, c]))))
  );

  constructor(
    private categoriesClient: CategoriesHttpClient,
    groupsClient: GroupsHttpClient
  ) {
    super(groupsClient, GroupType.Categories);
  }

  getGrouped(): Observable<Grouped<Category>[]> {
    return this.categoriesClient.listGrouped().pipe(
      map(groupedCategories => {
        this.groups.next(groupedCategories);
        return groupedCategories;
      })
    );
  }

  create(data: CreateCategory): Observable<Category> {
    return this.categoriesClient.create(data).pipe(
      map(category => {
        const group = this.groups.value.find(g => g.id === data.group);
        group.items ? group.items.push(category) : (group.items = [category]);
        this.groups.next(this.groups.value.sort((g1, g2) => g1.idx - g2.idx));
        return category;
      })
    );
  }

  update(id: string, group: string, data: UpdateCategory): Observable<Category> {
    return this.categoriesClient.update(id, data).pipe(
      map(() => {
        //maybe just reload grouped categories
        const groupForDelete = this.groups.value.find(g => g.id === group);
        const category = groupForDelete.items.find(c => c.id === id);
        const index = groupForDelete.items.indexOf(category);
        groupForDelete.items.splice(index, 1);
        Object.assign(category, data);

        const groupForAdd = this.groups.value.find(g => g.id === data.group);
        groupForAdd.items ? groupForAdd.items.push(category) : (groupForAdd.items = [category]);
        groupForAdd.items.sort((c1, c2) => c1.idx - c2.idx);

        this.groups.next(this.groups.value.sort((g1, g2) => g1.idx - g2.idx));
        return category;
      })
    );
  }
}
