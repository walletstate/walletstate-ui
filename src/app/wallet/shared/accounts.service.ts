import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  Account,
  AccountData,
  AccountsHttpClient,
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
  private _accountsMap: Map<string, Account> = new Map();

  constructor(
    private accountsClient: AccountsHttpClient,
    groupsClient: GroupsHttpClient
  ) {
    super(groupsClient, GroupType.Accounts);
  }

  account(id: string): Account {
    return this._accountsMap.get(id);
  }

  protected override updateLocalState(
    newGroupsFn: (currentGroups: Grouped<Account>[]) => Grouped<Account>[]
  ): Grouped<Account>[] {
    const updateStateFunc = (current: Grouped<Account>[]) => {
      const updated = newGroupsFn(current);
      this._accountsMap = new Map(updated.flatMap(g => (g.items ?? []).map(a => [a.id, a])));
      return updated;
    };

    return super.updateLocalState(updateStateFunc);
  }

  loadGrouped(): Observable<Grouped<Account>[]> {
    return this.accountsClient.listGrouped().pipe(
      tap(groupedAccounts => {
        this.updateLocalState(() => groupedAccounts);
      })
    );
  }

  create(data: AccountData): Observable<Account> {
    return this.accountsClient.create(data).pipe(
      tap(account => {
        this.updateLocalState((current: Grouped<Account>[]) => {
          const group = current.find(g => g.id === data.group);
          group.items ? group.items.push(account) : (group.items = [account]);
          return current.sort((g1, g2) => g1.idx - g2.idx);
        });
      })
    );
  }

  update(id: string, group: string, data: AccountData): Observable<void> {
    return this.accountsClient.update(id, data).pipe(
      tap(() => {
        this.updateLocalState((current: Grouped<Account>[]) => {
          //maybe just reload grouped accounts
          const groupForDelete = current.find(g => g.id === group);
          const account = groupForDelete.items.find(c => c.id === id);
          const index = groupForDelete.items.indexOf(account);
          groupForDelete.items.splice(index, 1);
          Object.assign(account, data);
          const groupForAdd = current.find(g => g.id === data.group);
          groupForAdd.items ? groupForAdd.items.push(account) : (groupForAdd.items = [account]);
          groupForAdd.items.sort((c1, c2) => c1.idx - c2.idx);

          return current.sort((g1, g2) => g1.idx - g2.idx);
        });
      })
    );
  }
}
