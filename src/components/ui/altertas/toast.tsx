"use client"

import Swal, { SweetAlertOptions } from "sweetalert2"

interface ToastAlertProps {
  title: string
  text?: string
  icon?: "success" | "error" | "warning" | "info" | "question"
  timer?: number
  position?:
    | "top"
    | "top-start"
    | "top-end"
    | "center"
    | "center-start"
    | "center-end"
    | "bottom"
    | "bottom-start"
    | "bottom-end"
  toast?: boolean
  showCancelButton?: boolean
  confirmButtonText?: string
  cancelButtonText?: string
  confirmButtonColor?: string
  cancelButtonColor?: string
  callback?: (result: unknown) => void
}

export function showToastAlert({
  title,
  text = "",
  icon,
  timer = 3000,
  position,
  toast,
  showCancelButton = false,
  confirmButtonText = "Confirmar",
  cancelButtonText = "Cancelar",
  confirmButtonColor = "#3085d6",
  cancelButtonColor = "#d33",
  callback,
}: ToastAlertProps) {
  const config: SweetAlertOptions = {
    title,
    text,
    icon,
    position,
    toast: toast,
  }


  // Si es una confirmación, agregar botones
  if (showCancelButton) {
    config.showCancelButton = true
    config.confirmButtonText = confirmButtonText
    config.cancelButtonText = cancelButtonText
    config.confirmButtonColor = confirmButtonColor
    config.cancelButtonColor = cancelButtonColor
    config.showConfirmButton = true
  } else {
    // Si es solo notificación, usar timer y ocultar botón
    config.timer = timer
    config.showConfirmButton = false
  }

  Swal.fire(config).then((result) => {
    if (callback) {
      callback(result)
    }
  })
}
