import * as z from "zod";
 
export const formSchema = z.object({
  quoteType: z.enum(["STANDARD", "DETAILED"]),
})

export type formSchemaValues = z.infer<typeof formSchema>;