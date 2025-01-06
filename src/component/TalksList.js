import React, { useState, useEffect } from "react";
import Filters from "./Filters";
import TalkItem from "./TalkItem";
import { Accordion } from "react-bootstrap";

function TalksList() {
  const [talks, setTalks] = useState([]);
  const [filter, setFilter] = useState("");
  const [sessionFilter, setSessionFilter] = useState("");
  const [errorMessages, setErrorMessages] = useState({});

  // Retrieve current userId from localStorage. If not logged-in, it's "null".
  const getCurrentUserId = () => localStorage.getItem("userId") || null;

  // Initialize "bookmarks" from localStorage
  const [interestedTalks, setInterestedTalks] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const userId = getCurrentUserId();
    // Filter only bookmarks that belong to the current user (or null if not logged in)
    return saved.filter((bookmark) => bookmark.userId === userId);
  });

  // Initialize "schedule" from localStorage
  const [schedule, setSchedule] = useState(() => {
    const savedSchedule = JSON.parse(localStorage.getItem("schedule")) || [];
    const userId = getCurrentUserId();
    // Filter only schedule items for the current user (or null if not logged in)
    return savedSchedule.filter((item) => item.userId === userId);
  });

  // Fetch all talks
  useEffect(() => {
    fetch("http://localhost:3001/talks")
      .then((response) => response.json())
      .then((data) => {
        setTalks(data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Toggle a bookmark for the current user
  const toggleBookmark = (talkId) => {
    const userId = getCurrentUserId();
    // Current array of all bookmarks in localStorage
    const allBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    // Check if a bookmark exists for this user & talk
    const alreadyBookmarked = interestedTalks.some(
      (bookmark) => bookmark.talkId === talkId && bookmark.userId === userId
    );

    let updatedUserBookmarks;
    let updatedAllBookmarks;

    if (alreadyBookmarked) {
      // Remove the bookmark from the user's local state
      updatedUserBookmarks = interestedTalks.filter(
        (bookmark) =>
          !(bookmark.talkId === talkId && bookmark.userId === userId)
      );
      // Remove from the global "bookmarks" array
      updatedAllBookmarks = allBookmarks.filter(
        (bookmark) =>
          !(bookmark.talkId === talkId && bookmark.userId === userId)
      );
    } else {
      // Add a new bookmark with userId
      const newBookmark = { talkId, userId };
      updatedUserBookmarks = [...interestedTalks, newBookmark];
      updatedAllBookmarks = [...allBookmarks, newBookmark];
    }

    // Update state and localStorage
    setInterestedTalks(updatedUserBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(updatedAllBookmarks));
  };

  // Toggle a talk in the schedule for the current user
  const toggleSchedule = (talk) => {
    const userId = getCurrentUserId();
    const allSchedules = JSON.parse(localStorage.getItem("schedule")) || [];

    // Check if user already has this talk
    const alreadyScheduled = schedule.some(
      (item) => item.id === talk.id && item.userId === userId
    );

    if (alreadyScheduled) {
      // Remove from schedule
      const updatedUserSchedule = schedule.filter(
        (item) => !(item.id === talk.id && item.userId === userId)
      );
      const updatedAllSchedule = allSchedules.filter(
        (item) => !(item.id === talk.id && item.userId === userId)
      );
      setSchedule(updatedUserSchedule);
      localStorage.setItem("schedule", JSON.stringify(updatedAllSchedule));
      setErrorMessages((prev) => ({ ...prev, [talk.id]: "" }));
    } else if (
      schedule.some((item) => item.time === talk.time && item.userId === userId)
    ) {
      // Show time conflict error
      setErrorMessages((prev) => ({
        ...prev,
        [talk.id]: `You already have a talk scheduled at ${talk.time}.`,
      }));
      setTimeout(() => {
        setErrorMessages((prev) => ({ ...prev, [talk.id]: "" }));
      }, 3000);
    } else {
      // Add to schedule for this user
      const talkWithUserId = { ...talk, userId };
      const updatedUserSchedule = [...schedule, talkWithUserId];
      const updatedAllSchedule = [...allSchedules, talkWithUserId];

      setSchedule(updatedUserSchedule);
      localStorage.setItem("schedule", JSON.stringify(updatedAllSchedule));
      setErrorMessages((prev) => ({ ...prev, [talk.id]: "" }));
    }
  };

  // Apply filters to talk list
  const filteredTalks = talks.filter(
    (talk) =>
      (!sessionFilter || talk.session === sessionFilter) &&
      talk.speaker.toLowerCase().includes(filter.toLowerCase())
  );

  const sessions = [...new Set(talks.map((talk) => talk.session))];

  return (
    <div className="container">
      <h1>Talks</h1>
      <Filters
        filter={filter}
        setFilter={setFilter}
        sessionFilter={sessionFilter}
        setSessionFilter={setSessionFilter}
        sessions={sessions}
      />
      <Accordion>
        {filteredTalks.map((talk) => {
          const isBookmarked = interestedTalks.some(
            (bookmark) =>
              bookmark.talkId === talk.id &&
              bookmark.userId === getCurrentUserId()
          );
          const isScheduled = schedule.some(
            (item) => item.id === talk.id && item.userId === getCurrentUserId()
          );

          return (
            <TalkItem
              key={talk.id}
              talk={talk}
              isBookmarked={isBookmarked}
              isScheduled={isScheduled}
              toggleBookmark={toggleBookmark}
              toggleSchedule={toggleSchedule}
              errorMessage={errorMessages[talk.id] || ""}
            />
          );
        })}
      </Accordion>
    </div>
  );
}

export default TalksList;
