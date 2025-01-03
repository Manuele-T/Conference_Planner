import React, { useState, useEffect } from "react";
import { Accordion } from "react-bootstrap";

function SpeechesOfInterest() {
  // Helper to get current userId or null
  const getCurrentUserId = () => localStorage.getItem("userId") || null;

  const [bookmarkedTalks, setBookmarkedTalks] = useState([]);
  const [allTalks, setAllTalks] = useState([]);

  useEffect(() => {
    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const userId = getCurrentUserId();

    // Filter only the bookmarks that match the current user (or null if not logged in)
    const userBookmarks = allBookmarks.filter(
      (bookmark) => bookmark.userId === userId
    );
    setBookmarkedTalks(userBookmarks);

    // Fetch all talks from backend
    fetch("http://localhost:3001/talks")
      .then((response) => response.json())
      .then((data) => {
        setAllTalks(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Filter down to the actual talk objects for those bookmarked talk IDs
  const talksOfInterest = allTalks.filter((talk) =>
    bookmarkedTalks.some((bookmark) => bookmark.talkId === talk.id)
  );

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
