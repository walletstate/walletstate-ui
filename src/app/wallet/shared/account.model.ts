export interface Account {
  id: string;
  wallet: string;
  name: string;
  createdBy: string
}

export interface CreateAccount {
  name: string;
}
