import { Component, OnInit } from '@angular/core';
import { GroupControl } from '../../shared/group.model';
import { CategoriesService } from '../../shared/categories.service';
import { IconsDialogComponent } from '../../../shared/utils/icons-dialog/icons-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Category, Grouped } from '@walletstate/angular-client';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-categories-settings',
  standalone: false,
  templateUrl: './categories-settings.component.html',
  styleUrl: './categories-settings.component.scss',
})
export class CategoriesSettingsComponent implements OnInit {
  groups: Grouped<Category>[] = [];

  selectedGroup: Grouped<Category> = null;

  addNewGroup: boolean = false;
  editGroup: boolean = false;

  showNewCategoryForm: boolean = false;

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.categoriesService.getGrouped().subscribe();
    this.categoriesService.groups.subscribe(categoriesGroups => {
      this.groups = categoriesGroups;
      if (!this.selectedGroup && categoriesGroups.length) {
        this.selectedGroup = categoriesGroups[0];
      }
    });
  }

  onSelectGroup(group: Grouped<Category>) {
    this.discardGroupEdit(); //TODO add dialog to confirm
    this.selectedGroup = group;
  }

  onAddNewGroup() {
    this.addNewGroup = true;
  }

  onEditGroup() {
    this.editGroup = true;
  }

  createNewGroup(name: string) {
    this.categoriesService.createGroup(name, this.groups.length + 1).subscribe(grouped => {
      console.log(grouped);
      this.discardGroupEdit();
      this.selectedGroup = grouped;
    });
  }

  updateGroup(id: string, name: string) {
    this.categoriesService.updateGroup(id, name, this.selectedGroup.idx).subscribe(() => this.discardGroupEdit());
  }

  discardGroupEdit() {
    this.addNewGroup = false;
    this.editGroup = false;
  }

  /////////////
  onAddCategory() {}

  openIconsModal(group: GroupControl<Category>): void {
    const dialogRef = this.dialog.open(IconsDialogComponent, {
      height: '400px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(iconId => {
      if (iconId) group.newItemIcon = iconId.toString();
    });
  }
}
