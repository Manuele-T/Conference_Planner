import React from "react";

function Filters({ filter, setFilter, sessionFilter, setSessionFilter, sessions }) {
  return (
    <div>
      {/* Speaker Filter Input */}
      <input
        type="text"
        placeholder="Filter by speaker"
        value={filter} // Controlled input for speaker filter
        onChange={(e) => setFilter(e.target.value)} // Update speaker filter on input change
        style={{ marginBottom: "10px", padding: "5px", width: "300px" }} // Inline styling
      />

      {/* Session Filter Dropdown */}
      <p>Browse talks by session</p>
      <select
        value={sessionFilter} // Controlled select for session filter
        onChange={(e) => setSessionFilter(e.target.value)} // Update session filter on selection change
        style={{ marginBottom: "10px", padding: "5px", width: "200px" }} // Inline styling
      >
        <option value="">All Sessions</option> {/* Default option */}
        {sessions.map((session) => (
          <option key={session} value={session}>
            Session {session} {/* Display each session */}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filters;
