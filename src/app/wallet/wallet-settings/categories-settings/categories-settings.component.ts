import { Component, OnInit } from '@angular/core';
import { GroupControl } from '../../shared/group.model';
import { Category } from '../../shared/category.model';
import { CategoriesService } from '../../shared/categories.service';
import { IconsDialogComponent } from '../../../shared/utils/icons-dialog/icons-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-categories-settings',
  standalone: false,
  templateUrl: './categories-settings.component.html',
  styleUrl: './categories-settings.component.scss',
})
export class CategoriesSettingsComponent implements OnInit {
  groups: GroupControl<Category>[] = [];

  isNewGroupFormVisible: boolean = false;
  newGroupName: string = '';
  newGroupOrderingIndex: number = 0;

  defaultCategoryIcon = '';

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.categoriesService.getGrouped().subscribe();
    this.categoriesService.groups.subscribe(categoriesGroups => (this.groups = categoriesGroups));
  }

  onUpdateGroup(group: GroupControl<Category>) {
    if (group.updateName.trim().length > 0) {
      this.categoriesService.updateGroup(group.id, group.updateName, group.updateOrderingIndex).subscribe({
        error: () => group.discardUpdate(),
        complete: () => group.switchMode(),
      });
    }
  }

  onDiscardGroupUpdate(group: GroupControl<Category>) {
    group.discardUpdate();
    group.switchMode();
  }

  onDeleteGroup(group: GroupControl<Category>) {
    // this.accountsService.deleteGroup(group.id).subscribe();
  }

  showNewGroupForm() {
    this.newGroupName = '';
    this.isNewGroupFormVisible = true;
  }

  hideNewGroupForm() {
    this.isNewGroupFormVisible = false;
  }

  createNewGroup() {
    if (this.newGroupName.trim().length > 0) {
      this.categoriesService.createGroup(this.newGroupName.trim(), this.newGroupOrderingIndex).subscribe({
        error: () => this.hideNewGroupForm(),
        complete: () => this.hideNewGroupForm(),
      });
    }
  }

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
