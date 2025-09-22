export interface BillingRecord {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  categoryLabel: string;
  description?: string;
  date: string;
  createdAt: string;
}

export interface Category {
  value: string;
  label: string;
  icon?: string;
}

export const BILLING_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export const STORAGE_KEYS = {
  BILLING_RECORDS: 'billing_records',
} as const;
