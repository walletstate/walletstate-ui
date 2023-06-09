import { Component } from '@angular/core';
import { UserService } from "../shared/user.service";

@Component({
  selector: 'app-wallet-init',
  templateUrl: './wallet-init.component.html',
  styleUrls: ['./wallet-init.component.scss']
})
export class WalletInitComponent {

  constructor(private userService: UserService) {
  }

  onWalletSet() {
    this.userService.setContext('test', 'test-wallet');
  }

  onWalletClean() {
    this.userService.setContext('', undefined);
  }

}
