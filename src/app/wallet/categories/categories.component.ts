import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Category } from '../shared/category.model';
import { CategoriesService } from '../shared/categories.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  createCategoryForm: FormGroup;

  constructor(private categoriesService: CategoriesService) {
  }

  ngOnInit(): void {
    this.createCategoryForm = new FormGroup({
      'name': new FormControl('')
    });

    this.categoriesService
      .get()
      .subscribe(categories => this.categories = categories);
  }

  onCreate() {
    this.categoriesService
      .create(this.createCategoryForm.value)
      .subscribe(category => this.categories.push(category));
  }

}
