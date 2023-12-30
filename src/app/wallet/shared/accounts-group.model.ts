export interface AccountsGroup {
  id: string;
  name: string;
  orderingIndex: number;
  items?: SimpleAccount[];
}

export interface CreateAccountsGroup {
  name: string;
  orderingIndex: number;
}

export interface UpdateAccountsGroup {
  name: string;
}

export interface SimpleAccount {
  id: string;
  name: string;
  orderingIndex: number;
  icon: string;
  tags: string[];
}

export class AccountsGroupWithAccounts {
  _editMode: boolean = false;
  updateName: string;

  constructor(
    public id: string,
    public name: string,
    public orderingIndex: number,
    public accounts: SimpleAccount[]
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

  static fromGroup(group: AccountsGroup) {
    return new AccountsGroupWithAccounts(group.id, group.name, group.orderingIndex, group.items ? group.items : []);
  }
}
