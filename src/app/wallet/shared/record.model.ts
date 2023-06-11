export interface Record {
  id: string;
  account: string;
  amount: number;
  type: string;
  category: string,
  description?: string,
  time: string;
  createdBy: string;
}

export interface CreateRecord {
  account: string;
  amount: number;
  type: string
  category: string;
  description?: string;
  time: string;
}
