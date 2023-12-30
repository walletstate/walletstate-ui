import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateGroup, Group, GroupType, UpdateGroup } from './group.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  constructor(private http: HttpClient) {}

  createGroup<T>(groupType: GroupType, data: CreateGroup): Observable<Group<T>> {
    return this.http.post<Group<T>>(`/api/groups/${groupType}`, data);
  }

  updateGroup<T>(groupType: GroupType, id: string, data: UpdateGroup): Observable<Group<T>> {
    return this.http.put<Group<T>>(`/api/groups/${groupType}/${id}`, data);
  }

  deleteGroup(groupType: GroupType, id: string) {
    return this.http.delete(`/api/groups/${groupType}/${id}`);
  }
}
