import { Award, Users, Target, ShieldCheck, Truck, HeartHandshake } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AboutUsValues() {
  const values = [
    {
      icon: <Award className="h-6 w-6 " />,
      title: "Calidad",
      description: "Ofrecemos productos de la más alta calidad para garantizar la satisfacción de nuestros clientes.",
      gradient: "from-primary to-primary/70",
      bgGradient: "from-primary/10 to-primary/5",
    },
    {
      icon: <Users className="h-6 w-6 text-foreground" />,
      title: "Servicio",
      description: "Brindamos atención personalizada y asesoramiento experto para cada proyecto.",
      gradient: "from-secondary to-secondary/70",
      bgGradient: "from-secondary/10 to-secondary/5",
    },
    {
      icon: <Target className="h-6 w-6 text-foreground" />,
      title: "Innovación",
      description: "Nos mantenemos actualizados con las últimas tendencias y tecnologías en ferretería.",
      gradient: "from-accent to-accent/70",
      bgGradient: "from-accent/10 to-accent/5",
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Confianza",
      description: "Construimos relaciones duraderas basadas en la honestidad y transparencia.",
      gradient: "from-primary to-secondary",
      bgGradient: "from-primary/5 to-secondary/5",
    },
    {
      icon: <Truck className="h-6 w-6 text-foreground" />,
      title: "Eficiencia",
      description: "Garantizamos entregas puntuales y un servicio eficiente en cada interacción.",
      gradient: "from-secondary to-accent",
      bgGradient: "from-secondary/5 to-accent/5",
    },
    {
      icon: <HeartHandshake className="h-6 w-6" />,
      title: "Compromiso",
      description: "Estamos comprometidos con la satisfacción total de nuestros clientes.",
      gradient: "from-accent to-primary",
      bgGradient: "from-accent/5 to-primary/5",
    },
  ]

  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-muted/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.1),transparent_50%)]" />

      <div className="container relative px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
          <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
            <Target className="w-4 h-4 mr-2" />
            Nuestros Principios
          </Badge>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Nuestros Valores
            </h2>
            <div className="flex items-center justify-center space-x-2">
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full" />
              <div className="h-1 w-8 bg-gradient-to-r from-secondary to-accent rounded-full" />
              <div className="h-1 w-4 bg-accent rounded-full" />
            </div>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg lg:text-xl">
              Los principios que guían nuestro trabajo diario y nuestras decisiones.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <Card
              key={index}
              className={`group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-gradient-to-br ${value.bgGradient} backdrop-blur-sm`}
            >
              <CardContent className="p-8 relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-3xl" />

                <div className="flex flex-col items-center space-y-6 text-center relative z-10">
                  <div
                    className={`relative rounded-2xl bg-gradient-to-br ${value.gradient} p-4 text-primary-foreground shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {value.icon}
                    <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {value.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
