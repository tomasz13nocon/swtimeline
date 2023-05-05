import React, { useReducer } from "react";
import { Icon } from "@mdi/react";
import { mdiChevronDown, mdiChevronUp } from "@mdi/js";
import { Blurhash } from "react-blurhash";
import _ from "lodash";
import WookieeLink from "@components/wookieeLink";
import ExternalLink from "@components/externalLink";
import FetchingImg from "@components/fetchingImg";
import { imgAddress } from "@/util";
import Appearances from "./appearances";
import AppearancesSettings from "./appearancesSettings";
import "./styles/rowDetails.scss";
import { AppearancesContext } from "./context";
import { AnalyticsCategories, analytics } from "@/analytics";

const render = (value, link = true) => {
  if (!Array.isArray(value)) return value;
  // Else it's an AST
  let arr = [];
  for (let item of value) {
    switch (item.type) {
      case "text":
        arr.push(item.text);
        break;
      case "list":
        arr.push(
          <ul>
            {item.data.map((e, i) => (
              <li key={i}>{render(e, link)}</li>
            ))}
          </ul>
        );
        break;
      case "note":
        arr.push(<small className="note">({item.text})</small>);
        break;
      case "internal link":
        arr.push(item.text || item.page);
        arr.push(link && <WookieeLink title={item.page} />);
        break;
      case "external link":
        arr.push(<ExternalLink href={item.site}>{item.text ?? item.site}</ExternalLink>);
        break;
      case "interwiki link":
        arr.push(
          <ExternalLink href={"https://" + item.href} title={`${item.wiki}: ${item.page}`}>
            {item.text ?? item.page}
          </ExternalLink>
        );
        break;
    }
  }

  // We can safely use indices as keys since this is static content.
  return arr.map((el, i) => <React.Fragment key={i}>{el}</React.Fragment>);
};

const types = {
  book: "Novel",
  comic: "Comic",
  "short-story": "Short story",
  "audio-drama": "Audio drama",
  game: "Video game",
  tv: "TV series",
  film: "Film",
  yr: "Young Reader",
};
const fullTypes = {
  "book-a": "Novel",
  "book-ya": "Young adult novel",
  "book-jr": "Junior novel",
  "game-vr": "VR game",
  "game-mobile": "Mobile game",
  "game-browser": "Browser game",
  "tv-animated": "Animated TV series",
  "tv-micro-series": "Micro-series",
  "comic-story": "Comic story",
  "comic-strip": "Comic strip",
  "comic-manga": "Manga",
};

const getData = (item) => {
  let type = fullTypes[item.fullType] ?? types[item.type] ?? "Unknown";
  if (item.audiobook) type += " (audiobook)";
  type = <span className={`type-indicator ${item.type} ${item.fullType}`}>{type}</span>;

  let ret = {
    Type: type,
    "Timeline notes": render(item.timelineNotes),
    "Release date": render(item.releaseDateDetails, false),
    "Last aired": render(item.lastAired, false), // TODO: first aired when availible instead of release date?
    Closed: render(item.closed, false),
    Chronology: render(item.dateDetails),
    Series: render(item.seriesDetails),
    Season: render(item.seasonDetails),
    Episode: render(item.episode),
    "Production No.": render(item.production),
    "Episode count": render(item.numEpisodes),
    "No. of seasons": render(item.numSeasons),
    "Network(s)": render(item.network),
    "Guest star(s)": render(item.guests),
    Developer: render(item.developer),
    Author: render(item.author),
    "Creator(s)": render(item.creators),
    "Director(s)": render(item.director),
    "Writer(s)": render(item.writerDetails),
    Producer: render(item.producer),
    "Executive producer(s)": render(item.executiveProducers),
    Starring: render(item.starring),
    Music: render(item.music),
    Runtime: render(item.runtime),
    Budget: render(item.budget),
    Language: render(item.language),
    Penciler: render(item.penciller),
    Inker: render(item.inker),
    Letterer: render(item.letterer),
    Colorist: render(item.colorist),
    Publisher: render(item.publisherDetails),
    Illustrator: render(item.illustrator),
    "Cover Artist": render(item.coverArtist),
    "Published in": render(item.publishedIn),
    Pages: render(item.pages, false),
    "Game engine": render(item.engine),
    Genre: render(item.genre),
    Modes: render(item.modes),
    "Rating(s)": render(item.ratings),
    "Platform(s)": render(item.platforms),
    "Base game": render(item.basegame),
    Expansions: render(item.expansions),
    Designer: render(item.designer),
    Programmer: render(item.programmer),
    Artist: render(item.artist),
    Composer: render(item.composer),
    "Issue number": render(item.issue),
    "Followed by": render(item.followedBy ?? item.next),
    "Preceded by": render(item.precededBy ?? item.prev),
    UPC: render(item.upc, false),
    ISBN: render(item.isbn, false),
  };
  for (const [key, value] of Object.entries(ret)) {
    if (_.isEmpty(value)) delete ret[key];
  }
  return ret;
};

export default React.memo(function RowDetails({ item, setFullCover, dataState }) {
  const [appearancesVisible, toggleAppearancesVisible] = useReducer((s) => !s, false);
  const [hideMentions, toggleHideMentions] = useReducer((s) => !s, false);
  const [hideIndirectMentions, toggleHideIndirectMentions] = useReducer((s) => !s, false);
  const [hideFlashbacks, toggleHideFlashbacks] = useReducer((s) => !s, false);
  const [hideHolograms, toggleHideHolograms] = useReducer((s) => !s, false);

  return (
    <div className="tr details-row">
      <div className="td">
        {dataState === "fetchingDetails" ? (
          <FetchingImg />
        ) : (
          <>
            <div className="td-inner">
              {item.cover ? (
                <button
                  className="reset-button cover-button"
                  onClick={() =>
                    setFullCover({
                      name: item.cover,
                      show: true,
                      width: item.coverWidth,
                      height: item.coverHeight,
                      hash: item.coverHash,
                    })
                  }
                >
                  <Blurhash
                    hash={item.coverHash}
                    width={220}
                    height={220 / (item.coverWidth / item.coverHeight)}
                  />
                  <img
                    key={Math.random()}
                    width={220}
                    src={imgAddress(item.cover)}
                    alt={`cover of ${item.title}`}
                    className={`cover`}
                  />
                </button>
              ) : null}
              <div className="text">
                <h2 className="title">
                  {item.redlink ? (
                    item.title
                  ) : (
                    <WookieeLink title={item.href ?? item.title}>{item.title}</WookieeLink>
                  )}
                </h2>
                <div className="affiliate-btns">
                  {(["book", "audio-drama", "yr"].includes(item.type) ||
                    ["comic", "comic-manga"].includes(item.fullType)) &&
                    !isNaN(new Date(item.releaseDate)) && (
                      <ExternalLink
                        target="_blank"
                        href={`https://www.amazon.com/gp/search?ie=UTF8&tag=starwarstl-20&linkCode=ur2&camp=1789&creative=9325&index=books&keywords=${encodeURIComponent(
                          item.title
                        )}`}
                      >
                        Buy on <img src="/img/amazon.webp" alt="Amazon" />
                      </ExternalLink>
                    )}
                </div>
                {item.notUnique && item.title !== item.href && (
                  <div className="not-unique">
                    Appearances and information (other than Timeline notes) refer to &quot;
                    {item.href}&quot;
                  </div>
                )}
                <dl>
                  {Object.entries(getData(item)).map(([key, value]) => (
                    <React.Fragment key={key}>
                      <dt>{key}:&nbsp;</dt>
                      <dd>{value}</dd>
                    </React.Fragment>
                  ))}
                </dl>

                <div className="spacer" />

                <div className="bottom-btns">
                  {item.hasAppearances && (
                    <div className="appearances-btn-wrapper">
                      <button
                        className={`btn appearances-btn ${appearancesVisible ? "active" : ""}`}
                        onClick={() => {
                          toggleAppearancesVisible(true);
                          if (!appearancesVisible) {
                            analytics.logEvent(
                              AnalyticsCategories.appearances,
                              "Show appearances click",
                              item.title
                            );
                          }
                        }}
                      >
                        <span>{appearancesVisible ? "Hide appearances" : "Show appearances"}</span>
                        <Icon
                          className="icon"
                          path={appearancesVisible ? mdiChevronUp : mdiChevronDown}
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {appearancesVisible && (
              <AppearancesContext.Provider
                value={{
                  hideMentions,
                  toggleHideMentions,
                  hideIndirectMentions,
                  toggleHideIndirectMentions,
                  hideFlashbacks,
                  toggleHideFlashbacks,
                  hideHolograms,
                  toggleHideHolograms,
                }}
              >
                <AppearancesSettings />
                <Appearances id={item._id} />
              </AppearancesContext.Provider>
            )}
          </>
        )}
      </div>
    </div>
  );
});
