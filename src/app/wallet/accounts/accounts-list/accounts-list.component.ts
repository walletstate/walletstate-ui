import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../shared/accounts.service';
import { Account, Grouped } from '@walletstate/angular-client';
import { ActivatedRoute } from '@angular/router';
import { AccountIcon } from '../../../shared/icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss'],
})
export class AccountsListComponent implements OnInit {
  isSearchMode: boolean = false;

  groups: Observable<Grouped<Account>[]>;

  defaultAccountIcon = AccountIcon;

  constructor(
    private accountsService: AccountsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.groups = this.accountsService.groups;
    this.accountsService.loadGrouped().subscribe();
  }

  onSearchClick() {
    this.isSearchMode = true;
  }

  onClose() {
    this.isSearchMode = false;
  }
}
