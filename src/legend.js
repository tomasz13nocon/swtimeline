import React from "react";
import "./styles/legend.scss";

export default function Legend(props) {
  const [expanded, toggleExpanded] = React.useReducer((state) => !state, false);
  return (
    <div className="legend">
      <button
        onClick={toggleExpanded}
        className={`button ${expanded ? "expanded" : ""}`}
      >
        {expanded ? (
          <>
            {/* TODO: fix the order to reflect the color circle once the colors are settled */}
            <div className="type-indicator book">Book</div>
            <div className="type-indicator short-story">Short Story</div>
            <div className="type-indicator comic">Comic</div>
            <div className="type-indicator yr">Young Reader</div>
            <div className="type-indicator tv">TV</div>
            <div className="type-indicator game">Game</div>
            <div className="type-indicator film">Film</div>
          </>
        ) : (
          "?"
        )}
      </button>
    </div>
  );
}
