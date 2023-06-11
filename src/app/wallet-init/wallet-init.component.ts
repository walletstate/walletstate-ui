import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { WalletService } from '../shared/wallet.service';


@Component({
  selector: 'app-wallet-init',
  templateUrl: './wallet-init.component.html',
  styleUrls: ['./wallet-init.component.scss']
})
export class WalletInitComponent implements OnInit {
  createWalletForm: FormGroup;
  joinWalletForm: FormGroup;


  constructor(private walletService: WalletService, private router: Router) {
  }

  ngOnInit(): void {
    this.createWalletForm = new FormGroup({
      'name': new FormControl('')
    });

    this.joinWalletForm = new FormGroup({
      'inviteCode': new FormControl('')
    });
  }

  onCreate() {
    this.walletService.create(this.createWalletForm.value)
      .subscribe(wallet => {
        console.log('Created wallet');
        console.log(wallet);
        this.router.navigate(['/']);
      });
  }

  onJoin() {
    this.walletService.join(this.joinWalletForm.value)
      .subscribe(wallet => {
        console.log('Joined wallet');
        console.log(wallet);
        this.router.navigate(['/']);
      });
  }
}
