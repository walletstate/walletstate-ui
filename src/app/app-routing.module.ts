import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from "./login/login.component";
import { WalletInitComponent } from "./wallet-init/wallet-init.component";
import { WalletComponent } from "./wallet/wallet.component";
import { WalletHomeComponent } from "./wallet/wallet-home/wallet-home.component";
import { NotFoundComponent } from "./errors/not-found/not-found.component";
import { userGuard } from "./auth/user.guard";
import { walletGuard } from "./auth/wallet.guard";
import { UserComponent } from "./user/user.component";
import { AccountsComponent } from './wallet/accounts/accounts.component';
import { CategoriesComponent } from './wallet/categories/categories.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'user', component: UserComponent, canActivate: [userGuard]},
  {path: 'wallet-init', component: WalletInitComponent, canActivate: [userGuard]},
  {path: '', canActivate: [walletGuard], component: WalletHomeComponent},
  {path: 'accounts', canActivate: [walletGuard], component: AccountsComponent},
  {path: 'categories', canActivate: [walletGuard], component: CategoriesComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
