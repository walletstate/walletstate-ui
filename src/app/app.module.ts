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
import { FooterComponent } from './navigation/footer/footer.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { AccountComponent } from './wallet/accounts/account/account.component';
import { AccountInfoComponent } from './wallet/accounts/account/account-info/account-info.component';
import { AccountRecordsComponent } from './wallet/accounts/account/account-records/account-records.component';
import { AccountImportsComponent } from './wallet/accounts/account/account-imports/account-imports.component';
import { AccountsListComponent } from './wallet/accounts/accounts-list/accounts-list.component';
import { TagsSelectorComponent } from './shared/utils/tags-selector/tags-selector.component';
import { MaterialModule } from './material.module';
import { WalletSettingsComponent } from './wallet/wallet-settings/wallet-settings.component';
import { AssetsSettingsComponent } from './wallet/wallet-settings/assets-settings/assets-settings.component';
import { GroupedEntitiesComponent } from './wallet/wallet-settings/shared/grouped-entities/grouped-entities.component';
import { GeneralSettingsComponent } from './wallet/wallet-settings/general-settings/general-settings.component';
import { WalletUsersComponent } from './wallet/wallet-settings/wallet-users/wallet-users.component';
import { IconPipe } from './shared/icon.pipe';
import { IconsDialogComponent } from './shared/utils/icons-dialog/icons-dialog.component';
import { EditCategoryComponent } from './wallet/wallet-settings/categories-settings/edit-category/edit-category.component';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { EditGroupFormComponent } from './wallet/wallet-settings/shared/grouped-entities/edit-group-form/edit-group-form.component';
import { AccountsSettingsComponent } from './wallet/wallet-settings/accounts-settings/accounts-settings.component';
import { CategoriesSettingsComponent } from './wallet/wallet-settings/categories-settings/categories-settings.component';
import { EditAccountComponent } from './wallet/wallet-settings/accounts-settings/edit-account/edit-account.component';
import { EditAssetComponent } from './wallet/wallet-settings/assets-settings/edit-asset/edit-asset.component';
import { RecordDialogComponent } from './wallet/shared/record-dialog/record-dialog.component';
import { AccountBalanceWidgetComponent } from './wallet/wallet-home/account-balance-widget/account-balance-widget.component';
import { AnalyticsComponent } from './wallet/analytics/analytics.component';
import { AnalyticsFilterComponent } from './wallet/analytics/analytics-filter/analytics-filter.component';
import { AnalyticsByCategoryTableComponent } from './wallet/analytics/analytics-by-category-table/analytics-by-category-table.component';
import { GroupedSelectComponent } from './wallet/shared/grouped-select/grouped-select.component';
import { BalanceByAccountTableComponent } from './wallet/analytics/balance-by-account-table/balance-by-account-table.component';
import { RecordsListWidgetComponent } from './wallet/wallet-home/records-list-widget/records-list-widget.component';
import { RecordsListModalComponent } from './wallet/analytics/analytics-by-category-table/records-list-modal/records-list-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NotFoundComponent,
    WalletInitComponent,
    WalletComponent,
    UserComponent,
    WalletHomeComponent,
    AccountBalanceWidgetComponent,
    AccountsComponent,
    FooterComponent,
    HeaderComponent,
    SidenavListComponent,
    AccountComponent,
    AccountInfoComponent,
    AccountRecordsComponent,
    AccountImportsComponent,
    AccountsListComponent,
    TagsSelectorComponent,
    WalletSettingsComponent,
    AssetsSettingsComponent,
    GeneralSettingsComponent,
    WalletUsersComponent,
    IconsDialogComponent,
    EditAccountComponent,
    EditCategoryComponent,
    EditGroupFormComponent,
    EditAssetComponent,
    GroupedEntitiesComponent,
    AccountsSettingsComponent,
    CategoriesSettingsComponent,
    RecordDialogComponent,
    AnalyticsComponent,
    AnalyticsFilterComponent,
    AnalyticsByCategoryTableComponent,
    RecordsListModalComponent,
    GroupedSelectComponent,
    BalanceByAccountTableComponent,
    RecordsListWidgetComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    IconPipe,
    CdkDropListGroup,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
