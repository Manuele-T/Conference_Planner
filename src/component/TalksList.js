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
  const [schedule, setSchedule] = useState(() => {
    return JSON.parse(localStorage.getItem("schedule")) || [];
  });
  const [errorMessages, setErrorMessages] = useState({});

  useEffect(() => {
    fetch("http://localhost:3001/talks")
      .then((response) => response.json())
      .then((data) => {
        setTalks(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const toggleBookmark = (talkId) => {
    const updatedBookmarks = interestedTalks.some((bookmark) => bookmark.talkId === talkId)
      ? interestedTalks.filter((bookmark) => bookmark.talkId !== talkId)
      : [...interestedTalks, { talkId, userId: null }];

    setInterestedTalks(updatedBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
  };

  const toggleSchedule = (talk) => {
    if (schedule.some((scheduledTalk) => scheduledTalk.id === talk.id)) {
      // Remove from schedule
      const updatedSchedule = schedule.filter((scheduledTalk) => scheduledTalk.id !== talk.id);
      setSchedule(updatedSchedule);
      setErrorMessages((prev) => ({ ...prev, [talk.id]: "" }));
      localStorage.setItem("schedule", JSON.stringify(updatedSchedule));
    } else if (schedule.some((scheduledTalk) => scheduledTalk.time === talk.time)) {
      // Show time conflict error
      setErrorMessages((prev) => ({
        ...prev,
        [talk.id]: `You already have a talk scheduled at ${talk.time}.`
      }));
      setTimeout(() => {
        setErrorMessages((prev) => ({ ...prev, [talk.id]: "" }));
      }, 3000);
    } else {
      // Add to schedule
      const updatedSchedule = [...schedule, talk];
      setSchedule(updatedSchedule);
      localStorage.setItem("schedule", JSON.stringify(updatedSchedule));
      setErrorMessages((prev) => ({ ...prev, [talk.id]: "" }));
    }
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
            isScheduled={schedule.some((scheduledTalk) => scheduledTalk.id === talk.id)}
            toggleBookmark={toggleBookmark}
            toggleSchedule={toggleSchedule}
            errorMessage={errorMessages[talk.id] || ""}
          />
        ))}
      </ul>
    </div>
  );
}

export default TalksList;
