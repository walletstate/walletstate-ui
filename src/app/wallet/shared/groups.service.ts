import { BehaviorSubject, Observable } from 'rxjs';
import { Group, Grouped, GroupsHttpClient, GroupType } from '@walletstate/angular-client';
import { map, tap } from 'rxjs/operators';

export abstract class GroupsService<T> {
  private _groups: BehaviorSubject<Grouped<T>[]> = new BehaviorSubject<Grouped<T>[]>([]);
  private _groupsMap: Map<string, Grouped<T>> = new Map();

  protected constructor(
    private groupsClient: GroupsHttpClient,
    private type: GroupType
  ) {}

  get groups(): Observable<Grouped<T>[]> {
    return this._groups.asObservable();
  }

  group(id: string): Grouped<T> {
    return this._groupsMap.get(id);
  }

  protected updateLocalState(newGroupsFn: (currentGroups: Grouped<T>[]) => Grouped<T>[]): Grouped<T>[] {
    const updatedGroups = newGroupsFn([...this._groups.value]);
    this._groupsMap = new Map(updatedGroups.map(group => [group.id, group]));
    this._groups.next(updatedGroups);
    return updatedGroups;
  }

  createGroup(name: string, idx: number): Observable<Grouped<T>> {
    return this.groupsClient.create({ type: this.type, name, idx }).pipe(
      map((newGroup: Group) => {
        return { ...newGroup, items: [] };
      }),
      tap((newGrouped: Grouped<T>) => {
        const updateGroupsFn = (current: Grouped<T>[]) => {
          current.push(newGrouped);
          return current.sort((g1, g2) => g1.idx - g2.idx);
        };
        this.updateLocalState(updateGroupsFn);
      })
    );
  }

  updateGroup(id: string, name: string, idx: number): Observable<void> {
    return this.groupsClient.update(id, { name, idx }).pipe(
      tap(() => {
        const updateGroupsFn = (current: Grouped<T>[]) => {
          const groupForUpdate = current.find(g => g.id === id);
          groupForUpdate.name = name;
          groupForUpdate.idx = idx;
          return current.sort((g1, g2) => g1.idx - g2.idx);
        };
        this.updateLocalState(updateGroupsFn);
      })
    );
  }

  deleteGroup(id: string): Observable<void> {
    return this.groupsClient.delete(id).pipe(
      tap(() => {
        this.updateLocalState(current => {
          return current.splice(
            current.findIndex(g => g.id === id),
            1
          );
        });
      })
    );
  }
}
