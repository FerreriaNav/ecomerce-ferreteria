"use client"

import { Check, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface CheckoutStepperProps {
  currentStep: number
  setCurrentStep: (step: number) => void
}

export function CheckoutStepper({ currentStep, setCurrentStep }: CheckoutStepperProps) {
  const steps = [
    { id: 1, name: "Carrito" },
    { id: 2, name: "Dirección" },
    { id: 3, name: "Cotización" },
  ]

  return (
    <div className="w-full py-6">
      <div className="flex w-full">
        {steps.map((step, index) => (
          <div key={step.id} className="flex-1">
            <div className="relative flex flex-col items-center">
              {/* Número del paso con círculo usando Button de shadcn */}
              <div className="relative">
                <Button
                  onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                  disabled={step.id > currentStep}
                  size="icon"
                  variant={step.id < currentStep ? "default" : step.id === currentStep ? "outline" : "secondary"}
                  className={cn(
                    "h-12 w-12 rounded-full border-2 text-base font-semibold",
                    step.id < currentStep
                      ? "border-primary"
                      : step.id === currentStep
                        ? "border-primary"
                        : "border-muted",
                    step.id < currentStep
                      ? "cursor-pointer"
                      : step.id > currentStep
                        ? "cursor-not-allowed opacity-50"
                        : "",
                  )}
                >
                  {step.id < currentStep ? <Check className="h-5 w-5" /> : step.id}
                </Button>

                {/* Indicador de estado usando Badge de shadcn */}
                <Badge
                  variant={step.id < currentStep ? "default" : step.id === currentStep ? "outline" : "secondary"}
                  className={cn(
                    "absolute -bottom-1 -right-1 h-4 w-4 rounded-full p-0",
                    step.id < currentStep
                      ? "bg-green-500 text-green-50"
                      : step.id === currentStep
                        ? "border-2 border-background bg-primary"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  <span className="sr-only">
                    {step.id < currentStep ? "Completado" : step.id === currentStep ? "Actual" : "Pendiente"}
                  </span>
                </Badge>
              </div>

              {/* Nombre del paso */}
              <div className="mt-3 text-center">
                <span
                  className={cn(
                    "text-sm font-medium",
                    step.id === currentStep ? "text-primary font-semibold" : "text-muted-foreground",
                  )}
                >
                  {step.name}
                </span>
              </div>

              {/* Línea conectora */}
              {index < steps.length - 1 && (
                <div className="absolute top-6 left-[calc(50%+1.5rem)] w-[calc(100%-3rem)]">
                  <div className="relative h-1 w-full">
                    {/* Línea base */}
                    <div className="absolute h-full w-full rounded-full bg-muted" />

                    {/* Línea de progreso */}
                    <div
                      className={cn(
                        "absolute h-full rounded-full bg-primary transition-all duration-500 ease-in-out",
                        step.id < currentStep ? "w-full" : "w-0",
                      )}
                    />

                    {/* Flechas decorativas */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex w-full justify-evenly">
                        {[...Array(3)].map((_, i) => (
                          <ChevronRight
                            key={i}
                            className={cn(
                              "h-4 w-4 transition-all duration-300",
                              step.id < currentStep ? "text-primary" : "text-muted-foreground/30",
                              step.id < currentStep ? "opacity-100" : "opacity-50",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
