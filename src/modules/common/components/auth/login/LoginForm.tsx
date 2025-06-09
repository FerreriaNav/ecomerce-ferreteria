"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { ECOMMERCE_PRIVADO } from "@/contants/auth/ecommerce-privado.constant";

export default function LoginForm({
  onSwitchToRegister,
}: {
  onSwitchToRegister: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMsg("");
    setLoading(true);

    if (!email || !password) {
      setErrorMsg("Por favor, completa todos los campos.");
      setLoading(false);
      return;
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      if (res.error.toLowerCase().includes("credenciales")) {
        setErrorMsg("Correo o contraseña incorrectos.");
      } else {
        setErrorMsg("Error al iniciar sesión. Intenta de nuevo.");
      }
      setLoading(false);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <Card className="mx-auto max-w-[400px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
        <CardDescription>
          Ingresa tus credenciales para acceder a tu cuenta
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4">
        {errorMsg && (
          <div className="rounded bg-red-100 p-2 text-sm text-red-600">
            {errorMsg}
          </div>
        )}

        <div className="grid gap-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button
          className="w-full"
          type="button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
              Iniciando...
            </div>
          ) : (
            "Iniciar sesión"
          )}
        </Button>

        <div className="relative mt-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              O continúa con
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          onClick={() => signIn("google", { redirect: false })}
        >
          <FcGoogle className="mr-2" /> Google
        </Button>
      </CardContent>

      <CardFooter className="flex flex-col">
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </p>

          {ECOMMERCE_PRIVADO ? (
            <div className="mt-2 text-sm">
              ¿No tienes una cuenta?{" "}
              <span className="cursor-pointer font-medium text-primary hover:underline">
                Comunícate con soporte
              </span>
            </div>
          ) : (
            <p className="mt-2 text-sm">
              ¿No tienes una cuenta?{" "}
              <span
                onClick={onSwitchToRegister}
                className="cursor-pointer font-medium text-primary hover:underline"
              >
                Regístrate aquí
              </span>
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
