import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../../shared/wallet.service';
import { Wallet } from '../../../shared/wallet.model';

@Component({
  selector: 'app-general-settings',
  standalone: false,
  templateUrl: './general-settings.component.html',
  styleUrl: './general-settings.component.scss',
})
export class GeneralSettingsComponent implements OnInit {
  wallet: Wallet = undefined;

  constructor(private walletService: WalletService) {}

  ngOnInit() {
    this.walletService.get().subscribe(wallet => {
      this.wallet = wallet;
    });
  }
}
