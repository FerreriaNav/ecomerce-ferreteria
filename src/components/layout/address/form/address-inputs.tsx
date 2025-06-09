"use client"

import type { Control } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { AddressFormValues } from "../schema/address-schema"

interface AddressInputProps {
  control: Control<AddressFormValues>
  name: keyof AddressFormValues
  label: string
  placeholder: string
  optional?: boolean
}

export function AddressInput({ control, name, label, placeholder, optional = false }: AddressInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">
            {label} {!optional && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} value={field.value || ""} className="h-10 text-base" />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  )
}
