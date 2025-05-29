import React, { useState, useEffect } from "react";
import { Accordion } from "react-bootstrap";

function SpeechesToAttend() {
  // Helper to get current userId
  const getCurrentUserId = () => localStorage.getItem("userId") || null;

  const [schedule, setSchedule] = useState([]); // State to store the user's schedule

  useEffect(() => {
    // Load the schedule for the current user from local storage
    const allSchedules = JSON.parse(localStorage.getItem("schedule")) || [];
    const userId = getCurrentUserId();

    // Filter schedule entries specific to the logged-in user
    const userSchedule = allSchedules.filter((item) => item.userId === userId);
    setSchedule(userSchedule);
  }, []);

  return (
    <div className="container">
      <h1 className="text-center my-4">Your Schedule</h1>
      {schedule.length === 0 ? (
        // Show a message if the schedule is empty
        <p className="text-center">
          You haven't added any talks to your schedule yet.
        </p>
      ) : (
        // Render schedule entries using accordion
        <Accordion>
          {schedule.map((talk) => (
            <Accordion.Item eventKey={talk.id} key={talk.id}>
              <Accordion.Header>{talk.title}</Accordion.Header>
              <Accordion.Body>
                <p>
                  <strong>Speaker:</strong> {talk.speaker}
                </p>
                <p>
                  <strong>Description:</strong> {talk.description}
                </p>
                <p>
                  <strong>Time:</strong> {talk.time}
                </p>
                <p>
                  <strong>Session:</strong> {talk.session}
                </p>
                <p>
                  <strong>Tags:</strong> {talk.tags.join(", ")}
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