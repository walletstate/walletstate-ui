export enum GroupType {
  Accounts = 'accounts',
  Categories = 'categories',
}

export interface Group<T> {
  id: string;
  name: string;
  orderingIndex: number;
  items?: T[];
}

export interface CreateGroup {
  name: string;
  orderingIndex: number;
}

export interface UpdateGroup {
  name: string;
  orderingIndex: number;
}

export class GroupControl<T> {
  _editMode: boolean = false;
  _addNewItemMode: boolean = false;

  updateName: string;
  updateOrderingIndex: number;

  newItemName: string = '';
  newItemIcon: string = '';
  newItemOrderingIndex: number = 0;

  constructor(
    public id: string,
    public name: string,
    public orderingIndex: number,
    public items: T[]
  ) {
    this.updateName = name;
    this.updateOrderingIndex = orderingIndex;
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
    this.orderingIndex = this.updateOrderingIndex;
  }

  discardUpdate() {
    this.updateName = this.name;
    this.updateOrderingIndex = this.orderingIndex;
  }

  addNewItem(defaultIcon: string = '') {
    this.newItemName = '';
    this.newItemIcon = defaultIcon ?? '';
    this.newItemOrderingIndex = 0;
    this._addNewItemMode = true;
  }

  saveNewItem(item: T) {
    this.items.push(item);
    this._addNewItemMode = false;
  }

  discardNewItem() {
    this._addNewItemMode = false;
  }

  static fromGroup<A>(group: Group<A>): GroupControl<A> {
    return new GroupControl(group.id, group.name, group.orderingIndex, group.items ?? []);
  }
}
