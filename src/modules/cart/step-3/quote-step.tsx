"use client"

import { FileText, AlertCircle, CheckCircle, CreditCard, Banknote, Building2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { usePedidoStore } from "@/store/pedido.store"
import { useCartStore } from "@/store/products-cart.store"
import { MetodoPago } from "@/interfaces/cotizaciones/cotizacion.interface"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export const QuoteStep = () => {
  const { notaCliente, metodoPago, loading, error, success, setNotaCliente, setMetodoPago, setError } =
    usePedidoStore()

  const { cart } = useCartStore()

  const handleNotaChange = (value: string) => {
    setNotaCliente(value)
    if (error) {
      setError(null)
    }
  }

  const handleMetodoPagoChange = (value: string) => {
    setMetodoPago(value as MetodoPago)
    if (error) {
      setError(null)
    }
  }

  const paymentMethods = [
    {
      value: MetodoPago.EFECTIVO,
      label: "Efectivo",
      icon: <Banknote className="h-4 w-4 text-emerald-600" />,
      description: "Pago en efectivo al momento de la entrega",
    },
    {
      value: MetodoPago.TRANSFERENCIA,
      label: "Transferencia Bancaria",
      icon: <CreditCard className="h-4 w-4 text-blue-600" />,
      description: "Transferencia directa a cuenta bancaria",
    },
    {
      value: MetodoPago.DEPOSITO,
      label: "Depósito Bancario",
      icon: <Building2 className="h-4 w-4 text-purple-600" />,
      description: "Depósito en sucursal bancaria",
    },
  ]

  if (success) {
    return (
      <div className="space-y-6">
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800 dark:text-green-200">¡Cotización generada exitosamente!</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            Tu cotización ha sido creada y enviada a la sucursal para su revisión.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Generar Cotización</h2>
        <p className="text-sm text-muted-foreground">
          Una vez creada la cotización, la sucursal podrá compartir la cotización y podrá verla en la sección de
          Cotizaciones.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-green-600 dark:text-green-300" />
            <span>Cotización Estándar</span>
          </CardTitle>
          <CardDescription>Genera una cotización básica con los productos seleccionados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {cart && cart.length > 0 && (
            <div className="space-y-2">
              <Label>Resumen de productos</Label>
              <div className="text-sm text-muted-foreground">{cart.length} producto(s) seleccionado(s)</div>
            </div>
          )}

          {/* Opción 1: Select Component */}
          {/* <div className="space-y-3">
            <Label htmlFor="payment-method">Método de pago *</Label>
            <Select value={metodoPago || ""} onValueChange={handleMetodoPagoChange} disabled={loading}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un método de pago" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    <div className="flex items-center space-x-2">
                      {method.icon}
                      <span>{method.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {metodoPago && (
              <p className="text-sm text-muted-foreground">
                {paymentMethods.find((m) => m.value === metodoPago)?.description}
              </p>
            )}
          </div> */}

          {/* Opción 2: RadioGroup Mejorado (comentado para mostrar alternativa) */}
          <div className="space-y-3">
            <Label>Método de pago *</Label>
            <RadioGroup value={metodoPago || ""} onValueChange={handleMetodoPagoChange} disabled={loading}>
              {paymentMethods.map((method) => (
                <div key={method.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={method.value} id={method.value} />
                  <Label 
                    htmlFor={method.value} 
                    className="flex-1 cursor-pointer border rounded-lg p-3 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      {method.icon}
                      <div className="flex-1">
                        <div className="font-medium">{method.label}</div>
                        <div className="text-sm text-muted-foreground">{method.description}</div>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="nota-cliente">Nota adicional (opcional)</Label>
            <Textarea
              id="nota-cliente"
              placeholder="Agrega cualquier comentario o especificación adicional..."
              value={notaCliente}
              onChange={(e) => handleNotaChange(e.target.value)}
              rows={3}
              disabled={loading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
