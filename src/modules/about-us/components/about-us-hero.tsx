import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

interface AboutUsHeroProps {
  companyName?: string |null
  slogan?: string |null
}

export default function AboutUsHero({ companyName, slogan }: AboutUsHeroProps) {
  return (
    <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent/10 rounded-full blur-lg animate-bounce" />

      <div className="container relative px-4 md:px-6">
        <div className="flex flex-col items-center space-y-6 text-center">
          <Badge
            variant="outline"
            className="px-4 py-2 text-sm bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 transition-colors"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Sobre Nosotros
          </Badge>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-in slide-in-from-bottom-4 duration-1000">
              {companyName}
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-primary via-secondary to-primary mx-auto rounded-full" />
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl lg:text-2xl animate-in slide-in-from-bottom-6 duration-1000 delay-300">
              {slogan || "Tu ferretería de confianza"}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
