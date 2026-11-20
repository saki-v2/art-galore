import { useContext, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { HashLink } from "react-router-hash-link/dist/react-router-hash-link.cjs.production"
import { CartContext } from "../context/CartContext"
import useApiData from "../hooks/useApiData"

export default function ArtworkDetail() {
    const { id } = useParams()
    const { cart, addToCart } = useContext(CartContext)
    const { data, loading, error, retry } = useApiData([
        "http://localhost:3000/artworks",
        "http://localhost:3000/artists",
    ])
    const [artworks = [], artists = []] = data || []
    const artwork = artworks.find((item) => String(item.id) === id)
    const artist = artists.find((item) => item.id === artwork?.artistId)
    const inCart = cart.some((item) => String(item.id) === id)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [id])

    return (
        <section className="artwork-details" aria-label="Artwork details">
            <Link className="details-back" to="/shop">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                    <path d="M20 12H4m6-6-6 6 6 6" />
                </svg>
                Back to Shop
            </Link>

            {loading ? (
                <div className="details-state" role="status"><h2>Opening this artwork...</h2><p>Just a moment while we bring you the details.</p></div>
            ) : error ? (
                <div className="details-state" role="alert"><h2>We couldn’t load this piece.</h2><p>{error}</p><button type="button" className="details-action" onClick={retry}>Try again</button></div>
            ) : !artwork ? (
                <div className="details-state"><h2>Artwork not found</h2><p>This piece isn’t in our collection. Head back to the shop to explore more.</p><Link className="details-action" to="/shop">Explore the shop</Link></div>
            ) : (
                <div className="details-layout">
                    <figure className="details-artwork">
                        <div className="details-image-frame">
                            <img src={artwork.image} alt={artwork.title} className="details-img" />
                        </div>
                        <figcaption>{artwork.title}{artist && ` — ${artist.name}`}</figcaption>
                    </figure>

                    <div className="details-info">
                        <div className="details-topline">
                            <span className="details-eyebrow">ORIGINAL ARTWORK</span>
                            <span className={`details-availability${artwork.available ? "" : " is-sold"}`}>
                                <span aria-hidden="true" />{artwork.available ? "Available" : "Sold out"}
                            </span>
                        </div>
                        <h1>{artwork.title}</h1>
                        <p className="details-artist">By <strong>{artist?.name || "Art Galore studio"}</strong>{artist?.location && <span>{artist.location}</span>}</p>
                        <p className="details-price">{artwork.currency} {artwork.price?.toLocaleString()}</p>

                        <div className="details-description">
                            <h2>About this piece</h2>
                            <p>{artwork.description}</p>
                        </div>
                        <dl className="details-specifications">
                            {artwork.dimensions && <div><dt>Dimensions</dt><dd>{artwork.dimensions}</dd></div>}
                            {artwork.category && <div><dt>Style</dt><dd>{artwork.category}</dd></div>}
                            {artist?.specialty && <div><dt>Artist specialty</dt><dd>{artist.specialty}</dd></div>}
                        </dl>

                        <div className="details-purchase">
                            <button type="button" className="details-action" disabled={!artwork.available || inCart} onClick={() => addToCart(artwork)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M5 7h14l1 14H4L5 7Z" /><path d="M8 7V5a4 4 0 0 1 8 0v2" />
                                </svg>
                                {!artwork.available ? "Sold out" : inCart ? "Added to your cart" : "Add to cart"}
                            </button>
                            {inCart && <p className="details-cart-status" role="status">This piece is in your cart. <HashLink to="/shop#cart">View your cart →</HashLink></p>}
                            {!artwork.available && <p className="details-purchase-note">This piece is currently unavailable. There are more originals to discover in the shop.</p>}
                            <Link className="details-continue" to="/shop">Keep exploring the collection <span aria-hidden="true">→</span></Link>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
