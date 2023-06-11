import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account, CreateAccount } from './account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  constructor(private http: HttpClient) {
  }

  get(): Observable<Account[]> {
    return this.http.get<Account[]>('/api/accounts');
  }

  create(data: CreateAccount): Observable<Account> {
    return this.http.post<Account>('/api/accounts', data);
  }
}
