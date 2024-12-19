import React, { useState } from "react";

function StarRating({ currentRating, onRate }) {
  const [selectedStars, setSelectedStars] = useState(currentRating || 0);

  const handleClick = (rating) => {
    setSelectedStars(rating); 
    onRate(rating); // Pass rating to parent
  };

  const createStars = () =>
    Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        onClick={() => handleClick(index + 1)}
        style={{
          fontSize: "24px",
          cursor: "pointer",
          color: index < selectedStars ? "#FFD700" : "#ccc",
        }}
      >
        ★
      </span>
    ));

  return <div>{createStars()}</div>;
}

export default StarRating;