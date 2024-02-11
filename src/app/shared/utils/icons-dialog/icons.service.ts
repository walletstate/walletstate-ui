import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class IconsService {
  constructor(private http: HttpClient) {}

  iconsList() {
    return this.http.get<string[]>('/api/icons');
  }

  uploadIcon(base64Icon: string) {
    return this.http.post<string>('/api/icons', base64Icon);
  }
}
