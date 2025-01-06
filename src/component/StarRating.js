import React, { useState } from "react";

// Component for rating system
function StarRating({ currentRating, onRate }) {
  const [selectedStars, setSelectedStars] = useState(currentRating || 0); // State for selected star count

  const handleClick = (rating) => {
    setSelectedStars(rating); // Update selected stars
    onRate(rating); // Pass the rating to the parent component
  };

  // Generate star elements with appropriate styles
  const createStars = () =>
    Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        onClick={() => handleClick(index + 1)} // Set rating based on star clicked
        style={{
          fontSize: "24px",
          cursor: "pointer",
          color: index < selectedStars ? "#FFD700" : "#ccc", // Highlight selected stars
        }}
      >
        ★
      </span>
    ));
  // Render the stars
  return <div>{createStars()}</div>;
}

export default StarRating;