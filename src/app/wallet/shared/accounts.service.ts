import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, mergeMap, Observable } from 'rxjs';
import { Account, CreateAccount, GroupedAccounts } from './account.model';
import { map } from 'rxjs/operators';
import { CreateGroup, Group, GroupType, UpdateGroup } from './group.model';
import { GroupsService } from './groups.service';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  groups: BehaviorSubject<GroupedAccounts[]> = new BehaviorSubject<GroupedAccounts[]>([]);

  constructor(
    private http: HttpClient,
    private groupsService: GroupsService
  ) {}

  loadGroupedAccounts(): Observable<GroupedAccounts[]> {
    return this.http.get<Group<Account>[]>('/api/accounts/grouped').pipe(
      map(groups => {
        const groupedAccounts = groups.map(group => GroupedAccounts.fromGroup(group));
        this.groups.next(groupedAccounts);
        return groupedAccounts;
      })
    );
  }

  createGroup(data: CreateGroup): Observable<GroupedAccounts> {
    return this.groupsService.createGroup<Account>(GroupType.Accounts, data).pipe(
      map(group => {
        const newGroup = GroupedAccounts.fromGroup(group);
        this.groups.value.push(newGroup);
        this.groups.next(this.groups.value);
        return newGroup;
      })
    );
  }

  updateGroup(id: string, data: UpdateGroup): Observable<any> {
    return this.groupsService.updateGroup<Account>(GroupType.Accounts, id, data).pipe(
      map(() => {
        //TODO: discard an update on http failure
        this.groups.value.find(g => g.id === id).saveUpdate();
        this.groups.next(this.groups.value);
      })
    );
  }

  deleteGroup(id: string): Observable<any> {
    return this.groupsService.deleteGroup(GroupType.Accounts, id).pipe(
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
      .pipe(mergeMap(account => this.loadGroupedAccounts().pipe(map(() => account))));
  }
}
