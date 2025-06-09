import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { Personal } from "@/interfaces/informacion-tienda/informacion-tienda.interface"



interface AboutUsTeamProps {
  team?: Personal[]
}

export default function AboutUsTeam({ team }: AboutUsTeamProps) {
  if (!team || team.length === 0) {
    return null
  }

  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-muted/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.1),transparent_50%)]" />

      <div className="container relative px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center mb-12">
          <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
            <Users className="w-4 h-4 mr-2" />
            Nuestro Equipo
          </Badge>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Conoce a Nuestro Equipo
            </h2>
            <div className="flex items-center justify-center space-x-2">
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full" />
              <div className="h-1 w-8 bg-gradient-to-r from-secondary to-accent rounded-full" />
              <div className="h-1 w-4 bg-accent rounded-full" />
            </div>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg lg:text-xl">
              Conoce a las personas que hacen posible nuestra misión.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <Card
              key={member.id}
              className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-0 bg-gradient-to-br from-card via-card to-primary/5"
            >
              <CardContent className="p-0 relative">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={member.img.url || "/placeholder.svg"}
                    alt={`Foto de ${member.nombre}`}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/20 to-transparent" />
                </div>

                <div className="p-6 text-center space-y-3 relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                  </div>

                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {member.nombre}
                  </h3>

                  <Badge
                    variant="secondary"
                    className={`font-normal bg-gradient-to-r ${
                      index % 3 === 0
                        ? "from-primary/10 to-primary/5 text-primary border-primary/20"
                        : index % 3 === 1
                          ? "from-secondary/10 to-secondary/5 text-secondary border-secondary/20"
                          : "from-accent/10 to-accent/5 text-accent border-accent/20"
                    }`}
                  >
                    {member.puesto}
                  </Badge>

                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
