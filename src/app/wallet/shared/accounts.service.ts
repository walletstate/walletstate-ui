import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, mergeMap, Observable } from 'rxjs';
import { Account, CreateAccount } from './account.model';
import {
  AccountsGroup,
  AccountsGroupWithAccounts,
  CreateAccountsGroup,
  UpdateAccountsGroup,
} from './accounts-group.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  groups: BehaviorSubject<AccountsGroupWithAccounts[]> = new BehaviorSubject<AccountsGroupWithAccounts[]>([]);

  constructor(private http: HttpClient) {}

  loadGroupsWithAccounts(): Observable<AccountsGroupWithAccounts[]> {
    return this.http.get<AccountsGroup[]>('/api/accounts/grouped').pipe(
      map(groups => {
        const groupsWithAccounts = groups.map(group => AccountsGroupWithAccounts.fromGroup(group));
        this.groups.next(groupsWithAccounts);
        return groupsWithAccounts;
      })
    );
  }

  createGroup(data: CreateAccountsGroup): Observable<AccountsGroupWithAccounts> {
    return this.http.post<AccountsGroup>('/api/groups/accounts', data).pipe(
      map(group => {
        const newGroup = AccountsGroupWithAccounts.fromGroup(group);
        this.groups.value.push(newGroup);
        this.groups.next(this.groups.value);
        return newGroup;
      })
    );
  }

  updateGroup(id: string, data: UpdateAccountsGroup): Observable<any> {
    return this.http.put(`/api/groups/accounts/${id}`, data).pipe(
      map(() => {
        //TODO: discard an update on http failure
        this.groups.value.find(g => g.id === id).saveUpdate();
        this.groups.next(this.groups.value);
      })
    );
  }

  deleteGroup(id: string): Observable<any> {
    return this.http.delete(`/api/groups/accounts/${id}`).pipe(
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
    return this.http
      .post<Account>('/api/accounts', data)
      .pipe(mergeMap(account => this.loadGroupsWithAccounts().pipe(map(() => account))));
  }
}
