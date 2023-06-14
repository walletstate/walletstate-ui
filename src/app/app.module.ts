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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FooterComponent } from './shared/footer/footer.component';

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
    CategoriesComponent,
    ToolbarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    //material
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatMenuModule,
    MatTabsModule
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
