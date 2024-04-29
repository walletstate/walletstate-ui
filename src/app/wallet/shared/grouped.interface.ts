import { BehaviorSubject, Observable } from 'rxjs';
import { Grouped } from '@walletstate/angular-client';

export interface GroupedInterface<T> {
  groups: BehaviorSubject<Grouped<T>[]>;

  getGrouped(): Observable<Grouped<T>[]>;
  createGroup(name: string, idx: number): Observable<Grouped<T>>;
  updateGroup(id: string, name: string, idx: number): Observable<void>;
  deleteGroup(id: string): Observable<void>;
}
