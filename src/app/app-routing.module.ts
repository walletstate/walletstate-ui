import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {WalletInitComponent} from "./wallet-init/wallet-init.component";
import {WalletComponent} from "./wallet/wallet.component";
import {WalletHomeComponent} from "./wallet/wallet-home/wallet-home.component";
import {WalletAccountsComponent} from "./wallet/wallet-accounts/wallet-accounts.component";
import {NotFoundComponent} from "./errors/not-found/not-found.component";
import {WalletCategoriesComponent} from "./wallet/wallet-categories/wallet-categories.component";
import {userGuard} from "./user.guard";
import {walletGuard} from "./wallet.guard";
import {UserComponent} from "./user/user.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'user', component: UserComponent, canActivate: [userGuard]},
  {path: 'wallet-init', component: WalletInitComponent, canActivate: [userGuard]},
  {
    path: '', component: WalletComponent, canActivate: [walletGuard], children: [
      {path: '', component: WalletHomeComponent},
      {path: 'accounts', component: WalletAccountsComponent},
      {path: 'categories', component: WalletCategoriesComponent}
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
