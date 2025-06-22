import { type NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

import { loginUser, registerUser } from "./services/auth/auth-services";
import { User, UserToken } from "./interfaces/auth/user.interface";
import { AuthProvider } from "@/interfaces/auth/auth-providers.enum";
import { ExtendedJWT, ExtendedUser } from "./next-auth";
import {
  LoginPartialData,
  RegisterPartialData,
} from "./modules/common/components/auth/register/register-schema";
import { ECOMMERCE_PRIVADO } from "./contants/auth/ecommerce-privado.constant";

const CLIENT_ID = process.env.AUTH_WEBAPP_GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.AUTH_WEBAPP_GOOGLE_CLIENT_SECRET!;

const authConfig: NextAuthConfig = {
  pages: {
    error: "/auth/error", // Ruta personalizada
  },

  providers: [
    Google({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          // throw new Error("Correo y contraseña son requeridos");
          return null;
        }

        const loginData: RegisterPartialData = {
          email: credentials.email as string,
          password: credentials.password as string,
          authProvider: AuthProvider.Credentials,
        };

        try {
          const userToken = await loginUser(loginData);
          return userToken;
        } catch (error) {
          console.error("Error en login manual:", error);
          // throw new Error(
          //   "Credenciales inválidas. Comunícate con soporte para obtener tu acceso."
          // );
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account) return false;

      if (account.provider === AuthProvider.Google && user.email) {
        try {
          const loginData: LoginPartialData = {
            email: user.email,
            authProvider: AuthProvider.Google,
          };

          let userToken: UserToken | null;

          try {
            userToken = await loginUser(loginData);
          } catch {
            if (ECOMMERCE_PRIVADO) {
              console.error("Registro deshabilitado en modo privado");

              return false;
            }

            const registerData: RegisterPartialData = {
              email: user.email,
              authProvider: AuthProvider.Google,
              name: user.name || "",
            };

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const newUser = await registerUser(registerData);
            userToken = await loginUser(registerData);
          }

          (user as ExtendedUser).jwt = userToken?.jwt ?? "";
          (user as ExtendedUser).user = userToken?.user ?? {} as User;

          return true;
        } catch (error) {
          console.error("Error en autenticación con Google:", error);
          return false;
        }
      }

      if (account.provider === "credentials") {
        return true;
      }

      return false;
    },

    async jwt({ token, user }) {
      if (user) {
        token.user = user as ExtendedUser;
      }
      return token;
    },

    async session({ session, token }) {
      const extendedToken = token as ExtendedJWT;
      if (extendedToken.user) {
        session.user = {
          ...extendedToken.user,
          id: extendedToken.user.user.id.toString(),
          email: extendedToken.user.user.email || "",
          emailVerified: null,
        };
      }
      return session;
    },
  },
};

export default authConfig;
