import { Observable } from 'rxjs';
import { Grouped } from '@walletstate/angular-client';

export interface GroupedInterface<T> {
  get groups(): Observable<Grouped<T>[]>;

  group(id: string): Grouped<T>;

  loadGrouped(): Observable<Grouped<T>[]>;
  createGroup(name: string, idx: number): Observable<Grouped<T>>;
  updateGroup(id: string, name: string, idx: number): Observable<void>;
  deleteGroup(id: string): Observable<void>;
}
