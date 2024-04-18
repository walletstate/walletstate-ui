import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  CategoriesHttpClient,
  Category,
  CreateCategory,
  Grouped,
  GroupsHttpClient,
  GroupType,
} from '@walletstate/angular-client';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  groups: BehaviorSubject<Grouped<Category>[]> = new BehaviorSubject<Grouped<Category>[]>([]);

  constructor(
    private categoriesClient: CategoriesHttpClient,
    private groupsClient: GroupsHttpClient
  ) {}

  getGrouped(): Observable<Grouped<Category>[]> {
    return this.categoriesClient.listGrouped().pipe(
      map(groupedCategories => {
        this.groups.next(groupedCategories);
        return groupedCategories;
      })
    );
  }

  createGroup(name: string, idx: number) {
    return this.groupsClient.create({ type: GroupType.Categories, name, idx }).pipe(
      map(newGroup => {
        const newGroupedCategories: Grouped<Category> = { ...newGroup, items: [] };
        this.groups.value.push(newGroupedCategories);
        this.groups.next(this.groups.value.sort((g1, g2) => g1.idx - g2.idx));
        return newGroupedCategories;
      })
    );
  }

  updateGroup(id: string, name: string, idx: number) {
    return this.groupsClient.update(id, { name, idx }).pipe(
      map(() => {
        const groupForUpdate = this.groups.value.find(g => g.id === id);
        groupForUpdate.name = name;
        groupForUpdate.idx = idx;
        this.groups.next(this.groups.value.sort((g1, g2) => g1.idx - g2.idx));
      })
    );
  }

  create(data: CreateCategory): Observable<Category> {
    return this.categoriesClient.create(data).pipe(
      map(category => {
        const group = this.groups.value.find(g => g.id === data.group);
        group.items.push(category);
        this.groups.next(this.groups.value.sort((g1, g2) => g1.idx - g2.idx));
        return category;
      })
    );
  }
}
