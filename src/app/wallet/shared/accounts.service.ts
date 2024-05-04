import { Injectable } from '@angular/core';
import { mergeMap, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Account,
  AccountsHttpClient,
  Category,
  CreateAccount,
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
  accountsMap: Observable<Map<string, Account>> = this.groups.pipe(
    map(arr => new Map(arr.flatMap(g => g.items.map(a => [a.id, a]))))
  );

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
    return this.accountsClient.create(data).pipe(
      map(account => {
        const group = this.groups.value.find(g => g.id === data.group);
        group.items ? group.items.push(account) : (group.items = [account]);
        this.groups.next(this.groups.value.sort((g1, g2) => g1.idx - g2.idx));
        return account;
      })
    );
  }

  update(id: string, group: string, data: UpdateAccount): Observable<Account> {
    return this.accountsClient.update(id, data).pipe(
      map(() => {
        //maybe just reload grouped accounts
        const groupForDelete = this.groups.value.find(g => g.id === group);
        const account = groupForDelete.items.find(c => c.id === id);
        const index = groupForDelete.items.indexOf(account);
        groupForDelete.items.splice(index, 1);
        Object.assign(account, data);
        const groupForAdd = this.groups.value.find(g => g.id === data.group);
        groupForAdd.items ? groupForAdd.items.push(account) : (groupForAdd.items = [account]);
        groupForAdd.items.sort((c1, c2) => c1.idx - c2.idx);

        this.groups.next(this.groups.value.sort((g1, g2) => g1.idx - g2.idx));
        return account;
      })
    );
  }
}
