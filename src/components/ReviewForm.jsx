import { useState } from "react"
import useApiData from "../hooks/useApiData"

const API_URL = "http://localhost:3000/reviews"

export default function ReviewForm({ artworkId }) {
    const { data, loading, error, retry, setData } = useApiData(API_URL)
    const reviews = (data || []).filter((review) =>
        !artworkId || String(review.artworkId) === String(artworkId)
    )
    const [name, setName] = useState("")
    const [comment, setComment] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [status, setStatus] = useState("")
    const [statusIsError, setStatusIsError] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name.trim() || !comment.trim()) {
            setStatusIsError(true)
            setStatus("Please enter both your name and a comment.")
            return
        }

        setSubmitting(true)
        setStatusIsError(false)
        setStatus("")

        const newReview = {
            customerName: name.trim(),
            artworkId: artworkId ? Number(artworkId) : null,
            comment: comment.trim(),
            reviewDate: new Date().toISOString().split("T")[0],
        }

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newReview),
                signal: AbortSignal.timeout(15000),
            })

            if (!res.ok) throw new Error(`Server responded with ${res.status}`)

            const saved = await res.json()

            setData((previous) => [...(previous || []), saved])
            setName("")
            setComment("")
            setStatus("Thank you! Your review has been submitted.")
        } catch (error) {
            setStatusIsError(true)
            console.error("Failed to save review:", error)
            setStatus("Could not save your review. Is the server running?")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="review-form-section" id={artworkId ? "artwork-reviews" : "reviews"} aria-labelledby="reviews-heading">
            <div className="reviews-heading">
                <p className="reviews-eyebrow">YOUR EXPERIENCE, IN YOUR WORDS</p>
                <h2 id="reviews-heading">Customer Reviews</h2>
                <p>A little feedback goes a long way. Share your thoughts with us.</p>
            </div>

            <form onSubmit={handleSubmit} className="review-form">
                <h3>Leave a review</h3>
                <div className="review-fields">
                    <div className="review-field">
                        <label htmlFor="reviewName" className="form-label">Name</label>
                        <input
                            type="text"
                            id="reviewName"
                            className="form-control"
                            placeholder="Enter your name"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="review-field">
                        <label htmlFor="reviewComment" className="form-label">Comment</label>
                        <textarea
                            id="reviewComment"
                            className="form-control"
                            rows="3"
                            placeholder="Share your thoughts about this artwork"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="review-form-actions">
                    <button type="submit" className="btn btn-dark" disabled={submitting || loading || Boolean(error)}>
                        {submitting ? "Submitting..." : "Submit Review"}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                            <path d="M4 12h15m-6-6 6 6-6 6" />
                        </svg>
                    </button>
                    <p>Your review will appear below.</p>
                </div>
                {status && <p className={`review-status${statusIsError ? " review-status-error" : ""}`} role={statusIsError ? "alert" : "status"}>{status}</p>}
            </form>

            <div className="reviews-list-heading">
                <h3>What our customers say</h3>
                {!loading && !error && <span>{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</span>}
            </div>
            <div className="reviews-list" aria-busy={loading}>
                {loading ? <p className="review-empty" role="status">Loading reviews...</p> : error ? (
                    <div className="review-empty" role="alert"><p>{error}</p><button type="button" className="btn btn-dark" onClick={retry}>Try again</button></div>
                ) : reviews.length === 0 ? (
                    <p className="review-empty">No reviews yet. Be the first to share your thoughts above!</p>
                ) : (
                    reviews.map((review) => (
                        <article key={review.id} className="review-card">
                            <div className="review-card-header">
                                <span className="review-initial" aria-hidden="true">{(review.customerName || "Guest").trim().charAt(0).toUpperCase()}</span>
                                <div>
                                    <h4 className="review-name">{review.customerName || "Guest"}</h4>
                                    {review.reviewDate && <time className="review-date" dateTime={review.reviewDate}>{review.reviewDate}</time>}
                                </div>
                                <svg className="review-quote" width="30" height="26" viewBox="0 0 30 26" fill="currentColor" aria-hidden="true">
                                    <path d="M2 14C2 7 5 3 11 1l1 3C8 6 7 8 7 11h6v12H2V14Zm15 0c0-7 3-11 9-13l1 3c-4 2-5 4-5 7h6v12H17V14Z" />
                                </svg>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                        </article>
                    ))
                )}
            </div>
        </section>
    )
}
