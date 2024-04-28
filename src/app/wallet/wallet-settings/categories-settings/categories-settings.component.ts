import { Component } from '@angular/core';
import { CategoriesService } from '../../shared/categories.service';
import { Category, CreateCategory, Grouped } from '@walletstate/angular-client';

@Component({
  selector: 'app-categories-settings',
  templateUrl: './categories-settings.component.html',
  styleUrl: './categories-settings.component.scss',
})
export class CategoriesSettingsComponent {
  group: Grouped<Category> = null;

  showNewCategoryForm: boolean = false;

  constructor(public categoriesService: CategoriesService) {}

  onSelectGroup(grouped: Grouped<Category>) {
    this.showNewCategoryForm = false; //TODO show dialog for confirmation
    this.group = grouped;
    console.log(grouped);
  }

  createCategory(data: CreateCategory) {
    this.categoriesService.create(data).subscribe(rs => console.log(rs));
  }
}
