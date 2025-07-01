import { Timestamp } from "firebase-admin/firestore";

export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id?: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Timestamp; 
  updatedAt?: Timestamp;
  description?: string;
  createdAt?: Timestamp;
}