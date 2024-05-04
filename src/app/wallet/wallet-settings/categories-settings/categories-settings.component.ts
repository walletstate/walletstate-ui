import { Component } from '@angular/core';
import { CategoriesService } from '../../shared/categories.service';
import { Category, CreateCategory, Grouped, UpdateCategory } from '@walletstate/angular-client';
import { MatExpansionPanel } from '@angular/material/expansion';
import { CategoryIcon } from '../../../shared/icons';

@Component({
  selector: 'app-categories-settings',
  templateUrl: './categories-settings.component.html',
  styleUrl: './categories-settings.component.scss',
})
export class CategoriesSettingsComponent {
  group: Grouped<Category> = null;

  readonly defaultIcon = CategoryIcon;

  constructor(public categoriesService: CategoriesService) {}

  onSelectGroup(grouped: Grouped<Category>) {
    this.group = grouped;
  }

  createCategory(data: CreateCategory, panelRef: MatExpansionPanel) {
    this.categoriesService.create(data).subscribe(() => panelRef.close());
  }

  updateCategory(id: string, currentGroup: string, data: UpdateCategory) {
    this.categoriesService.update(id, currentGroup, data).subscribe(rs => console.log(rs));
  }
}
