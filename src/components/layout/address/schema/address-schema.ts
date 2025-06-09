import * as z from "zod";

export const addressFormSchema = z.object({
  calle: z.string().min(1, "La calle es requerida"),
  ciudad: z.string().min(1, "La ciudad es requerida"),
  estado: z.string().min(1, "El estado es requerido"),
  codigoPostal: z
    .string()
    .min(5, "El código postal debe tener al menos 5 dígitos")
    .max(5, "El código postal debe tener máximo 5 dígitos")
    .regex(/^\d+$/, "El código postal debe ser un número"),
  numeroExterior: z
    .string()
    .min(1, "El número exterior es requerido")
    .regex(/^\d+$/, "El número exterior debe ser un número"),
  numeroInterior: z
    .string()
    .regex(/^\d*$/, "El número interior debe ser un número")
    .nullable()
    .optional(),
  referencia: z.string().optional(),
  nombreRecibe: z.string().min(1, "El nombre de quien recibe es requerido"),
  telefono: z
    .string()
    .regex(/^(\+52\s?)?(\d{10})$/, "El teléfono debe tener 10 dígitos, con o sin prefijo +52"),
});

export type AddressFormValues = z.infer<typeof addressFormSchema>;
