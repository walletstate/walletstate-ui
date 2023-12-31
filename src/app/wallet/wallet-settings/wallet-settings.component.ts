import { Component } from '@angular/core';

@Component({
  selector: 'app-wallet-settings',
  standalone: false,
  templateUrl: './wallet-settings.component.html',
  styleUrl: './wallet-settings.component.scss',
})
export class WalletSettingsComponent {
  tabs = [
    { title: 'General', path: 'general' },
    { title: 'Categories', path: 'categories' },
    { title: 'Assets', path: 'assets' },
  ];
}
