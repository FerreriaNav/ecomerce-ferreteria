import { create } from "zustand"
import type { Products } from "@/interfaces/products/products.interface"
import { showToastAlert } from "@/components/ui/altertas/toast"

// Función para guardar en localStorage
const saveFavoritesToLocalStorage = (favorites: Products[]) => {
  localStorage.setItem("favorites", JSON.stringify(favorites))
}

interface FavoritesStore {
  favorites: Products[]

  loadFavorites: () => void
  addFavorite: (product: Products) => void
  removeFavorite: (id: number) => void
  confirmRemoveFavorite: (id: number, nombre: string) => void
  isFavorite: (id: number | null) => boolean
  toggleFavorite: (product: Products) => void
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],

  loadFavorites: () => {
    const saved = localStorage.getItem("favorites")
    if (saved) {
      const parsed: Products[] = JSON.parse(saved)
      set({ favorites: parsed })
    }
  },

  addFavorite: (product) => {
    set((state) => {
      const updatedFavorites = [...state.favorites, product]
      saveFavoritesToLocalStorage(updatedFavorites)

      showToastAlert({
        title: "Favorito añadido",
        text: `${product.nombre} se agregó a tus favoritos.`,
        icon: "success",
        position: "bottom-end",
        toast: true,
      })

      return { favorites: updatedFavorites }
    })
  },

  removeFavorite: (id) => {
    set((state) => {
      const updatedFavorites = state.favorites.filter((p) => p.id !== id)
      saveFavoritesToLocalStorage(updatedFavorites)

      showToastAlert({
        title: "Favorito eliminado",
        text: "El producto ha sido eliminado de tus favoritos",
        icon: "warning",
        position: "bottom-end",
        toast: true,
      })

      return { favorites: updatedFavorites }
    })
  },

  confirmRemoveFavorite: (id, nombre) => {
    const { removeFavorite } = get()

    showToastAlert({
      title: "¿Eliminar de favoritos?",
      text: `¿Estás seguro de eliminar "${nombre}" de tus favoritos?`,
      icon: "question",
      position: "center",
      toast: false,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      
      callback: (result) => {
        const res = result as { isConfirmed: boolean }
        if (res.isConfirmed) {
          removeFavorite(id)
        }
      },
    })
  },

  isFavorite: (id) => {
    return get().favorites.some((product) => product.id === id)
  },

  toggleFavorite: (product) => {
    const { isFavorite, addFavorite, removeFavorite } = get()
    if (isFavorite(product.id)) {
      removeFavorite(product.id)
    } else {
      addFavorite(product)
    }
  },
}))
