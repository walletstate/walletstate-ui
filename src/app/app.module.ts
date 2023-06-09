import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { WalletInitComponent } from './wallet-init/wallet-init.component';
import { WalletComponent } from './wallet/wallet.component';
import { UserComponent } from './user/user.component';
import { WalletHomeComponent } from './wallet/wallet-home/wallet-home.component';
import { WalletCategoriesComponent } from './wallet/wallet-categories/wallet-categories.component';
import { WalletAccountsComponent } from './wallet/wallet-accounts/wallet-accounts.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
    WalletInitComponent,
    WalletComponent,
    UserComponent,
    WalletHomeComponent,
    WalletCategoriesComponent,
    WalletAccountsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
