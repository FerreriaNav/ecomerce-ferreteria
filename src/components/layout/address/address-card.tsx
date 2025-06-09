import { Home, MapPin, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Address } from "@/interfaces/directions/directions.interface";
import { AddressDialog } from "./form/address-dialog";
import { deleteDirection, setPrincipal } from "@/services/directions/directions-services";
import { useState } from "react";
import { showToastAlert } from "@/components/ui/altertas/toast";
import Swal from "sweetalert2";
import LoaderInline from "@/components/ui/spinnerLoading";
import { formatAddress } from "@/lib/formatAddress";

interface AddressCardProps {
  address: Address;
  onRefreshCards?: () => void;
  onAddressDefault?: () => void;
}

export function AddressCard({ address, onRefreshCards, onAddressDefault }: AddressCardProps) {
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleSetPrincipal = async () => {
    if (!address.id || !address.usuario?.id) return;
    try {
      setLoading(true);
      await setPrincipal(address.documentId!, address.usuario.documentId);
      showToastAlert({ title: "Dirección Principal", text: "Dirección establecida como principal correctamente.", icon: "success", position: "bottom-end", toast: true });
      onAddressDefault?.();
    } catch (err) {
      console.error("Error al establecer como principal:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!address.documentId) return;

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la dirección. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    setLoadingDelete(true);

    try {
      await deleteDirection(address.documentId);
      showToastAlert({ title: "Dirección eliminada", text: "La dirección se ha eliminado correctamente.", icon: "success", position: "bottom-end", toast: true });
      onRefreshCards?.();
    } catch (error) {
      console.error("Error al eliminar dirección:", error);
      showToastAlert({ title: "Error", text: "No se pudo eliminar la dirección.", icon: "error", position: "bottom-end", toast: true });
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <Card className="h-full w-full max-w-full sm:min-w-[300px] sm:max-w-md">
      <CardHeader className="flex items-start justify-between space-y-0 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Home className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-medium truncate">{address.nombreRecibe || "Dirección"}</h3>
          {address.principal && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Principal</span>}
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div className="text-sm space-y-1 break-words">
            <p>{formatAddress(address)}</p>
            <p>{address.ciudad}, {address.estado}, <span className="text-xs italic uppercase">cp</span> {address.codigoPostal}</p>
            {address.referencia && (
              <p className="mt-1 italic whitespace-pre-wrap text-muted-foreground line-clamp-3">
                {address.referencia}
              </p>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <div className="flex flex-wrap gap-2">
          {!address.principal && (
            <Button className="cursor-pointer" onClick={handleSetPrincipal} variant="outline" size="sm">
              {loading ? <LoaderInline text="Estableciendo..." /> : "Establecer como principal"}
            </Button>
          )}
          <AddressDialog address={address} userId={address.usuario?.documentId} onRefreshCard={onRefreshCards}>
            <Button className="cursor-pointer" variant="outline" size="sm"><Edit className="mr-2 h-3.5 w-3.5r" />Editar</Button>
          </AddressDialog>
          <Button className="cursor-pointer" onClick={handleDelete} variant="outline" size="sm" disabled={loadingDelete}>
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            {loadingDelete ? <LoaderInline text="Eliminando..." /> : "Eliminar"}
          </Button>
        </div>
      </CardFooter>
    </Card>

  );
}
