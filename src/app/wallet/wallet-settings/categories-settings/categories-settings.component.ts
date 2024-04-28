import { Component } from '@angular/core';
import { CategoriesService } from '../../shared/categories.service';
import { Category, CreateCategory, Grouped, UpdateCategory } from '@walletstate/angular-client';

@Component({
  selector: 'app-categories-settings',
  templateUrl: './categories-settings.component.html',
  styleUrl: './categories-settings.component.scss',
})
export class CategoriesSettingsComponent {
  group: Grouped<Category> = null;

  constructor(public categoriesService: CategoriesService) {}

  onSelectGroup(grouped: Grouped<Category>) {
    this.group = grouped;
    console.log(grouped);
  }

  createCategory(data: CreateCategory) {
    this.categoriesService.create(data).subscribe(rs => console.log(rs));
  }

  updateCategory(id: string, currentGroup: string, data: UpdateCategory) {
    this.categoriesService.update(id, currentGroup, data).subscribe(rs => console.log(rs));
  }
}
