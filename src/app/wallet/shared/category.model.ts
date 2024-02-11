export interface Category {
  id: string;
  name: string;
  group: string;
  icon: string;
  orderingIndex: string;
  createdBy: string;
}

export interface CreateCategory {
  name: string;
  group: string;
  icon: string;
  orderingIndex: string;
}
