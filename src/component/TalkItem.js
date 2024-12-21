import React, { useState, useEffect, useCallback } from "react";
import StarRating from "./StarRating";

function TalkItem({
  talk,
  isBookmarked,
  toggleBookmark,
  toggleSchedule,
  isScheduled,
  errorMessage,
}) {
  // Helper to read current userId or "null" if not logged in
  const getCurrentUserId = () => localStorage.getItem("userId") || "null";

  const [averageRating, setAverageRating] = useState(0);

  // Determine this user's rating from localStorage on mount
  const [userRating, setUserRating] = useState(() => {
    const savedRatings = JSON.parse(localStorage.getItem("ratings")) || [];
    const currentUserId = getCurrentUserId();

    // Find rating matching (talkId, userId)
    const existing = savedRatings.find(
      (r) => r.talkId === talk.id && r.userId === currentUserId
    );
    return existing ? existing.rating : 0;
  });

  // Fetch the average rating from the backend
  const fetchAverageRating = useCallback(() => {
    fetch(`http://localhost:3001/talks/${talk.id}/ratingById`)
      .then((response) => response.json())
      .then((data) => {
        // data is an array of numeric ratings
        const avg = data.length
          ? (data.reduce((sum, rate) => sum + rate, 0) / data.length).toFixed(1)
          : 0;
        setAverageRating(avg);
      })
      .catch((err) => console.error("Failed to fetch ratings", err));
  }, [talk.id]);

  useEffect(() => {
    fetchAverageRating(); // Fetch average rating on mount
  }, [fetchAverageRating]);

  // Handle rating submission
  const handleRating = (rating) => {
    if (rating === userRating) return; // Prevent duplicate submission

    setUserRating(rating);

    // Current userId
    const currentUserId = getCurrentUserId();

    // Update localStorage
    const savedRatings = JSON.parse(localStorage.getItem("ratings")) || [];
    // Remove old rating from this user for this talk
    const filteredRatings = savedRatings.filter(
      (r) => !(r.talkId === talk.id && r.userId === currentUserId)
    );
    // Add new rating
    filteredRatings.push({ talkId: talk.id, rating, userId: currentUserId });
    localStorage.setItem("ratings", JSON.stringify(filteredRatings));

    // Send rating to backend (POST /posts)
    // Make sure your server expects { talkId, rating, userId }
    fetch("http://localhost:3001/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        talkId: talk.id,
        rating,
        userId: currentUserId !== "null" ? currentUserId : null,
      }),
    })
      .then(() => fetchAverageRating()) // Re-fetch average rating
      .catch((err) => console.error("Failed to post rating", err));
  };

  return (
    <li
      style={{
        marginBottom: "20px",
        border: "1px solid #ddd",
        padding: "15px",
        borderRadius: "5px",
      }}
    >
      <h2>{talk.title}</h2>
      <p>
        <strong>Speaker:</strong> {talk.speaker}
      </p>
      <p>
        <strong>Description:</strong> {talk.description}
      </p>
      <p>
        <strong>Time:</strong> {talk.time}
      </p>
      <p>
        <strong>Session:</strong> {talk.session}
      </p>
      <p>
        <strong>Tags:</strong> {talk.tags.join(", ")}
      </p>
      {errorMessage && (
        <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>
      )}

      <button onClick={() => toggleBookmark(talk.id)}>
        {isBookmarked ? "Unmark as Interested" : "Mark as Interested"}
      </button>
      <button onClick={() => toggleSchedule(talk)}>
        {isScheduled ? "Remove from Your Schedule" : "Add to Your Schedule"}
      </button>

      <h3>Your Rating</h3>
      <StarRating currentRating={userRating} onRate={handleRating} />

      <p>
        <strong>Average Rating:</strong> {averageRating} ⭐
      </p>
    </li>
  );
}

export default TalkItem;
