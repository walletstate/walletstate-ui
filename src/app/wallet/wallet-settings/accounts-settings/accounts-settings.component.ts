import { Component } from '@angular/core';
import { AccountsService } from '../../shared/accounts.service';
import { Account, AccountData, Grouped } from '@walletstate/angular-client';
import { MatExpansionPanel } from '@angular/material/expansion';
import { AccountIcon } from '../../../shared/icons';

@Component({
  selector: 'app-accounts-settings',
  templateUrl: './accounts-settings.component.html',
  styleUrl: './accounts-settings.component.scss',
})
export class AccountsSettingsComponent {
  group: Grouped<Account> = null;

  readonly defaultIcon = AccountIcon;

  constructor(public accountsService: AccountsService) {}

  onSelectGroup(grouped: Grouped<Account>) {
    this.group = grouped;
  }

  createAccount(data: AccountData, panelRef: MatExpansionPanel) {
    this.accountsService.create(data).subscribe(() => panelRef.close());
  }

  updateAccount(id: string, currentGroup: string, data: AccountData) {
    this.accountsService.update(id, currentGroup, data).subscribe(rs => console.log(rs));
  }
}
