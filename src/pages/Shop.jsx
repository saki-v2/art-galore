import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { CartContext } from "../context/CartContext"
import Cart from "../components/Cart"
import useApiData from "../hooks/useApiData"

export default function Shop(){
    const navigate = useNavigate()
    const { cart, addToCart } = useContext(CartContext)

    const { data, loading, error, retry } = useApiData([
        "http://localhost:3000/artists",
        "http://localhost:3000/artworks",
    ])
    const [artists = [], artworks = []] = data || []
    const [search, setSearch] = useState("")
    const [selectedArtist, setSelectedArtist] = useState("")

    const filteredArtworks = artworks.filter((artwork) =>
        artwork.title.toLowerCase().includes(search.trim().toLowerCase()) &&
        (!selectedArtist || String(artwork.artistId) === selectedArtist)
    )

    return(
        <section className="shop" id="shop">

            <button type="button" className="back-btn" onClick={() => navigate("/")}>
                <i className="bi bi-arrow-left-short"></i> Back to Home
            </button>

            <h3>SHOP NOW / ORIGINAL PIECES ONLY</h3>
            <h2>Find the piece that suits you</h2>

            <div className="shop-search-tools">
                <input
                    type="search"
                    className="search-bar"
                    aria-label="Search artwork"
                    placeholder="Search artwork here..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <label className="shop-artist-filter">
                    <span className="visually-hidden">Filter by artist</span>
                    <svg className="artist-filter-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                        <path d="M4 6h16M7 12h10M10 18h4" />
                    </svg>
                    <select value={selectedArtist} onChange={(e) => setSelectedArtist(e.target.value)} disabled={loading || Boolean(error)}>
                        <option value="">All artists</option>
                        {artists.map((artist) => <option key={artist.id} value={String(artist.id)}>{artist.name}</option>)}
                    </select>
                    <svg className="artist-filter-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </label>
            </div>

            {loading && <p role="status">Loading artworks...</p>}
            {error && <div role="alert"><p>{error}</p><button type="button" className="back-btn" onClick={retry}>Try again</button></div>}
            {!loading && !error && artworks.length === 0 && <p>No artworks are available yet.</p>}

            <div className="shop-layout">
                <div className="product-card">
                    {filteredArtworks.map((artwork) => {
                        const artist = artists.find((a) => a.id === artwork.artistId)
                        const inCart = cart.some((item) => item.id === artwork.id)

                        return (
                            <article key={artwork.id}
                            className="card" 
                            onClick={() => navigate(`/artwork/${artwork.id}`)}
                            >
                                <img src={artwork.image} className="card-img-top" alt={artwork.title}/>
                                <div className="card-body">
                                    <h4 className="card-title">{artwork.title}</h4>
                                    <p className="card-artist">{artist?.name}</p>
                                    <p className="card-text">
                                        {artwork.currency} {artwork.price.toLocaleString()}
                                    </p>
                                    <button
                                        type="button"
                                        className="add-to-cart"
                                        disabled={!artwork.available || inCart}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            addToCart(artwork)
                                        }}
                                    >
                                        {!artwork.available ? "Sold out" : inCart ? "In cart" : "Add to cart"}
                                    </button>
                                </div>
                            </article>
                        )
                    })}
                </div>

                <Cart />
            </div>

            {filteredArtworks.length === 0 && artworks.length > 0 && (
                <div className="no-match" role="status">
                    <p>No artworks match your search{selectedArtist ? " and artist filter" : ""}.</p>
                    <button type="button" className="shop-clear-filters" onClick={() => { setSearch(""); setSelectedArtist("") }}>Clear filters</button>
                </div>
            )}
        </section>
    )
}
