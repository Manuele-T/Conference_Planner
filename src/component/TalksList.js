import React, { useState, useEffect } from "react";
import Filters from "./Filters";
import TalkItem from "./TalkItem";

function TalksList() {
  const [talks, setTalks] = useState([]);
  const [filter, setFilter] = useState("");
  const [sessionFilter, setSessionFilter] = useState("");
  const [interestedTalks, setInterestedTalks] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarks")) || [];
    return saved.filter((bookmark) => bookmark.userId === null);
  });

  useEffect(() => {
    fetch("http://localhost:3001/talks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch talks");
        }
        return response.json();
      })
      .then((data) => {
        setTalks(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const toggleBookmark = (talkId) => {
    const updatedBookmarks = interestedTalks.some((bookmark) => bookmark.talkId === talkId)
      ? interestedTalks.filter((bookmark) => bookmark.talkId !== talkId)
      : [...interestedTalks, { talkId, userId: null }];

    setInterestedTalks(updatedBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
  };

  const filteredTalks = talks.filter(
    (talk) =>
      (!sessionFilter || talk.session === sessionFilter) &&
      talk.speaker.toLowerCase().includes(filter.toLowerCase())
  );

  const sessions = [...new Set(talks.map((talk) => talk.session))];

  return (
    <div>
      <h1>Talks</h1>
      <Filters
        filter={filter}
        setFilter={setFilter}
        sessionFilter={sessionFilter}
        setSessionFilter={setSessionFilter}
        sessions={sessions}
      />
      <ul>
        {filteredTalks.map((talk) => (
          <TalkItem
            key={talk.id}
            talk={talk}
            isBookmarked={interestedTalks.some((bookmark) => bookmark.talkId === talk.id)}
            toggleBookmark={toggleBookmark}
          />
        ))}
      </ul>
    </div>
  );
}

export default TalksList;