import React from "react";

function TalkItem({ talk, isBookmarked, toggleBookmark, toggleSchedule, isScheduled, errorMessage }) {
  return (
    <li style={{ marginBottom: "20px", border: "1px solid #ddd", padding: "15px", borderRadius: "5px" }}>
      <h2>{talk.title}</h2>
      <p><strong>Speaker:</strong> {talk.speaker}</p>
      <p><strong>Description:</strong> {talk.description}</p>
      <p><strong>Time:</strong> {talk.time}</p>
      <p><strong>Session:</strong> {talk.session}</p>
      <p><strong>Tags:</strong> {talk.tags.join(", ")}</p>
      {errorMessage && <p style={{ color: "red", fontWeight: "bold" }}>{errorMessage}</p>}
      <button onClick={() => toggleBookmark(talk.id)}>
        {isBookmarked ? "Unmark as Interested" : "Mark as Interested"}
      </button>
      <button onClick={() => toggleSchedule(talk)}>
        {isScheduled ? "Remove from Your Schedule" : "Add to Your Schedule"}
      </button>
    </li>
  );
}

export default TalkItem;
