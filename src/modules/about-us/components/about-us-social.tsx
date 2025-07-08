import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Share2 } from "lucide-react"

interface SocialNetwork {
  nombreRedSocial: string
  url: string
  icono: {
    url: string
  }
}

interface AboutUsSocialProps {
  socialNetworks?: SocialNetwork[]
}

export default function AboutUsSocial({ socialNetworks }: AboutUsSocialProps) {
  if (!socialNetworks || socialNetworks.length === 0) {
    return null
  }

  return (
    <section className="relative w-full py-10 md:py-10 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-background to-background" />

      <div className="container relative px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary">
            <Share2 className="w-4 h-4 mr-2" />
            Redes Sociales
          </Badge>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Síguenos
            </h2>
            <div className="flex items-center justify-center space-x-2">
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full" />
              <div className="h-1 w-8 bg-gradient-to-r from-secondary to-accent rounded-full" />
              <div className="h-1 w-4 bg-accent rounded-full" />
            </div>
            <p className="mx-auto max-w-[500px] text-muted-foreground md:text-lg">
              Mantente al día con nuestras novedades, ofertas y consejos
            </p>
          </div>

          <Card className="w-full max-w-md border-0 shadow-2xl bg-gradient-to-br from-card via-card to-primary/5">
            <CardContent className="p-8">
              <div className="flex flex-wrap justify-center gap-6">
                {socialNetworks.map((network, index) => (
                  <Link
                    href={network.url}
                    key={network.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                  >
                    <div
                      className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${
                        index % 3 === 0
                          ? "from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10"
                          : index % 3 === 1
                            ? "from-secondary/10 to-secondary/5 hover:from-secondary/20 hover:to-secondary/10"
                            : "from-accent/10 to-accent/5 hover:from-accent/20 hover:to-accent/10"
                      } flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg border border-border/50`}
                    >
                      <Image
                        width={28}
                        height={28}
                        src={network.icono.url || "/placeholder.svg"}
                        alt={network.nombreRedSocial}
                        className="w-7 h-7 transition-transform duration-300 group-hover:scale-110"
                      />

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Animated border */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/30 transition-colors duration-300" />
                    </div>

                    <span className="sr-only">{network.nombreRedSocial}</span>

                    {/* Tooltip */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
                        {network.nombreRedSocial}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
