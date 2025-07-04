import { Timestamp } from "firebase-admin/firestore";

export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id?: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date; 
  updatedAt?: Timestamp;
  description?: string;
  createdAt?: Timestamp;
}

export type Props = {
  showAddTransaction: boolean;
  setShowAddTransaction: React.Dispatch<React.SetStateAction<boolean>>;
};

export type FirestoreTimestamp = {
  _seconds: number;
  _nanoseconds?: number;
} | Date | string | number | null | undefined;

export interface ChartDataPoint {
  date: string;
  amount: number;
  type: TransactionType;
}

export interface FormData {
  amount: string;
  type: TransactionType;
  category: string;
  date: string;
  description: string;
}

export interface PieLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  name: string;
  value: number;
}