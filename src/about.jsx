import React from "react";

export default function About() {
  return (
    <>
      <h1>Star Wars Media Timeline</h1>
      <hr />
      <h2>Features</h2>
      <ul>
        <li>
          Timeline order sourced from the{" "}
          <a href="https://starwars.fandom.com/wiki/Timeline_of_canon_media">
            Wookieepedia's timeline of canon media
          </a>{" "}
          and information about specific media sourced from Wookieepedia articles by a 99%
          automated process.
          <ul>
            <li>
              Ensures community based information instead of one person's
              opinionated timeline.
            </li>
            <li>
              Very low need for maintenance makes it less likely for this
              project to get abandoned.
            </li>
            <li>Automatically updated daily.</li>
          </ul>
        </li>
        <li>
          Dynamic table with advanced{" "}
          <a href={/*TODO*/ "#"}>filtering and search features</a>.
        </li>
        <li>Highly optimized (when I'm done optimizing it)</li>
      </ul>
      <h2>Planned features</h2>
      <ul>
        <li>Mobile friendly version</li>
        <li>Legends timeline</li>
      </ul>
      Attributions etc...
    </>
  );
}