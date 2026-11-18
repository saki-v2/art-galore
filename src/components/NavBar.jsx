export default function NavBar (){


    return(
        <header className="Nav-bar">
            <a className="logo" href="#hero">Art Galore</a>

            <nav>
                <ul>
                    <li>
                        <a href="#">Our Story</a>
                    </li>
                    <li>
                        <a href="#">The Artists</a>
                    </li>
                    <li>
                        <a href="#">Shop</a>
                    </li>
                    <li>
                        <a href="#">Reviews</a>
                    </li>
                </ul>
            </nav>

            <button type="button" className="cart-btn">
                <i className="bi bi-cart" aria-hidden="true"></i> Cart
            </button>
            
        </header>
    )
}