export enum PaymentProvider {
  STRIPE = 'STRIPE',
  MERCADO_PAGO = 'MERCADP_PAGO',
}

export const PaymentCallbackUrls: Record<PaymentProvider, string> = {
  [PaymentProvider.STRIPE]: 'http://localhost:3000/pedidos',
  [PaymentProvider.MERCADO_PAGO]: 'http://localhost:3000/pedidos',
};
