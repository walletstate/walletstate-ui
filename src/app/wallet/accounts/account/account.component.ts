import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {

  links = [
    {title: 'Info', path: 'info'},
    {title: 'Records', path: 'records'},
    {title: 'Imports', path: 'imports'}
  ];

}
