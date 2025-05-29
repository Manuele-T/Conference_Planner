import React, { useState, useEffect, useCallback } from "react";
import StarRating from "./StarRating";
import { Accordion } from "react-bootstrap";

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

  // Determine the user's rating from localStorage
  const [userRating, setUserRating] = useState(() => {
    const savedRatings = JSON.parse(localStorage.getItem("ratings")) || [];
    const currentUserId = getCurrentUserId();

    // Find matching rating (talkId, userId)
    const existing = savedRatings.find(
      (r) => r.talkId === talk.id && r.userId === currentUserId
    );
    return existing ? existing.rating : 0;
  });

  // Fetch average rating from the backend
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
  const currentUserId = getCurrentUserId();
  if (currentUserId === "null") {
    alert("You must be logged in to rate.");
    return; // Prevent voting for not logged-in users
  }
  // Prevent duplicate submissions
  if (rating === userRating) return;

  setUserRating(rating);

  // Update localStorage
  const savedRatings = JSON.parse(localStorage.getItem("ratings")) || [];
  // Remove old rating from this user for this talk
  const filteredRatings = savedRatings.filter(
    (r) => !(r.talkId === talk.id && r.userId === currentUserId)
  );
  // Add new rating
  filteredRatings.push({ talkId: talk.id, rating, userId: currentUserId });
  localStorage.setItem("ratings", JSON.stringify(filteredRatings));

  // Send rating to backend
  fetch("http://localhost:3001/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      talkId: talk.id,
      rating,
      userId: currentUserId,
    }),
  })
    .then(() => fetchAverageRating()) // Re-fetch average rating
    .catch((err) => console.error("Failed to post rating", err));
};

  // Render an accordion item for a talk with details, actions, and ratings
  return (
    <Accordion.Item eventKey={talk.id}>
      <Accordion.Header>{talk.title}</Accordion.Header>
      <Accordion.Body>
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

        <button
          className="btn btn-primary"
          onClick={() => toggleBookmark(talk.id)}
        >
          {isBookmarked ? "Unmark as Interested" : "Mark as Interested"}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => toggleSchedule(talk)}
        >
          {isScheduled ? "Remove from Your Schedule" : "Add to Your Schedule"}
        </button>

        <h3>Your Rating</h3>
        <StarRating currentRating={userRating} onRate={handleRating} />

        <p>
          <strong>Average Rating:</strong> {averageRating} ⭐
        </p>
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default TalkItem;