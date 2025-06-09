"use client";

import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Alert from "@/components/ui/alertSwal";

import { RegisterFormData, registerFormSchema, RegisterPartialData } from "./register-schema";
import { registerUser } from "@/services/auth/auth-services";
import { AuthProvider } from "@/interfaces/auth/auth-providers.enum";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      authProvider: AuthProvider.Credentials,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const [alert, setAlert] = useState<{
    message: string;
    type: "error" | "success" | "info" | "warning";
  } | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const payload: RegisterPartialData = {
        email: data.email,
        password: data.password,
        authProvider: AuthProvider.Credentials,
        name: data.name,
        lastName: data.lastName,
      };

      const userToken = await registerUser(payload);

      setAlert({
        message: "¡Registro exitoso! Tu cuenta ha sido creada correctamente",
        type: "success",
      });

      reset();
      console.log(userToken);
    } catch (error: unknown) {
      console.error(error);
      setAlert({
        message:
          error && typeof error === "object" && "message" in error
            ? (error as { message?: string }).message || "Hubo un error al registrarte. Intenta de nuevo."
            : "Hubo un error al registrarte. Intenta de nuevo.",
        type: "error",
      });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="mx-auto max-w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Crear cuenta</CardTitle>
          <CardDescription>Ingresa tus datos para registrarte</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          {alert && (
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert(null)}
            />
          )}

          <FormProvider {...methods}>
            <Form {...methods}>
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    name="name"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Nombre(s)</FormLabel>
                          <FormControl>
                            <Input placeholder="Juan" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellidos</FormLabel>
                        <FormControl>
                          <Input placeholder="Pérez" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="********"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar contraseña</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="********"
                            {...field}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  className="w-full mt-2 cursor-pointer"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Registrarse
                </Button>
              </form>
            </Form>
          </FormProvider>

          <div className="relative">
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
            onClick={() => {
              setAlert({
                message: "Iniciando sesión con Google...",
                type: "info",
              });
              signIn("google");
            }}
            className="flex items-center justify-center gap-2"
          >
            <FcGoogle className="h-5 w-5" /> Google
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col">
          <p className="text-xs text-center text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <span
              onClick={onSwitchToLogin}
              className="underline underline-offset-4 hover:text-primary cursor-pointer"
            >
              Iniciar sesión
            </span>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterForm;
