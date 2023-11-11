import { Component } from '@angular/core';
import { AccountsService } from '../shared/accounts.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
})
export class AccountsComponent {
  constructor(private accountsService: AccountsService) {}
}
