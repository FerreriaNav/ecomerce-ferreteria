"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import LoginForm from "./login/LoginForm"
import RegisterForm from "./register/registerForm"

export const ModalAuth = () => {
  const [showRegister, setShowRegister] = useState(false)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Log In</Button>
      </DialogTrigger>

      <DialogContent className="p-0 bg-transparent border-none max-w-fit shadow-none w-[350px]">
        {showRegister ? (
          <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
        )}
        <DialogTitle />
      </DialogContent>
    </Dialog>
  )
}
