import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AccountsService } from '../shared/accounts.service';
import { Account } from '../shared/account.model';
import { group } from '@angular/animations';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {

  accounts: Account[] = [];
  createAccountForm: FormGroup;


  constructor(private accountsService: AccountsService) {
  }

  ngOnInit(): void {
    this.createAccountForm = new FormGroup({
      'name': new FormControl('')
    });

    this.accountsService
      .get()
      .subscribe(accounts => this.accounts = accounts);
  }

  onCreate() {
    this.accountsService
      .create(this.createAccountForm.value)
      .subscribe(account => this.accounts.push(account));
  }
}
