import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { WalletInitComponent } from "./wallet-init/wallet-init.component";
import { WalletHomeComponent } from "./wallet/wallet-home/wallet-home.component";
import { NotFoundComponent } from "./errors/not-found/not-found.component";
import { userGuard } from "./auth/user.guard";
import { walletGuard } from "./auth/wallet.guard";
import { UserComponent } from "./user/user.component";
import { AccountsComponent } from './wallet/accounts/accounts.component';
import { AccountComponent } from './wallet/accounts/account/account.component';
import { CreateAccountComponent } from './wallet/accounts/create-account/create-account.component';
import { AccountInfoComponent } from './wallet/accounts/account/account-info/account-info.component';
import { AccountRecordsComponent } from './wallet/accounts/account/account-records/account-records.component';
import { AccountImportsComponent } from './wallet/accounts/account/account-imports/account-imports.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'user', component: UserComponent, canActivate: [userGuard]},
  {path: 'wallet-init', component: WalletInitComponent, canActivate: [userGuard]},
  {path: '', canActivate: [walletGuard], component: WalletHomeComponent},
  {
    path: 'accounts',
    canActivate: [walletGuard],
    component: AccountsComponent,
    children: [
      {path: 'create', component: CreateAccountComponent},
      {
        path: ':id',
        component: AccountComponent,
        children: [
          {path: '', redirectTo: 'info', pathMatch: 'full'},
          {path: 'info', component: AccountInfoComponent},
          {path: 'records', component: AccountRecordsComponent},
          {path: 'imports', component: AccountImportsComponent}
        ]
      }
    ]
  },

  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
