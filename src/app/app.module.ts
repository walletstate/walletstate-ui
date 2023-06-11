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
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AccountsComponent } from './wallet/accounts/accounts.component';
import { CategoriesComponent } from './wallet/categories/categories.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
    WalletInitComponent,
    WalletComponent,
    UserComponent,
    WalletHomeComponent,
    AccountsComponent,
    CategoriesComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
