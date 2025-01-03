import React, { useState, useEffect } from "react";
import { Accordion } from "react-bootstrap";

function SpeechesToAttend() {
  // Helper to get current userId
  const getCurrentUserId = () => localStorage.getItem("userId") || null;

  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const allSchedules = JSON.parse(localStorage.getItem("schedule")) || [];
    const userId = getCurrentUserId();

    // Filter only those schedule entries for this user
    const userSchedule = allSchedules.filter((item) => item.userId === userId);
    setSchedule(userSchedule);
  }, []);

  return (
    <div className="container">
      <h1 className="text-center my-4">Your Schedule</h1>
      {schedule.length === 0 ? (
        <p className="text-center">
          You haven't added any talks to your schedule yet.
        </p>
      ) : (
        <Accordion>
          {schedule.map((talk) => (
            <Accordion.Item eventKey={talk.id} key={talk.id}>
              <Accordion.Header>{talk.title}</Accordion.Header>
              <Accordion.Body>
                <p>
                  <strong>Speaker:</strong> {talk.speaker}
                </p>
                <p>
                  <strong>Time:</strong> {talk.time}
                </p>
                <p>
                  <strong>Session:</strong> {talk.session}
                </p>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </div>
  );
}

export default SpeechesToAttend;
