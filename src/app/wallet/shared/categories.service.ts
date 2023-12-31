import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CreateCategory } from './category.model';
import { Group } from './group.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private http: HttpClient) {}

  get(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/categories');
  }

  getGrouped(): Observable<Group<Category>[]> {
    return this.http.get<Group<Category>[]>('/api/categories/grouped');
  }

  create(data: CreateCategory): Observable<Category> {
    return this.http.post<Category>('/api/categories', data);
  }
}
