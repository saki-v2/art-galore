import useApiData from "../hooks/useApiData";

export default function ArtistCard() {

    const { data, loading, error, retry } = useApiData("http://localhost:3000/artists")
    const artists = data || []

    return (
        <section className="artist" id="artist">
            <h3>THE TEAM BEHIND THE MAGIC</h3>
            <h2>MEET YOUR NEXT FAVOURITE ARTIST</h2>
            {loading && <p role="status">Loading artists...</p>}
            {error && <div role="alert"><p>{error}</p><button type="button" className="back-btn" onClick={retry}>Try again</button></div>}
            {!loading && !error && artists.length === 0 && <p>No artists are available yet.</p>}
            <div className="artist-card" id="artist-card">
                {artists.map((artist) => (
                    <div key={artist.id} className="card card-row" style={{ maxWidth: "540px" }}>
                        <img src={artist.profileImage} className="card-img-start" alt={artist.name} />

                            <div className="card-body">
                                <h4 className="card-title">{artist.name}</h4>

                                <p className="card-text">{artist.bio}</p>

                                <p className="card-text">{artist.location}</p>
                                
                                <p className="card-text">{artist.specialty}</p>

                            </div>
                    </div>
                ))}
            </div>
        </section>
    )
}



