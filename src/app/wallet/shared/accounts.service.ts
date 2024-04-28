import { Injectable } from '@angular/core';
import { mergeMap, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Account,
  AccountsHttpClient,
  CreateAccount,
  Grouped,
  GroupsHttpClient,
  GroupType,
} from '@walletstate/angular-client';
import { GroupsService } from './groups.service';
import { GroupedInterface } from './grouped.interface';

@Injectable({
  providedIn: 'root',
})
export class AccountsService extends GroupsService<Account> implements GroupedInterface<Account> {
  constructor(
    private accountsClient: AccountsHttpClient,
    groupsClient: GroupsHttpClient
  ) {
    super(groupsClient, GroupType.Accounts);
  }

  getGrouped(): Observable<Grouped<Account>[]> {
    return this.accountsClient.listGrouped().pipe(
      map(groupedAccounts => {
        this.groups.next(groupedAccounts);
        return groupedAccounts;
      })
    );
  }

  create(data: CreateAccount): Observable<Account> {
    return this.accountsClient.create(data).pipe(mergeMap(account => this.getGrouped().pipe(map(() => account))));
  }
}
