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
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(() => {
    const savedRatings = JSON.parse(localStorage.getItem("ratings")) || [];
    const userRating = savedRatings.find(
      (rating) => rating.talkId === talk.id && rating.userId === null
    );
    return userRating ? userRating.rating : 0;
  });

  // Fetch average rating from the backend (wrapped in useCallback)
  const fetchAverageRating = useCallback(() => {
    fetch(`http://localhost:3001/talks/${talk.id}/ratingById`)
      .then((response) => response.json())
      .then((data) => {
        const avg = data.length
          ? (data.reduce((sum, rate) => sum + rate, 0) / data.length).toFixed(1)
          : 0;
        setAverageRating(avg);
      })
      .catch((err) => console.error("Failed to fetch ratings", err));
  }, [talk.id]);

  useEffect(() => {
    fetchAverageRating(); // Fetch when the component mounts
  }, [fetchAverageRating]);

  // Handle Rating Submission
  const handleRating = (rating) => {
    if (rating === userRating) return; // Prevent duplicate submission

    setUserRating(rating);

    // Update Local Storage
    const savedRatings = JSON.parse(localStorage.getItem("ratings")) || [];
    const updatedRatings = savedRatings.filter(
      (r) => !(r.talkId === talk.id && r.userId === null)
    );
    updatedRatings.push({ talkId: talk.id, rating, userId: null });
    localStorage.setItem("ratings", JSON.stringify(updatedRatings));

    // Send Rating to Backend
    fetch("http://localhost:3001/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ talkId: talk.id, rating }),
    })
      .then(() => fetchAverageRating()) // Update average rating after posting
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
