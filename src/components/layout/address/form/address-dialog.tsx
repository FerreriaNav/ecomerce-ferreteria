/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { type ReactNode, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import type { Address } from "@/interfaces/directions/directions.interface"
import { addressFormSchema, type AddressFormValues } from "../schema/address-schema"
import { DialogTrigger } from "@/components/ui/dialog"
import { createDirection, updateDirection } from "@/services/directions/directions-services"
import { showToastAlert } from "@/components/ui/altertas/toast"
import { AddressInput } from "./address-inputs"
import { AddressTxtArea } from "./address-area"
import { Loader2 } from "lucide-react"

interface AddressDialogProps {
  address?: Address | null
  children: ReactNode
  userId?: number | undefined
  onRefreshCard?: () => void
  onAddressAdded?: (address: Address) => void
}

export function AddressDialog({ address, children, userId, onRefreshCard, onAddressAdded }: AddressDialogProps) {
  const [open, setOpen] = useState(false)
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      calle: "",
      ciudad: "",
      estado: "",
      codigoPostal: "",
      numeroExterior: "",
      numeroInterior: null,
      nombreRecibe: "",
      telefono: "",
      referencia: "",
    },
  })

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (address) {
      // Map null referencia to undefined for compatibility with form.reset
      form.reset({
        ...address,
        referencia: address.referencia === null ? undefined : address.referencia,
      })
    } else {
      form.reset({
        calle: "",
        ciudad: "",
        estado: "",
        codigoPostal: "",
        numeroExterior: "",
        numeroInterior: null,
        nombreRecibe: "",
        telefono: "",
        referencia: "",
      })
      setIsEditing(true)
    }
  }, [address, form, open])

  useEffect(() => {
  if (!address) return

  const subscription = form.watch((values) => {
    // Comparamos los valores actuales del formulario con la dirección original
    const isDifferent = JSON.stringify(values) !== JSON.stringify({
      ...address,
      referencia: address.referencia === null ? undefined : address.referencia,
    })

    setIsEditing(isDifferent)
  })

  return () => subscription.unsubscribe()
}, [address, form])


  async function onSubmit(values: AddressFormValues) {
    setLoading(true)
    const newAddress: Address = {
      ...values,
    } as Address

    try {
      if (!address) {
        //? Crear nueva dirección
        const createdAddress = await createDirection(newAddress, userId!)
        setLoading(false)
        form.reset()
        showToastAlert({
          title: "Dirección Creada",
          text: "La dirección se ha agregado correctamente.",
          icon: "success",
          position: "bottom-end",
          toast: true,
        })

        // Notificar que se ha añadido una dirección
        if (onAddressAdded && createdAddress) {
          onAddressAdded(createdAddress)
        }

        if (onRefreshCard) {
          onRefreshCard()
        }

        setOpen(false)
      } else {
        //? EDITAR UNA DIRECCIÓN
        const { id, updatedAt, createdAt, publishedAt, ...payload } = newAddress
        await updateDirection(address.documentId!, payload)
        setLoading(false)
        showToastAlert({
          title: "Dirección Actualizada",
          text: "La dirección se ha actualizado correctamente.",
          icon: "success",
          position: "bottom-end",
          toast: true,
        })

        if (onRefreshCard) {
          onRefreshCard()
        }

        setOpen(false)
      }
    } catch (err: unknown) {
      setLoading(false)
      let errorMessage = "Error desconocido";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      console.error("Error al procesar dirección:", errorMessage);
      showToastAlert({
        title: "Error",
        text: "Ocurrió un error al procesar la dirección.",
        icon: "error",
        position: "bottom-end",
        toast: true,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[500px] p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="space-y-2 mb-4">
          <DialogTitle className="text-xl">{address ? "Editar dirección" : "Agregar nueva dirección"}</DialogTitle>
          <DialogDescription className="text-sm">
            Completa los datos de la dirección. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <AddressInput
                  control={form.control}
                  name="nombreRecibe"
                  label="Nombre quien recibe"
                  placeholder="Nombre completo"
                />
              </div>
              <AddressInput
                control={form.control}
                name="telefono"
                label="Teléfono"
                placeholder="Teléfono quien recibe"
              />
              <AddressInput control={form.control} name="calle" label="Calle" placeholder="Nombre de la calle" />
              <AddressInput
                control={form.control}
                name="numeroExterior"
                label="Número exterior"
                placeholder="Número exterior"
              />
              <AddressInput
                control={form.control}
                name="numeroInterior"
                label="Número interior"
                placeholder="Número interior (opcional)"
                optional
              />
              <AddressInput control={form.control} name="ciudad" label="Ciudad" placeholder="Ciudad" />
              <AddressInput control={form.control} name="estado" label="Estado" placeholder="Estado" />
              <AddressInput
                control={form.control}
                name="codigoPostal"
                label="Código postal"
                placeholder="Código postal"
              />
            </div>
            <div className="pt-2">
              <AddressTxtArea
                control={form.control}
                name="referencia"
                label="Referencias adicionales"
                placeholder="Detalles para facilitar la entrega (color de casa, puntos de referencia, etc.)"
                optional
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 mt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="min-w-[140px]" disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{address ? "Actualizando..." : "Guardando..."}</span>
                  </div>
                ) : address ? (
                  "Actualizar dirección"
                ) : (
                  "Guardar dirección"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
