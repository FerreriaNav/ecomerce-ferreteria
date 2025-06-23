"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddressCard } from "./address-card";
import { AddressDialog } from "./form/address-dialog";
import { Address } from "@/interfaces/directions/directions.interface";
import { Session } from "next-auth";
import { getUserDirections } from "@/services/directions/directions-services";

interface AddressGridProps {
  address: Address[];
  session: Session;
}

export default function AddressGrid({ address, session }: AddressGridProps) {
  const [addresses, setAddresses] = useState<Address[]>(address);

  const fetchAddresses = async () => {
    try {
      const documentId = session.user?.user?.documentId;
      if (!documentId) {
        console.error("No se encontró el documentId del usuario.");
        return;
      }
      const addresResult = (await getUserDirections(documentId))?.data ?? [];
      setAddresses(addresResult);
    } catch (error) {
      console.error("Error actualizando direcciones:", error);
    }
  };

  const handleSetPrincipal = (id: string) => {
    const updated = addresses.map((addr) => ({
      ...addr,
      principal: addr.documentId === id, // solo esta será principal
    }));
    setAddresses(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mis direcciones</h1>
        <AddressDialog userId={session.user?.user.id} onRefreshCard={fetchAddresses}>
          <Button className="flex items-center gap-2 cursor-pointer">
            <PlusCircle className="h-4 w-4" />
            Agregar nueva dirección
          </Button>
        </AddressDialog>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            No tienes direcciones guardadas
          </p>
          <AddressDialog userId={session.user?.user.id} onRefreshCard={fetchAddresses}>
            <Button variant="link" className="mt-2 cursor-pointer">
              Agregar una dirección
            </Button>
          </AddressDialog>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onRefreshCards={fetchAddresses}
              onAddressDefault={() => handleSetPrincipal(address.documentId!)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
