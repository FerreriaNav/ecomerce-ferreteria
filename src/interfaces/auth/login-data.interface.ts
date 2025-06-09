import { AuthProvider } from "./auth-providers.enum";

  
 export  interface LoginData{
    email?: string;
    password?: string;
    authProvider: AuthProvider;
  }