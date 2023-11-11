import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WalletService } from '../shared/wallet.service';

@Component({
  selector: 'app-wallet-init',
  templateUrl: './wallet-init.component.html',
  styleUrls: ['./wallet-init.component.scss'],
})
export class WalletInitComponent implements OnInit {
  createWalletForm: FormGroup;
  joinWalletForm: FormGroup;

  createError: string = null;
  joinError: string = null;

  constructor(
    private walletService: WalletService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createWalletForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
    });

    this.joinWalletForm = new FormGroup({
      inviteCode: new FormControl('', [Validators.required]),
    });
  }

  onCreate() {
    this.walletService.create(this.createWalletForm.value).subscribe({
      next: this.onCreateSuccess.bind(this),
      error: this.onCreateError.bind(this),
    });
  }

  onJoin() {
    this.walletService.join(this.joinWalletForm.value).subscribe({
      next: this.onJoinSuccess.bind(this),
      error: this.onJoinError.bind(this),
    });
  }

  private onCreateSuccess(wallet) {
    console.log('Created wallet');
    console.log(wallet);
    this.router.navigate(['/']);
  }

  private onCreateError(error) {
    this.createError = error?.error?.message;
  }

  private onJoinSuccess(wallet) {
    console.log('Joined wallet');
    console.log(wallet);
    this.router.navigate(['/']);
  }

  private onJoinError(error) {
    this.joinError = error?.error?.message;
    console.log(this.joinError);
  }
}
