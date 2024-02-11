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
