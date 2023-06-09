import { Component } from '@angular/core';
import { UserService } from "../shared/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private userService: UserService) {
  }

  onUserSet() {
    this.userService.setContext('test', undefined);
  }

  onUserClean() {
    this.userService.setContext('');
  }

  onWalletSet() {
    this.userService.setContext('user', 'test-wallet')
  }

  onWalletClean() {
    this.userService.setContext('', undefined);
  }

}
