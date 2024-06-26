import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Grouped } from '@walletstate/angular-client';
import { GroupedInterface } from '../../../shared/grouped.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-grouped-entities',
  templateUrl: './grouped-entities.component.html',
  styleUrl: './grouped-entities.component.scss',
})
export class GroupedEntitiesComponent<T> implements OnInit, OnDestroy {
  @Input() groupedService: GroupedInterface<T>;
  @Output() groupSelected: EventEmitter<Grouped<T>> = new EventEmitter<Grouped<T>>();

  groups: Grouped<T>[] = [];

  selectedGroup: Grouped<T> = null;

  addNewGroup: boolean = false;
  editGroup: boolean = false;

  groupsSubscription: Subscription;

  constructor() {}

  ngOnInit(): void {
    this.groupsSubscription = this.groupedService.groups.subscribe(groupsItems => {
      this.groups = groupsItems;
      // TODO Investigate issue with editing items for preselected group
      // if (!this.selectedGroup && groupsItems.length) {
      //   this.selectGroup(groupsItems[0]);
      // }
    });
    this.groupedService.loadGrouped().subscribe();
  }

  ngOnDestroy(): void {
    if (this.groupsSubscription) {
      this.groupsSubscription.unsubscribe();
    }
  }

  selectGroup(group: Grouped<T>) {
    this.discardGroupEdit(); //TODO add dialog to confirm
    this.selectedGroup = group;
    this.groupSelected.emit(group);
  }

  onAddNewGroup() {
    this.addNewGroup = true;
  }

  onEditGroup() {
    this.editGroup = true;
  }

  createNewGroup(name: string) {
    this.groupedService.createGroup(name, this.groups.length + 1).subscribe(grouped => {
      this.discardGroupEdit();
      this.selectGroup(grouped);
    });
  }

  updateGroup(id: string, name: string) {
    this.groupedService.updateGroup(id, name, this.selectedGroup.idx).subscribe(() => this.discardGroupEdit());
  }

  discardGroupEdit() {
    this.addNewGroup = false;
    this.editGroup = false;
  }
}
