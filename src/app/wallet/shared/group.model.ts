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
}
