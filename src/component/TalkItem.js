import React from "react";

function TalkItem({ talk, isBookmarked, toggleBookmark }) {
  return (
    <li>
      <h2>{talk.title}</h2>
      <p><strong>Speaker:</strong> {talk.speaker}</p>
      <p><strong>Description:</strong> {talk.description}</p>
      <p><strong>Time:</strong> {talk.time}</p>
      <p><strong>Session:</strong> {talk.session}</p> {/* Add session */}
      <p><strong>Tags:</strong> {talk.tags.join(", ")}</p>
      <button onClick={() => toggleBookmark(talk.id)}>
        {isBookmarked ? "Unmark as Interested" : "Mark as Interested"}
      </button>
    </li>
  );
}

export default TalkItem;
