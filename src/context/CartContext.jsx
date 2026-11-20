import { createContext, useEffect, useState } from "react"

// Keep the existing context import compatible with all current cosumers.
// eslint-disable-next-line react-refresh/only-export-components
export const CartContext = createContext()

const STORAGE_KEY = "art-galore-cart"

function isValidArtwork(artwork) {
    return artwork &&
        ((typeof artwork.id === "number" && Number.isFinite(artwork.id)) ||
            (typeof artwork.id === "string" && artwork.id.trim() !== "")) &&
        typeof artwork.title === "string" && artwork.title.trim() !== "" &&
        typeof artwork.image === "string" &&
        typeof artwork.currency === "string" && artwork.currency.trim() !== "" &&
        typeof artwork.price === "number" &&
        Number.isFinite(artwork.price) && artwork.price >= 0 &&
        artwork.available !== false
}

function loadCart() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
        if (!Array.isArray(saved)) return []
        const seen = new Set()
        return saved.filter((artwork) => {
            if (!isValidArtwork(artwork)) return false
            const id = String(artwork.id)
            if (seen.has(id)) return false
            seen.add(id)
            return true
        })
    } catch {
        return []
    }
}

export function CartProvider({ children }) {
    const [cart, setCart] = useState(loadCart)

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
        } catch {
            // The cart still works when browser storage is full or unavailable.
        }
    }, [cart])

    const addToCart = (artwork) => {
        if (!isValidArtwork(artwork)) return
        setCart((items) => items.some((item) => String(item.id) === String(artwork.id))
            ? items
            : [...items, artwork]
        )
    }

    const removeFromCart = (id) => {
        setCart((items) => items.filter((item) => String(item.id) !== String(id)))
    }

    const clearCart = (purchasedIds) => {
        setCart((items) => purchasedIds
            ? items.filter((item) => !purchasedIds.some((id) => String(id) === String(item.id)))
            : []
        )
    }

    const cartTotal = cart.reduce((total, item) => total + item.price, 0)

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, clearCart, cartTotal }}
        >
            {children}
        </CartContext.Provider>
    )
}
