import { Injectable } from '@angular/core';
import { BehaviorSubject, mergeMap, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Account,
  AccountsHttpClient,
  CreateAccount,
  CreateGroup,
  GroupsHttpClient,
  UpdateGroup,
} from '@walletstate/angular-client';
import { GroupControl } from './group.model';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  groups: BehaviorSubject<GroupControl<Account>[]> = new BehaviorSubject<GroupControl<Account>[]>([]);

  constructor(
    private accountsClient: AccountsHttpClient,
    private groupsClient: GroupsHttpClient
  ) {}

  loadGroupedAccounts(): Observable<GroupControl<Account>[]> {
    return this.accountsClient.listGrouped().pipe(
      map(groups => {
        const groupedAccounts = groups.map(group => GroupControl.fromGrouped<Account>(group));
        this.groups.next(groupedAccounts);
        return groupedAccounts;
      })
    );
  }

  createGroup(data: CreateGroup): Observable<GroupControl<Account>> {
    return this.groupsClient.create(data).pipe(
      map(group => {
        const newGroup = GroupControl.fromGroup<Account>(group);
        this.groups.value.push(newGroup);
        this.groups.next(this.groups.value);
        return newGroup;
      })
    );
  }

  updateGroup(id: string, data: UpdateGroup): Observable<any> {
    return this.groupsClient.update(id, data).pipe(
      map(() => {
        //TODO: discard an update on http failure
        this.groups.value.find(g => g.id === id).saveUpdate();
        this.groups.next(this.groups.value);
      })
    );
  }

  deleteGroup(id: string): Observable<any> {
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

  createAccount(data: CreateAccount): Observable<Account> {
    return this.accountsClient
      .create(data)
      .pipe(mergeMap(account => this.loadGroupedAccounts().pipe(map(() => account))));
  }
}
