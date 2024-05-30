import { Component, Input } from '@angular/core';
import { GroupedInterface } from '../grouped.interface';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-grouped-select',
  templateUrl: './grouped-select.component.html',
  styleUrl: './grouped-select.component.scss',
})
export class GroupedSelectComponent<T> {
  @Input() service: GroupedInterface<T>;
  @Input() control: FormControl;

  @Input() label: string;
  @Input() getName: (item: T) => string;
  @Input() getId: (item: T) => string;
  @Input() getIconId: (item: T) => string;
  @Input() defaultIcon: string;
  @Input() isOptional: boolean = false;

  @Input() filterPredicate: (item: T) => boolean = () => true;
}
