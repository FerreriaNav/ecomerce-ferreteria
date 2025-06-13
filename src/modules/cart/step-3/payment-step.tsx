// "use client";

// import { useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { CreditCard, AlertCircle } from "lucide-react";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Separator } from "@/components/ui/separator";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { formSchema } from "./schema";
// import Image from "next/image";
// import {} from "@/interfaces/orders/pedido.interface";
// import { PaymentProvider } from "@/interfaces/payments-providers/payment-prodivers";
// import { usePedidoStore } from "@/store/pedido.store";

// export const PaymentStep = () => {
//   const [error] = useState<string | null>(null);
//   const { setProvider } = usePedidoStore();
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       paymentProvider: undefined,
//     },
//   });

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-lg font-semibold mb-2">Método de pago</h2>
//         <p className="text-sm text-muted-foreground">
//           Selecciona tu método de pago preferido. Serás redirigido a la
//           plataforma del proveedor para completar el pago de forma segura.
//         </p>
//       </div>

//       {error && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       <Form {...form}>
//         <form className="space-y-6">
//           <FormField
//             control={form.control}
//             name="paymentProvider"
//             render={({ field }) => (
//               <FormItem className="space-y-3">
//                 <FormControl>
//                   <RadioGroup
//                     onValueChange={(value) => {
//                       field.onChange(value);
//                       setProvider(value as PaymentProvider);
//                     }}
//                     defaultValue={field.value}
//                     className="flex flex-col space-y-3"
//                   >
//                     <label
//                       htmlFor="stripe"
//                       className="flex items-center space-x-3 border rounded-md p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
//                     >
//                       <RadioGroupItem value="STRIPE" id="stripe" />
//                       <div className="flex items-center space-x-2 flex-1">
//                         <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-md">
//                           <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-300" />
//                         </div>
//                         <div>
//                           <p className="font-medium">Stripe</p>
//                           <p className="text-sm text-muted-foreground">
//                             Paga con tarjeta de crédito o débito a través de
//                             Stripe
//                           </p>
//                         </div>
//                       </div>
//                       <Image
//                         src="/icons/stripe.webp"
//                         alt="Stripe"
//                         width={32}
//                         height={32}
//                         className="h-8"
//                       />
//                     </label>

//                     <label
//                       htmlFor="mercadopago"
//                       className="flex items-center space-x-3 border rounded-md p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
//                     >
//                       <RadioGroupItem value="MERCADO_PAGO" id="mercadopago" />
//                       <div className="flex items-center space-x-2 flex-1">
//                         <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-md">
//                           <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-300" />
//                         </div>
//                         <div>
//                           <p className="font-medium">Mercado Pago</p>
//                           <p className="text-sm text-muted-foreground">
//                             Paga con tarjeta de crédito, débito o saldo de
//                             Mercado Pago
//                           </p>
//                         </div>
//                       </div>
//                       <Image
//                         src="/icons/mercado-pago.webp"
//                         alt="Mercado Pago"
//                         width={40}
//                         height={30}
//                         className="h-8"
//                       />
//                     </label>
//                   </RadioGroup>
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Separator />
//         </form>
//       </Form>
//     </div>
//   );
// };
