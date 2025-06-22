"use client"

import { FileText, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { usePedidoStore } from "@/store/pedido.store"
import { useCartStore } from "@/store/products-cart.store"

interface QuoteStepProps {
  onGenerateQuote?: () => Promise<void>
}

export const QuoteStep = ({ onGenerateQuote }: QuoteStepProps) => {
  const { pedido, notaCliente, loading, error, success, setNotaCliente, setError } = usePedidoStore()

  const { getCartSummary, cart } = useCartStore()
  const { total } = getCartSummary()

  const handleNotaChange = (value: string) => {
    setNotaCliente(value)
    // Clear any previous errors when user starts typing
    if (error) {
      setError(null)
    }
  }

  const handleGenerateQuote = async () => {
    if (!onGenerateQuote) return
    await onGenerateQuote()
  }

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
          Solo se puede generar una cotización estándar. Una vez creada, el Administrador podrá compartir la cotización
          y podrá verla en la sección de Cotizaciones.
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
        <CardContent className="space-y-4">
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

          {cart && cart.length > 0 && (
            <div className="space-y-2">
              <Label>Resumen de productos</Label>
              <div className="text-sm text-muted-foreground">{cart.length} producto(s) seleccionado(s)</div>
              <div className="text-lg font-semibold">Total estimado: ${total.toFixed(2)}</div>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
