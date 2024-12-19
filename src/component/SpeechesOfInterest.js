import React, { useState, useEffect } from "react";

function SpeechesOfInterest() {
  const [bookmarkedTalks, setBookmarkedTalks] = useState([]);
  const [allTalks, setAllTalks] = useState([]);

  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    setBookmarkedTalks(savedBookmarks.filter((bookmark) => bookmark.userId === null));

    fetch("http://localhost:3001/talks")
      .then((response) => response.json())
      .then((data) => {
        setAllTalks(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const talksOfInterest = allTalks.filter((talk) =>
    bookmarkedTalks.some((bookmark) => bookmark.talkId === talk.id)
  );

  return (
    <div>
      <h1>Speeches of Interest</h1>
      <ul>
        {talksOfInterest.map((talk) => (
          <li key={talk.id}>
            <h2>{talk.title}</h2>
            <p><strong>Speaker:</strong> {talk.speaker}</p>
            <p><strong>Description:</strong> {talk.description}</p>
            <p><strong>Time:</strong> {talk.time}</p>
            <p><strong>Session:</strong> {talk.session}</p>
            <p><strong>Tags:</strong> {talk.tags.join(", ")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SpeechesOfInterest;