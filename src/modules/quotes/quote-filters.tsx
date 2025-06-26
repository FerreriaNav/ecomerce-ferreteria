"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownAZ, ArrowUpAZ, CalendarDays } from "lucide-react"

export function QuotesFilters() {
  return (
    <div className="flex gap-2">
      <Select defaultValue="reciente">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="reciente" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" /> Más recientes
          </SelectItem>
          <SelectItem value="antiguo" className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4" /> Más antiguos
          </SelectItem>
          <SelectItem value="mayor" className="flex items-center gap-2">
            <ArrowDownAZ className="h-4 w-4" /> Mayor precio
          </SelectItem>
          <SelectItem value="menor" className="flex items-center gap-2">
            <ArrowUpAZ className="h-4 w-4" /> Menor precio
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
