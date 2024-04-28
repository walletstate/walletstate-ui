import { Component } from '@angular/core';
import { AccountsService } from '../../shared/accounts.service';
import { Account, Grouped } from '@walletstate/angular-client';

@Component({
  selector: 'app-accounts-settings',
  templateUrl: './accounts-settings.component.html',
  styleUrl: './accounts-settings.component.scss',
})
export class AccountsSettingsComponent {
  constructor(public accountsService: AccountsService) {}

  onSelectGroup(grouped: Grouped<Account>) {
    console.log(grouped);
  }
}
