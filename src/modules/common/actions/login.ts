"use server"

import { signIn } from "next-auth/react";


export async function Login(){
    await signIn("google");
    
}