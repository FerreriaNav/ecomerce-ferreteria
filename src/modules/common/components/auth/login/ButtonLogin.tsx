"use client"

import { Session } from "next-auth"
import { ModalAuth } from '../modalAuth';

interface ButtonLoginProps {
  session: Session | null
}

export const ButtonLogin = ({ session }: ButtonLoginProps) => {
  if (!session) {
    return <ModalAuth />
  }

  return null
}
