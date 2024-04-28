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
} from '@walletstate/angular-client';
import { GroupsService } from './groups.service';
import { GroupedInterface } from './grouped.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService extends GroupsService<Category> implements GroupedInterface<Category> {
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
}
