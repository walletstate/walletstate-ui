import { Component, OnInit } from '@angular/core';
import { GroupControl } from '../../shared/group.model';
import { Category } from '../../shared/category.model';
import { CategoriesService } from '../../shared/categories.service';

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

  defaultCategoryIcon =
    'data:image/png;base64,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';

  constructor(private categoriesService: CategoriesService) {}

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

  handleUpload(event, group: GroupControl<Category>) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log(reader.result);
      group.newItemIcon = reader.result.toString();
    };
  }
}
