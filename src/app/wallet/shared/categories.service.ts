import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CreateCategory } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) {
  }

  get(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories');
  }

  create(data: CreateCategory): Observable<Category> {
    return this.http.post<Category>('/api/categories', data);
  }
}