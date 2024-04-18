import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GroupControl } from './group.model';
import { map } from 'rxjs/operators';
import {
  CategoriesHttpClient,
  Category,
  CreateCategory,
  GroupsHttpClient,
  GroupType,
} from '@walletstate/angular-client';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  groups: BehaviorSubject<GroupControl<Category>[]> = new BehaviorSubject<GroupControl<Category>[]>([]);

  constructor(
    private categoriesClient: CategoriesHttpClient,
    private groupsClient: GroupsHttpClient
  ) {}

  getGrouped(): Observable<GroupControl<Category>[]> {
    return this.categoriesClient.listGrouped().pipe(
      map(groups => {
        const groupedCategories = groups.map(group => GroupControl.fromGrouped<Category>(group));
        this.groups.next(groupedCategories);
        return groupedCategories;
      })
    );
  }

  createGroup(name: string, idx: number) {
    return this.groupsClient.create({ type: GroupType.Categories, name, idx }).pipe(
      map(group => {
        const newGroup = GroupControl.fromGroup<Category>(group);
        this.groups.value.push(newGroup);
        this.groups.next(this.groups.value.sort((g1, g2) => g1.idx - g2.idx));
        return newGroup;
      })
    );
  }

  updateGroup(id: string, name: string, idx: number) {
    return this.groupsClient.update(id, { name, idx }).pipe(
      map(() => {
        //TODO: discard an update on http failure
        this.groups.value.find(g => g.id === id).saveUpdate();
        this.groups.next(this.groups.value.sort((g1, g2) => g1.idx - g2.idx));
      })
    );
  }

  create(data: CreateCategory): Observable<Category> {
    return this.categoriesClient.create(data);
  }
}
