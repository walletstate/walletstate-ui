import { Pipe, PipeTransform } from '@angular/core';
import { CategoryIcon } from './icons';

@Pipe({
  name: 'iconUrl',
  standalone: true,
})
export class IconPipe implements PipeTransform {
  transform(id?: string, defaultIcon?: string): string {
    if (id && id.length === 64) {
      return `/api/icons/${id}`;
    } else if (defaultIcon && defaultIcon.length === 64) {
      return `/api/icons/${defaultIcon}`;
    } else {
      return `/api/icons/${CategoryIcon}`; //TODO Change for some common icon
    }
  }
}
