import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CotizacionEmptyProps {
  estatus?: string
}

export function QuotesEmpty({ estatus }: CotizacionEmptyProps) {
  const getMessage = () => {
    if (!estatus || estatus === "todos") {
      return "No tienes cotizaciones todavía."
    }

    return `No tienes cotizaciones en estado "${estatus}".`
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-6 mb-4">
        {!estatus || estatus === "todos" ? (
          <FileText className="h-12 w-12 text-slate-400" />
        ) : (
          <FileText className="h-12 w-12 text-slate-400" />
        )}
      </div>
      <h2 className="text-xl font-semibold mb-2">Sin cotizaciones</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">{getMessage()}</p>
      <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white">
        <Link href="/">Explorar productos</Link>
      </Button>
    </div>
  )
}
