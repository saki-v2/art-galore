const API_URL = "http://localhost:3000"
const REFERENCE_KEY = "art-galore-demo-checkout"

export function getDemoReference(cart, previous) {
    const fingerprint = JSON.stringify(cart.map(({ id, price }) => [String(id), price]).sort((a, b) => a[0].localeCompare(b[0])))
    if (previous?.fingerprint === fingerprint) return previous
    try {
        const saved = JSON.parse(sessionStorage.getItem(REFERENCE_KEY))
        if (saved?.fingerprint === fingerprint && /^AG-[\da-f-]{36}$/.test(saved.id)) return saved
    } catch { /* Checkout also works without browser storage. */ }
    const reference = { id: `AG-${crypto.randomUUID()}`, fingerprint }
    try { sessionStorage.setItem(REFERENCE_KEY, JSON.stringify(reference)) } catch { /* Keep the in-memory reference. */ }
    return reference
}

export function clearDemoReference(id) {
    try {
        if (JSON.parse(sessionStorage.getItem(REFERENCE_KEY))?.id === id) sessionStorage.removeItem(REFERENCE_KEY)
    } catch { /* Browser storage may be unavailable. */ }
}

async function request(path, options = {}) {
    try {
        return await fetch(`${API_URL}${path}`, { ...options, signal: AbortSignal.timeout(15000) })
    } catch (error) {
        throw new Error("Could not reach the data server. Make sure JSON Server is running, then try again. Your cart has been kept.", { cause: error })
    }
}

function validOrder(order, id) {
    return order?.id === id && Array.isArray(order.items) && order.items.length > 0 &&
        Number.isFinite(order.totalAmount) && order.status === "demo-confirmed"
}

export async function placeDemoOrder(cart, details, reference) {
    if (!cart.length) throw new Error("Your cart is empty. Choose an artwork before checking out.")
    const customerName = String(details.customerName || "").trim()
    const customerEmail = String(details.customerEmail || "").trim()
    const customerPhone = String(details.customerPhone || "").trim()
    if (!customerName || customerName.length > 80) throw new Error("Please enter a name of up to 80 characters.")
    if (customerEmail.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) throw new Error("Please enter a valid sample email address.")
    if (!/^[+\d\s()-]{7,25}$/.test(customerPhone) || customerPhone.replace(/\D/g, "").length < 7) throw new Error("Please enter a valid sample phone number.")
    if (details.demoAcknowledged !== "on") throw new Error("Please acknowledge that this is a demo order.")

    // Reconcile an earlier save whose response may have been lost before retrying.
    const existingResponse = await request(`/orders/${encodeURIComponent(reference)}`)
    if (existingResponse.ok) {
        const existing = await existingResponse.json().catch(() => null)
        if (!validOrder(existing, reference)) throw new Error("Could not confirm your previous order. Your cart has been kept. Please try again.")
        return existing
    }
    if (existingResponse.status !== 404) throw new Error("Could not check your order reference. Please try again. Your cart has been kept.")

    const artworkResponse = await request("/artworks")
    if (!artworkResponse.ok) throw new Error("Could not check the artworks. Please try again. Your cart has been kept.")
    const artworks = await artworkResponse.json().catch(() => null)
    if (!Array.isArray(artworks)) throw new Error("The data server returned unexpected artwork data. Please try again.")
    const items = cart.map((item) => {
        const current = artworks.find((artwork) => String(artwork.id) === String(item.id))
        if (!current?.available) throw new Error(`“${item.title}” is no longer available. Return to your cart, remove it, and try again.`)
        if (!Number.isFinite(current.price) || current.currency !== "KES") throw new Error("An artwork has invalid pricing. Please return to the shop and review your selection.")
        if (current.price !== item.price) throw new Error(`The price of “${item.title}” has changed. Remove it from your cart and add it again from the shop to review the new price.`)
        return { artworkId: current.id, title: current.title, image: current.image, price: current.price, currency: current.currency, quantity: 1 }
    })
    const order = {
        id: reference,
        customerName, customerEmail, customerPhone,
        items,
        totalAmount: items.reduce((total, item) => total + item.price, 0),
        currency: "KES",
        status: "demo-confirmed",
        paymentStatus: "not-required",
        fulfilment: "none-demo",
        orderDate: new Date().toISOString(),
    }
    const response = await request("/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
    })
    if (!response.ok) throw new Error("Could not save your demo order. Your cart and details have been kept. Please try again.")
    const saved = await response.json().catch(() => null)
    if (!validOrder(saved, reference)) throw new Error("We could not confirm the saved order. Please try again using this page; your reference will be reused.")
    return saved
}
