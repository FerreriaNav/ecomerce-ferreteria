"use client"

import type { Control } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import type { AddressFormValues } from "../schema/address-schema"

interface AddressTxtAreaProps {
  control: Control<AddressFormValues>
  name: keyof AddressFormValues
  label: string
  placeholder: string
  optional?: boolean
}

export function AddressTxtArea({ control, name, label, placeholder, optional = false }: AddressTxtAreaProps) {
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
            <Textarea
              placeholder={placeholder}
              {...field}
              value={field.value || ""}
              className="min-h-[80px] text-base resize-y"
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  )
}
