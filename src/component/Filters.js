import React from "react";

function Filters({ filter, setFilter, sessionFilter, setSessionFilter, sessions }) {
  return (
    <div>
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
    </div>
  );
}

export default Filters;