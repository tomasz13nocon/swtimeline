import React from "react";

export default function EpisodeNumber({ item, children }) {
  if (!item.episode && !item.season)
    return null;

  return (
    <>
      <span
        title={`${item.season ? `season ${item.season}` : ""}${item.seasonNote ? ` ${item.seasonNote}` : ""}${item.episode ? `\nepisode ${item.episode}` : ""}`.trim()}
        className="season-episode"
      >
        {children ?? item.se}
        {/* {item.season && "S" + item.season} */}
        {/* <small> */}
        {/*   {item.seasonNote && `-${item.seasonNote}`} */}
        {/* </small> */}
        {/* {`${item.season && item.episode ? " " : ""}${item.episode ? "E" + item.episode : ""}`} */}
      </span>
    </>
  );
}