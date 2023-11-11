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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { AccountsComponent } from './wallet/accounts/accounts.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { FooterComponent } from './shared/footer/footer.component';
import { HomeFiltersComponent } from './wallet/wallet-home/home-filters/home-filters.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AccountsFilterComponent } from './wallet/wallet-home/home-filters/accounts-filter/accounts-filter.component';
import { MatTreeModule } from '@angular/material/tree';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { AccountComponent } from './wallet/accounts/account/account.component';
import { CreateAccountComponent } from './wallet/accounts/create-account/create-account.component';
import { AccountInfoComponent } from './wallet/accounts/account/account-info/account-info.component';
import { AccountRecordsComponent } from './wallet/accounts/account/account-records/account-records.component';
import { AccountImportsComponent } from './wallet/accounts/account/account-imports/account-imports.component';
import { AccountsListComponent } from './wallet/accounts/accounts-list/accounts-list.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { TagsSelectorComponent } from './shared/utils/tags-selector/tags-selector.component';

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
    FooterComponent,
    HomeFiltersComponent,
    AccountsFilterComponent,
    HeaderComponent,
    SidenavListComponent,
    AccountComponent,
    CreateAccountComponent,
    AccountInfoComponent,
    AccountRecordsComponent,
    AccountImportsComponent,
    AccountsListComponent,
    TagsSelectorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
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
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTreeModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    MatAutocompleteModule,
    MatChipsModule
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
