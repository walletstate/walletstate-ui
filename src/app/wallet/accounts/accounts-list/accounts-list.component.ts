import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../shared/accounts.service';
import { GroupControl } from '../../shared/group.model';
import { Account, GroupType } from '@walletstate/angular-client';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss'],
})
export class AccountsListComponent implements OnInit {
  isAddGroupMode: boolean = false;
  isSearchMode: boolean = false;

  newGroupName: string = '';

  groups: GroupControl<Account>[] = [];

  constructor(private accountsService: AccountsService) {}

  ngOnInit(): void {
    //TODO Investigate if it is OK
    this.accountsService.loadGroupedAccounts().subscribe();
    this.accountsService.groups.subscribe(accountsGroups => (this.groups = accountsGroups));
  }

  onAddGroupClick() {
    this.isAddGroupMode = true;
    this.isSearchMode = false;
  }

  onSearchClick() {
    this.isAddGroupMode = false;
    this.isSearchMode = true;
  }

  onClose() {
    this.isAddGroupMode = false;
    this.isSearchMode = false;
    this.newGroupName = '';
  }

  onAddGroup() {
    if (this.newGroupName.trim().length > 0) {
      this.accountsService
        .createGroup({ type: GroupType.Accounts, name: this.newGroupName, idx: this.groups.length + 1 })
        .subscribe(() => this.onClose());
    }
  }

  onUpdateGroupName(group: GroupControl<Account>) {
    if (group.updateName.trim().length > 0) {
      this.accountsService
        .updateGroup(group.id, {
          name: group.updateName,
          idx: group.idx,
        })
        .subscribe({
          error: () => group.discardUpdate(),
          complete: () => group.switchMode(),
        });
    }
  }

  onDiscardGroupUpdate(group: GroupControl<Account>) {
    group.discardUpdate();
    group.switchMode();
  }

  onDeleteGroup(group: GroupControl<Account>) {
    this.accountsService.deleteGroup(group.id).subscribe();
  }
}
