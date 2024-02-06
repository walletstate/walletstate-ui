import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconUrl',
  standalone: true,
})
export class IconPipe implements PipeTransform {
  transform(id?: string): string {
    if (id && id.length === 64) {
      return `/api/icons/${id}`;
    } else {
      return '/api/icons/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    }
  }
}
