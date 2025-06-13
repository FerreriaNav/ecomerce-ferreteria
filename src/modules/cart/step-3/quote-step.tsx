"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type * as z from "zod"
import { FileText, AlertCircle, ClipboardList } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { formSchema } from "./schema/schema"
import { usePedidoStore } from "@/store/pedido.store"

export const QuoteStep = () => {
  const [error] = useState<string | null>(null)
  const { setQuoteType } = usePedidoStore()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quoteType: undefined,
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Generar Cotización</h2>
        <p className="text-sm text-muted-foreground">
          Selecciona el tipo de cotización que deseas generar. Una vez creada, podrás revisarla y compartirla.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="quoteType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => {
                      field.onChange(value)
                      setQuoteType(value as "STANDARD" | "DETAILED")
                    }}
                    defaultValue={field.value}
                    className="flex flex-col space-y-3"
                  >
                    <label
                      htmlFor="standard"
                      className="flex items-center space-x-3 border rounded-md p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      <RadioGroupItem value="STANDARD" id="standard" />
                      <div className="flex items-center space-x-2 flex-1">
                        <div className="bg-green-100 dark:bg-green-900 p-2 rounded-md">
                          <FileText className="h-5 w-5 text-green-600 dark:text-green-300" />
                        </div>
                        <div>
                          <p className="font-medium">Cotización Estándar</p>
                          <p className="text-sm text-muted-foreground">
                            Genera una cotización básica con los productos seleccionados
                          </p>
                        </div>
                      </div>
                    </label>

                    <label
                      htmlFor="detailed"
                      className="flex items-center space-x-3 border rounded-md p-4 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      <RadioGroupItem value="DETAILED" id="detailed" />
                      <div className="flex items-center space-x-2 flex-1">
                        <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-md">
                          <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                          <p className="font-medium">Cotización Detallada</p>
                          <p className="text-sm text-muted-foreground">
                            Incluye especificaciones detalladas y condiciones comerciales
                          </p>
                        </div>
                      </div>
                    </label>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
        </form>
      </Form>
    </div>
  )
}
