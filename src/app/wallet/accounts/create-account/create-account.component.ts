import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from '../../shared/accounts.service';
import { AccountsGroupWithAccounts } from '../../shared/accounts-group.model';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss']
})
export class CreateAccountComponent implements OnInit {

  groups: AccountsGroupWithAccounts[] = []

  createAccountForm: FormGroup;

  constructor(private accountsService: AccountsService) {
  }

  ngOnInit(): void {
    this.groups = this.accountsService.groups.value;
    //TODO unsubscribe
    this.accountsService.groups.subscribe(groups => {
      this.groups = groups
      console.log('groups updated', this.groups)
    })

    this.createAccountForm = new FormGroup({
      'name': new FormControl('', [Validators.required])
    });
  }


  onSubmit() {
    console.log("submit form")
  }

}
