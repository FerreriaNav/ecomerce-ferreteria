"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Address } from "@/interfaces/directions/directions.interface";
import { formatAddress } from "@/lib/formatAddress";
import { FaMapMarkerAlt, FaUser, FaPhone, FaPlus } from "react-icons/fa";
import { MdLocationCity } from "react-icons/md";
import { HiHome } from "react-icons/hi";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import clsx from "clsx";
import { AddressDialog } from "../../../components/layout/address/form/address-dialog";
import { Button } from "@/components/ui/button";
import { usePedidoStore } from "@/store/pedido.store";

interface AddressStepProps {
  addresses: Address[];
  userId: number;
}

export function AddressStep({ addresses, userId }: AddressStepProps) {
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [addressList, setAddressList] = useState<Address[]>(addresses);
  const [isLocal, setIsLocal] = useState(false);

  const { pedido, setInformacionEnvio } = usePedidoStore();

  useEffect(() => {
    setAddressList(addresses);
    const primary = addresses.find((addr) => addr.principal);
    if (primary && primary.id !== undefined)
      setSelectedAddress(primary.id.toString());
    else if (addresses.length > 0 && addresses[0]?.id !== undefined)
      setSelectedAddress(addresses[0]?.id?.toString());
  }, [addresses]);

  useEffect(() => {
    if (isLocal == true)
      setInformacionEnvio({
        ...pedido.informacionEnvio,
        esLocal: isLocal,

        direccion: null,
      });
    else {
      setInformacionEnvio({
        ...pedido.informacionEnvio,
        esLocal: isLocal,
        direccion: selectedAddress !== undefined ? +selectedAddress : null,
      });
    }
    console.log(pedido.informacionEnvio);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocal, selectedAddress]);

  const selectedAddressData = selectedAddress
    ? addressList.find(
        (a) => a.id !== undefined && a.id.toString() === selectedAddress
      )
    : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <HiHome className="mr-2 text-primary" />
          Dirección de envío
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* envio a domicilio */}
        <ToggleGroup
          type="single"
          className="border"
          value={pedido.informacionEnvio?.esLocal ? "local" : "envio"}
          onValueChange={(value) => {
            setIsLocal(value === "local");
          }}
        >
          {/* entrega en tienda */}
          <ToggleGroup
            type="single"
            className="border"
            value={!pedido.informacionEnvio?.esLocal ? "local" : "envio"}
            onValueChange={(value) => {
              setIsLocal(value === "envio");
            }}
          />
          <ToggleGroupItem value="envio" aria-label="Envío a Domicilio">
            Envío a Domicilio
          </ToggleGroupItem>
          <ToggleGroupItem value="local" aria-label="Recoger en Tienda">
            Recoger en Tienda
          </ToggleGroupItem>
        </ToggleGroup>

        {/* Sección de dirección, con estado visual de deshabilitado si es "local" */}
        <div
          className={clsx("transition-opacity space-y-4", {
            "opacity-50 pointer-events-none select-none": isLocal,
          })}
        >
          <Label>Entrega en domicilio</Label>

          <Select
            value={selectedAddress}
            onValueChange={(value) => setSelectedAddress(value)}
            disabled={isLocal}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona una dirección" />
            </SelectTrigger>
            <SelectContent>
              {addressList
                .filter((addr) => addr.id !== undefined)
                .map((addr) => (
                  <SelectItem key={addr.id} value={addr.id!.toString()}>
                    {formatAddress(addr)}
                    {addr.principal && " (Principal)"}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {selectedAddressData && (
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FaUser className="mt-1 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Destinatario</p>
                      <p className="text-sm">
                        {selectedAddressData.nombreRecibe || "No especificado"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaPhone className="mt-1 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Teléfono</p>
                      <p className="text-sm">
                        {selectedAddressData.telefono || "No especificado"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="mt-1 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Dirección</p>
                      <p className="text-sm">
                        {selectedAddressData.calle}{" "}
                        {selectedAddressData.numeroExterior}
                        {selectedAddressData.numeroInterior &&
                          `, Int. ${selectedAddressData.numeroInterior}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MdLocationCity className="mt-1 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        Ciudad y Código Postal
                      </p>
                      <p className="text-sm">
                        {selectedAddressData.ciudad},{" "}
                        {selectedAddressData.estado},{" "}
                        <span className="italic uppercase text-xs">cp</span>{" "}
                        {selectedAddressData.codigoPostal}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedAddressData.referencia && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm font-medium">Referencias</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedAddressData.referencia || "Sin Referencias"}
                  </p>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-center">
            <AddressDialog userId={userId}>
              <Button variant="outline" className="mt-2 cursor-pointer">
                <FaPlus className="mr-2 h-4 w-4" />
                Agregar nueva dirección
              </Button>
            </AddressDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
