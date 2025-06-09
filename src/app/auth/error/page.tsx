// 👇 Esto fuerza a que Next.js no prerenderice y lo trate como una página 100% dinámica
export const dynamic = "force-dynamic";


import Link from "next/link"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { ECOMMERCE_PRIVADO } from '../../../contants/auth/ecommerce-privado.constant';



export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 to-rose-100 p-4">
      <Card className="w-full max-w-md border-rose-200 shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-2 pb-2 text-center">
          <div className="rounded-full bg-rose-100 p-3">
            <AlertCircle className="h-10 w-10 text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-rose-700">Error de autenticación</h1>
        </CardHeader>

        <CardContent className="text-center">
          <p className="mb-4 text-muted-foreground">
            Lo sentimos, ha ocurrido un problema con tu autenticación. Esto puede deberse a:
          </p>
          <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
            <li className="rounded-md bg-rose-50 p-2">• El enlace de autenticación ha expirado</li>
            <li className="rounded-md bg-rose-50 p-2">• Las credenciales proporcionadas son incorrectas</li>
            <li className="rounded-md bg-rose-50 p-2">• Tu sesión ha finalizado</li>
            {
                ECOMMERCE_PRIVADO&&
             <li className="rounded-md bg-rose-50 p-2">• Tu cuenta no esta registrada comunicate con nosotros</li>
            }
          </ul>
        </CardContent>

        <CardFooter className="flex flex-col space-y-3">
          {/* <Button className="w-full bg-rose-600 hover:bg-rose-700">
            <RefreshCw className="mr-2 h-4 w-4" />
            Intentar nuevamente
          </Button> */}
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full border-rose-200">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
