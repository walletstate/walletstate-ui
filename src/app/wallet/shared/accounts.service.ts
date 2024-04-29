import { Injectable } from '@angular/core';
import { mergeMap, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Account,
  AccountsHttpClient,
  Category,
  CreateAccount,
  CreateCategory,
  Grouped,
  GroupsHttpClient,
  GroupType,
  UpdateAccount,
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

  update(id: string, group: string, data: UpdateAccount): Observable<Account> {
    return this.accountsClient.update(id, data).pipe(
      map(account => {
        const groupForDelete = this.groups.value.find(g => g.id === group);
        const index = groupForDelete.items.indexOf(groupForDelete.items.find(c => c.id === id));
        groupForDelete.items.splice(index, 1);

        const groupForAdd = this.groups.value.find(g => g.id === data.group);
        groupForAdd.items ? groupForAdd.items.push(account) : (groupForAdd.items = [account]);
        groupForAdd.items.sort((c1, c2) => c1.idx - c2.idx);

        this.groups.next(this.groups.value.sort((g1, g2) => g1.idx - g2.idx));
        return account;
      })
    );
  }
}
