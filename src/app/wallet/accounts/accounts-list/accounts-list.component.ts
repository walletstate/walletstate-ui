import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../shared/accounts.service';
import { Account, Grouped } from '@walletstate/angular-client';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss'],
})
export class AccountsListComponent implements OnInit {
  isSearchMode: boolean = false;

  groups: Grouped<Account>[] = [];

  constructor(
    private accountsService: AccountsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //TODO Investigate if it is OK
    this.accountsService.getGrouped().subscribe();
    this.accountsService.groups.subscribe(accountsGroups => (this.groups = accountsGroups));
  }

  onSearchClick() {
    this.isSearchMode = true;
  }

  onClose() {
    this.isSearchMode = false;
  }
}
