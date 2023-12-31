import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category, CreateCategory } from './category.model';
import { Group, GroupControl, GroupType } from './group.model';
import { GroupsService } from './groups.service';
import { map } from 'rxjs/operators';
import { Account } from './account.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  groups: BehaviorSubject<GroupControl<Category>[]> = new BehaviorSubject<GroupControl<Category>[]>([]);

  constructor(
    private http: HttpClient,
    private groupsService: GroupsService
  ) {}

  get(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories');
  }

  getGrouped(): Observable<GroupControl<Category>[]> {
    return this.http.get<Group<Category>[]>('/api/categories/grouped').pipe(
      map(groups => {
        const groupedCategories = groups.map(group => GroupControl.fromGroup<Category>(group));
        this.groups.next(groupedCategories);
        return groupedCategories;
      })
    );
  }

  createGroup(name: string, orderingIndex: number) {
    return this.groupsService.createGroup<Category>(GroupType.Categories, { name, orderingIndex }).pipe(
      map(group => {
        const newGroup = GroupControl.fromGroup(group);
        this.groups.value.push(newGroup);
        this.groups.next(this.groups.value.sort((g1, g2) => g1.orderingIndex - g2.orderingIndex));
        return newGroup;
      })
    );
  }

  updateGroup(id: string, name: string, orderingIndex: number) {
    return this.groupsService.updateGroup<Category>(GroupType.Categories, id, { name, orderingIndex }).pipe(
      map(() => {
        //TODO: discard an update on http failure
        this.groups.value.find(g => g.id === id).saveUpdate();
        this.groups.next(this.groups.value.sort((g1, g2) => g1.orderingIndex - g2.orderingIndex));
      })
    );
  }

  create(data: CreateCategory): Observable<Category> {
    return this.http.post<Category>('/api/categories', data);
  }
}
