import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../shared/accounts.service';
import { GroupedAccounts } from '../../shared/account.model';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss'],
})
export class AccountsListComponent implements OnInit {
  isAddGroupMode: boolean = false;
  isSearchMode: boolean = false;

  newGroupName: string = '';

  groups: GroupedAccounts[] = [];

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
        .createGroup({ name: this.newGroupName, orderingIndex: this.groups.length + 1 })
        .subscribe(() => this.onClose());
    }
  }

  onUpdateGroupName(group: GroupedAccounts) {
    if (group.updateName.trim().length > 0) {
      this.accountsService.updateGroup(group.id, { name: group.updateName }).subscribe({
        error: () => group.discardUpdate(),
        complete: () => group.switchMode(),
      });
    }
  }

  onDiscardGroupUpdate(group: GroupedAccounts) {
    group.discardUpdate();
    group.switchMode();
  }

  onDeleteGroup(group: GroupedAccounts) {
    this.accountsService.deleteGroup(group.id).subscribe();
  }
}
