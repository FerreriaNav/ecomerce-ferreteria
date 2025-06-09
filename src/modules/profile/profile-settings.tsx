"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";
import type { User } from "@/interfaces/auth/user.interface";
import * as React from "react";
import { PasswordChangeDialog } from "@/modules/common/components/change-password/change-password";

interface ProfileSettingsProps {
  user: User | null;
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de la cuenta</CardTitle>
        <CardDescription>
          Actualiza tu información personal y preferencias
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PersonalInfoForm user={user} />
        <Separator />
        <PasswordChangeForm />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Guardar cambios
        </Button>
      </CardFooter>
    </Card>
  );
}

function PersonalInfoForm({ user }: { user: User | null }) {
  const fields = [
    {
      id: "nombre",
      label: "Nombre",
      defaultValue: user?.name || "",
      type: "text",
    },
    {
      id: "apellido",
      label: "Apellido",
      defaultValue: user?.lastName || "",
      type: "text",
    },
    {
      id: "email",
      label: "Correo electrónico",
      defaultValue: user?.email || "",
      type: "email",
    },
    {
      id: "telefono",
      label: "Teléfono",
      defaultValue: user?.telefono || "",
      type: "text",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id}>{field.label}</Label>
          <Input
            id={field.id}
            type={field.type}
            defaultValue={field.defaultValue}
          />
        </div>
      ))}
    </div>
  );
}

function PasswordChangeForm() {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Contraseña</h3>
          <p className="text-sm text-muted-foreground">
            Actualiza tu contraseña para mantener tu cuenta segura
          </p>
        </div>
        <Button onClick={() => setOpen(true)} variant="outline">
          Cambiar contraseña
        </Button>
      </div>

      <PasswordChangeDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
