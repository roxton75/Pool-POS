export interface Payment {
  id: string;
  sessionId: string;
  amount: number;
  method: string;
  note: string | null;
  paidAt: string;
}

export interface CreatePaymentInput {
  sessionId: string;
  amount: number;
  method: string;
  note?: string | null;
}