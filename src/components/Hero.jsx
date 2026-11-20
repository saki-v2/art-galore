import { useNavigate } from "react-router-dom"
import hero1 from "../assets/hero1.webp"
import hero1Small from "../assets/hero1-small.webp"
import hero2 from "../assets/hero2.webp"
import hero2Small from "../assets/hero2-small.webp"
import hero3 from "../assets/hero3.webp"
import hero3Small from "../assets/hero3-small.webp"
import hero4 from "../assets/hero4.webp"
import hero4Small from "../assets/hero4-small.webp"
import hero5 from "../assets/hero5.webp"
import hero5Small from "../assets/hero5-small.webp"

export default function Hero() {

  const Navigate = useNavigate()

  return (
    <section className="hero" id="hero">



      <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
            <div className="carousel-item active">
                <img
                src={hero1}
                width="1600"
                height="900"
                srcSet={`${hero1Small} 800w, ${hero1} 1600w`}
                sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 992px) calc(100vw - 64px), calc(100vw - 192px)"
                fetchPriority="high"
                className="d-block w-100"
                alt="Framed coastal photograph in a sunlit living room"
                />
            </div>

            <div className="carousel-item">
                <img
                src={hero2}
                width="1600"
                height="900"
                srcSet={`${hero2Small} 800w, ${hero2} 1600w`}
                sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 992px) calc(100vw - 64px), calc(100vw - 192px)"
                fetchPriority="low"
                className="d-block w-100"
                alt="Pink abstract painting above a console"
                />
            </div>

            <div className="carousel-item">
                <img
                src={hero3}
                width="1600"
                height="900"
                srcSet={`${hero3Small} 800w, ${hero3} 1600w`}
                sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 992px) calc(100vw - 64px), calc(100vw - 192px)"
                fetchPriority="low"
                className="d-block w-100"
                alt="Green and cream abstract painting in a bright interior"
                />
            </div>

            <div className="carousel-item">
                <img
                src={hero4}
                width="1600"
                height="900"
                srcSet={`${hero4Small} 800w, ${hero4} 1600w`}
                sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 992px) calc(100vw - 64px), calc(100vw - 192px)"
                fetchPriority="low"
                className="d-block w-100"
                alt="Layered textile wall art in warm earthy tones"
                />
            </div>

            <div className="carousel-item">
                <img
                src={hero5}
                width="1600"
                height="900"
                srcSet={`${hero5Small} 800w, ${hero5} 1600w`}
                sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 992px) calc(100vw - 64px), calc(100vw - 192px)"
                fetchPriority="low"
                className="d-block w-100"
                alt="Neutral sculptural wall art beside an armchair"
                />
            </div>
        </div>

        <div className="hero-text">
            <h1>Welcome to Art Galore</h1>
            <p>Discover, collect and enjoy pieces made right here in Nairobi</p>
            <button type="button" 
            className="shop-now" 
            onClick={() => Navigate("/shop")}>Shop now</button>
        </div>


        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </section>
  )
}