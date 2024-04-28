import { BehaviorSubject, Observable } from 'rxjs';
import { Grouped, GroupsHttpClient, GroupType } from '@walletstate/angular-client';
import { map } from 'rxjs/operators';

export abstract class GroupsService<T> {
  groups: BehaviorSubject<Grouped<T>[]> = new BehaviorSubject<Grouped<T>[]>([]);

  constructor(
    private groupsClient: GroupsHttpClient,
    private type: GroupType
  ) {}

  createGroup(name: string, idx: number): Observable<Grouped<T>> {
    return this.groupsClient.create({ type: this.type, name, idx }).pipe(
      map(newGroup => {
        const newGrouped: Grouped<T> = { ...newGroup, items: [] };
        this.groups.value.push(newGrouped);
        this.groups.next(this.groups.value.sort((g1, g2) => g1.idx - g2.idx));
        return newGrouped;
      })
    );
  }

  updateGroup(id: string, name: string, idx: number): Observable<void> {
    return this.groupsClient.update(id, { name, idx }).pipe(
      map(() => {
        const groupForUpdate = this.groups.value.find(g => g.id === id);
        groupForUpdate.name = name;
        groupForUpdate.idx = idx;
        this.groups.next(this.groups.value.sort((g1, g2) => g1.idx - g2.idx));
      })
    );
  }

  deleteGroup(id: string): Observable<void> {
    return this.groupsClient.delete(id).pipe(
      map(() => {
        this.groups.value.splice(
          this.groups.value.findIndex(g => g.id === id),
          1
        );
        this.groups.next(this.groups.value);
      })
    );
  }
}
