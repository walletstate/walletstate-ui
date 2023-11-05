import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account, CreateAccount } from './account.model';
import {
  AccountsGroup,
  AccountsGroupWithAccounts,
  CreateAccountsGroup,
  UpdateAccountsGroup
} from './accounts-group.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(private http: HttpClient) {
  }

  loadGroupsWithAccounts(): Observable<AccountsGroupWithAccounts[]> {
    return this.http.get<AccountsGroup[]>('/api/groups/with-accounts')
      .pipe(map(groups => groups.map(group => AccountsGroupWithAccounts.fromGroup(group))))
  }

  createGroup(data: CreateAccountsGroup): Observable<AccountsGroup> {
    return this.http.post<AccountsGroup>('/api/groups', data)
  }

  updateGroup(id: string, data: UpdateAccountsGroup): Observable<any> {
    return this.http.put(`/api/groups/${id}`, data);
  }

  deleteGroup(id: string): Observable<any> {
    return this.http.delete(`/api/groups/${id}`);
  }

  createAccount(data: CreateAccount): Observable<Account> {
    return this.http.post<Account>('/api/accounts', data);
  }
}
