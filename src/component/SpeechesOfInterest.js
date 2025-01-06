import React, { useState, useEffect } from "react";
import { Accordion } from "react-bootstrap";

// Component to display bookmarked talks for the logged-in user
function SpeechesOfInterest() {
  const getCurrentUserId = () => localStorage.getItem("userId") || null; // Helper to get current user ID or null

  const [bookmarkedTalks, setBookmarkedTalks] = useState([]); // State for user's bookmarked talks
  const [allTalks, setAllTalks] = useState([]); // State for all talks fetched from the backend

  useEffect(() => {
    // Load all bookmarks from local storage
    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const userId = getCurrentUserId();

    // Filter bookmarks to match the logged-in user
    const userBookmarks = allBookmarks.filter(
      (bookmark) => bookmark.userId === userId
    );
    setBookmarkedTalks(userBookmarks);

    // Fetch all talks from the backend
    fetch("http://localhost:3001/talks")
      .then((response) => response.json())
      .then((data) => {
        setAllTalks(data); // Save fetched talks to state
      })
      .catch((err) => console.error(err)); // Handle fetch errors
  }, []);

  // Match bookmarked talk IDs with full talk details
  const talksOfInterest = allTalks.filter((talk) =>
    bookmarkedTalks.some((bookmark) => bookmark.talkId === talk.id)
  );
// Render the list of bookmarked talks using accordion
  return (
    <div className="container">
      <h1 className="text-center my-4">Speeches of Interest</h1>
      <Accordion>
        {talksOfInterest.map((talk) => (
          <Accordion.Item eventKey={talk.id} key={talk.id}>
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
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}

export default SpeechesOfInterest;