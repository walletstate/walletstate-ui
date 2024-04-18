import { Group, Grouped } from '@walletstate/angular-client';

export class GroupControl<T> {
  _editMode: boolean = false;
  _addNewItemMode: boolean = false;

  updateName: string;
  updateIdx: number;

  newItemName: string = '';
  newItemIcon: string = '';
  newItemIdx: number = 0;

  constructor(
    public id: string,
    public name: string,
    public idx: number,
    public items: T[]
  ) {
    this.updateName = name;
    this.updateIdx = idx;
  }

  get editMode() {
    return this._editMode;
  }
  get addNewItemMode() {
    return this._addNewItemMode;
  }

  switchMode() {
    this._editMode = !this._editMode;
  }

  saveUpdate() {
    this.name = this.updateName;
    this.idx = this.updateIdx;
  }

  discardUpdate() {
    this.updateName = this.name;
    this.updateIdx = this.idx;
  }

  addNewItem(defaultIcon: string = '') {
    this.newItemName = '';
    this.newItemIcon = defaultIcon ?? '';
    this.newItemIdx = 0;
    this._addNewItemMode = true;
  }

  saveNewItem(item: T) {
    this.items.push(item);
    this._addNewItemMode = false;
  }

  discardNewItem() {
    this._addNewItemMode = false;
  }

  static fromGrouped<A>(group: Grouped<A>): GroupControl<A> {
    return new GroupControl(group.id, group.name, group.idx, group.items);
  }

  static fromGroup<A>(group: Group): GroupControl<A> {
    return new GroupControl(group.id, group.name, group.idx, []);
  }
}
