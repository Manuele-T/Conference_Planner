import React, { useState, useEffect } from "react";

function TalksList() {
  const [talks, setTalks] = useState([]); // Stores all talks
  const [sessions, setSessions] = useState([]); // Stores unique session options
  const [filter, setFilter] = useState(""); // Filter by speaker
  const [sessionFilter, setSessionFilter] = useState(""); // Filter by session
  const [error, setError] = useState(null); // Handles errors

  // Fetch talks and sessions on component mount
  useEffect(() => {
    fetch("http://localhost:3001/talks") // Fetch talks
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch talks");
        }
        return response.json();
      })
      .then((data) => {
        setTalks(data);
        // Extract unique sessions dynamically
        const uniqueSessions = [...new Set(data.map((talk) => talk.session))];
        setSessions(uniqueSessions);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  // Filter talks by speaker and session
  const filteredTalks = talks.filter(
    (talk) =>
      (!sessionFilter || talk.session === sessionFilter) && // Filter by session
      talk.speaker.toLowerCase().includes(filter.toLowerCase()) // Filter by speaker
  );

  return (
    <div>
      <h1>Talks</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Speaker Filter */}
      <input
        type="text"
        placeholder="Filter by speaker"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "300px" }}
      />
      {/* Session Filter */}
      <p>Browse talks by session</p>
      <select
        value={sessionFilter}
        onChange={(e) => setSessionFilter(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "200px" }}
      >
        <option value="">All Sessions</option>
        {sessions.map((session) => (
          <option key={session} value={session}>
            Session {session}
          </option>
        ))}
      </select>
      <ul>
        {filteredTalks.map((talk) => (
          <li key={talk.id}>
            <h2>{talk.title}</h2>
            <p><strong>Speaker:</strong> {talk.speaker}</p>
            <p><strong>Description:</strong> {talk.description}</p>
            <p><strong>Time:</strong> {talk.time}</p>
            <p><strong>Tags:</strong> {talk.tags.join(", ")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TalksList;