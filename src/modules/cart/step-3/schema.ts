import * as z from "zod";
 
export const formSchema = z.object({
  paymentProvider:z.enum(["STRIPE", "MERCADO_PAGO"], {
    required_error: "Por favor selecciona un método de pago",
  }),
});

export type formSchemaValues = z.infer<typeof formSchema>;