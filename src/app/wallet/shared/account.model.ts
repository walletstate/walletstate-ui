import { Group } from './group.model';

export interface Account {
  id: string;
  wallet: string;
  name: string;
  icon?: string;
  tags?: string[];
  createdBy: string;
}

export interface CreateAccount {
  name: string;
  group: string;
  icon: string;
  orderingIndex: string;
}

export class GroupedAccounts {
  _editMode: boolean = false;
  updateName: string;

  constructor(
    public id: string,
    public name: string,
    public orderingIndex: number,
    public accounts: Account[]
  ) {
    this.updateName = name;
  }

  get editMode() {
    return this._editMode;
  }

  switchMode() {
    this._editMode = !this._editMode;
  }

  saveUpdate() {
    this.name = this.updateName;
  }

  discardUpdate() {
    this.updateName = this.name;
  }

  static fromGroup(group: Group<Account>) {
    return new GroupedAccounts(group.id, group.name, group.orderingIndex, group.items ? group.items : []);
  }
}
