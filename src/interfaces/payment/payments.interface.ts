
export interface PaymentItem {
  id: string
  title: string
  description: string
  quantity: number
  unitPrice: number
}

export interface PaymentRequest {
  currency: string
  description: string
  callbackUrl: string
  provider: "STRIPE" | "MERCADO_PAGO"
  items: PaymentItem[]
  totalAmount?: number
}

export interface Payment {
  id: number
  paymentId: string
  status: string
  redirectUrl: string
}
