import { useContext, useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { HashLink } from "react-router-hash-link/dist/react-router-hash-link.cjs.production"
import { CartContext } from "../context/CartContext"
import { clearDemoReference, getDemoReference, placeDemoOrder } from "../lib/demoCheckout"

const formatMoney = (amount) => `KES ${amount.toLocaleString()}`

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useContext(CartContext)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [order, setOrder] = useState(null)
    const reference = useRef(null)
    const submittingRef = useRef(false)
    const confirmationHeading = useRef(null)

    useEffect(() => { window.scrollTo(0, 0) }, [])
    useEffect(() => {
        if (order) {
            window.scrollTo(0, 0)
            confirmationHeading.current?.focus()
        }
    }, [order])

    async function handleSubmit(event) {
        event.preventDefault()
        if (submittingRef.current) return
        const details = Object.fromEntries(new FormData(event.currentTarget))
        const selectedItems = [...cart]
        submittingRef.current = true
        setSubmitting(true)
        setError("")
        try {
            reference.current = getDemoReference(selectedItems, reference.current)
            const saved = await placeDemoOrder(selectedItems, details, reference.current.id)
            clearCart(saved.items.map((item) => item.artworkId))
            clearDemoReference(saved.id)
            setOrder(saved)
        } catch (failure) {
            setError(failure.message)
        } finally {
            setSubmitting(false)
            submittingRef.current = false
        }
    }

    if (order) return (
        <section className="checkout-page checkout-confirmation">
            <span className="checkout-success-icon" aria-hidden="true"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m5 12 4 4L19 6" /></svg></span>
            <p className="checkout-eyebrow">DEMO ORDER SAVED</p>
            <h1 ref={confirmationHeading} tabIndex={-1}>Thank you, {order.customerName}!</h1>
            <p>Your demo order has been saved successfully.</p>
            <div className="checkout-reference"><span>Order reference</span><strong>{order.id}</strong></div>
            <ul className="checkout-confirmation-items">{order.items.map((item) => <li key={item.artworkId}><span>{item.title}</span><span>{formatMoney(item.price)}</span></li>)}</ul>
            <div className="checkout-total"><span>Order total</span><strong>{formatMoney(order.totalAmount)}</strong></div>
            <p className="checkout-demo-notice"><strong>This is a demonstration.</strong> No payment was taken, no email was sent, and no delivery or pickup is arranged. The artworks remain available in this demo.</p>
            <Link className="checkout-button" to="/shop">Continue shopping <span aria-hidden="true">→</span></Link>
        </section>
    )

    if (!cart.length) return (
        <section className="checkout-page checkout-empty"><p className="checkout-eyebrow">YOUR COLLECTION</p><h1>Your cart is empty</h1><p>Find an artwork you love, then return here to try the demo checkout.</p><Link className="checkout-button" to="/shop">Explore the shop <span aria-hidden="true">→</span></Link></section>
    )

    return (
        <section className="checkout-page">
            <HashLink className="checkout-back" to="/shop#cart">← Back to your cart</HashLink>
            <header className="checkout-heading"><p className="checkout-eyebrow">ONE LAST STEP</p><h1>Checkout</h1><p>Review your selection and try placing a demo order.</p></header>
            <div className="checkout-demo-notice"><strong>Demo checkout · no payment required</strong><p>Use sample contact details. No real purchase, delivery, or pickup will take place.</p></div>
            <div className="checkout-layout">
                <form className="checkout-form" onSubmit={handleSubmit}>
                    <h2>Your details</h2><p>Try: Alex Demo, alex@example.com, 0700000000.</p>
                    <fieldset disabled={submitting}>
                        <legend className="visually-hidden">Sample customer details</legend>
                        <label htmlFor="checkout-name">Full name</label><input className="form-control" id="checkout-name" name="customerName" placeholder="Alex Demo" autoComplete="off" required maxLength={80} />
                        <label htmlFor="checkout-email">Email address</label><input className="form-control" id="checkout-email" name="customerEmail" type="email" placeholder="alex@example.com" autoComplete="off" required maxLength={160} />
                        <label htmlFor="checkout-phone">Phone number</label><input className="form-control" id="checkout-phone" name="customerPhone" type="tel" placeholder="0700000000" autoComplete="off" required minLength={7} maxLength={25} />
                        <label className="checkout-acknowledgement"><input type="checkbox" name="demoAcknowledged" required /><span>I understand this is a demo order. No payment or delivery will take place.</span></label>
                    </fieldset>
                    {error && <div className="checkout-error" role="alert"><p>{error}</p><HashLink to="/shop#cart">Review your cart</HashLink></div>}
                    <button className="checkout-button" type="submit" disabled={submitting}>{submitting ? "Saving your demo order..." : "Place demo order"}<span aria-hidden="true">→</span></button>
                    <p className="checkout-small-note" role="status">{submitting ? "Checking availability and saving. Please wait." : "Your cart will clear only after the order is saved."}</p>
                </form>
                <aside className="checkout-summary" aria-labelledby="checkout-summary-title">
                    <h2 id="checkout-summary-title">Order summary</h2><p>{cart.length} {cart.length === 1 ? "artwork" : "artworks"} in your selection</p>
                    <ul>{cart.map((item) => <li key={item.id}><img src={item.image} alt="" width="64" height="72" /><div><Link to={`/artwork/${item.id}`}>{item.title}</Link><span>Quantity: 1</span><strong>{formatMoney(item.price)}</strong></div></li>)}</ul>
                    <div className="checkout-total"><span>Order total</span><strong>{formatMoney(cartTotal)}</strong></div>
                    <p className="checkout-small-note">No payment is collected. Prices and availability are rechecked before saving this demo order.</p>
                </aside>
            </div>
        </section>
    )
}
