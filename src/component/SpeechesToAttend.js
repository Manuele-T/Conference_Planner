import React, { useState, useEffect } from "react";

function SpeechesToAttend() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const savedSchedule = JSON.parse(localStorage.getItem("schedule")) || [];
    setSchedule(savedSchedule);
  }, []);

  return (
    <div>
      <h1>Your Schedule</h1>
      {schedule.length === 0 ? (
        <p>You haven't added any talks to your schedule yet.</p>
      ) : (
        <ul>
          {schedule.map((talk) => (
            <li key={talk.id}>
              <h2>{talk.title}</h2>
              <p><strong>Speaker:</strong> {talk.speaker}</p>
              <p><strong>Time:</strong> {talk.time}</p>
              <p><strong>Session:</strong> {talk.session}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SpeechesToAttend;
