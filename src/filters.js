import React from "react";
import _ from "lodash";
import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import StickyBox from "react-sticky-box";

import CheckboxGroup from "./checkboxGroup.js";
import WookieeLink from "./wookieeLink.js";
import "./styles/filters.scss";
import Checkbox from "./checkbox.js";

const suggestionPriority = [
  "film",
  "tv-live-action",
  "game",
  "tv-animated",
  "multimedia",
  "book-a",
  "book-ya",
  "comic",
  "comic-manga",
  "audio-drama",
  "game-vr",
  "book-jr",
  "tv-micro-series",
  "comic-strip",
  "comic-story",
  "game-mobile",
  "short-story",
  "yr",
  "game-browser",
  "unknown",
];

export default React.memo(function Filters({
  filterText,
  filterTextChanged,
  filters,
  filtersChanged,
  filtersTemplate,
  suggestions,
  setSuggestions,
  boxFilters,
  setBoxFilters,
  timelineContainerRef,
  hideUnreleased,
  setHideUnreleased,
  seriesArr,
  collapseAdjacent,
  setCollapseAdjacent,
  columns,
  setColumns,
}) {

  return (
    <StickyBox offsetTop={10} offsetBottom={10}>
      <div className="filter">
        <div className="search clear-input-container">
          <input
            type="text"
            value={filterText}
            onChange={(e) => {
              let newFilterText = e.target.value;
              filterTextChanged(newFilterText)

              // Search suggestions
              if (newFilterText) {
                let queries = [newFilterText.toLowerCase()];
                let last = queries[queries.length - 1].trim();
                if (last.length >= 2) {
                  let found = seriesArr.filter((item) =>
                    item.displayTitle
                      ? item.displayTitle.toLowerCase().includes(last)
                      : item.title.toLowerCase().includes(last)
                  );
                  if (found.length) {
                    setSuggestions(
                      found
                      .filter((el) => !boxFilters.includes(el))
                      .sort((a, b) => {
                        let ap = suggestionPriority.indexOf(a.fullType || a.type),
                          bp = suggestionPriority.indexOf(b.fullType || b.type);
                        if (ap > bp) return 1;
                        if (ap < bp) return -1;
                        return 0;
                      })
                      .slice(0, 10)
                    );
                  } else setSuggestions([]);
                } else setSuggestions([]);
              } else setSuggestions([]);
            }}
            placeholder="Filter..."
            className="input-default"
          />
          {filterText ? (
            <button
              className="clear-input"
              onClick={(e) => {
                filterTextChanged("");
                setSuggestions([]);
              }}
              aria-label="Clear search"
            >
              &times;
            </button>
          ) : null}
        </div>

        <div className="search-suggestions">
          {suggestions.length > 0 && (
            <span className="suggestions-heading">Suggestions:</span>
          )}
          {suggestions.map((el) => (
            <button
              key={el._id}
              className={`reset-button suggestion ${el.type} ${el.fullType}`}
              onClick={() => {
                setBoxFilters([...boxFilters, el]);
                filterTextChanged("");
                setSuggestions([]);
              }}
            >
              {el.displayTitle || el.title}
            </button>
          ))}
        </div>

        <div className="box-filters">
          {boxFilters.map((boxFilter) => (
            <div
              key={boxFilter._id}
              className={`type-indicator ${boxFilter.type} ${boxFilter.fullType}`}
            >
              <span className="text">
                {boxFilter.displayTitle || boxFilter.title}
                <WookieeLink title={boxFilter.title}></WookieeLink>
              </span>
              <button
                className={`reset-button curp remove ${boxFilter.type}-reversed ${boxFilter.fullType}-reversed`}
                onClick={() =>
                    setBoxFilters([
                      ...boxFilters.filter((el) => el._id !== boxFilter._id),
                    ])
                }
              >
                <Icon className={`icon`} path={mdiClose} />
              </button>
            </div>
          ))}
        </div>

        <div className="checkbox-settings">
          <Checkbox
            name={"Hide unreleased"}
            value={hideUnreleased}
            onChange={({ to }) => setHideUnreleased(to)}
          />
          <Checkbox
            name={"Show cover thumbnails"}
            value={columns.cover}
            onChange={({ to }) => setColumns(state => ({ ...state, cover: to }))}
          />
          <Checkbox
            name={"Collapse adjacent episodes"}
            value={collapseAdjacent}
            onChange={({ to }) => setCollapseAdjacent(to)}
          />
        </div>

        <div className="check-buttons">
          <button
            className="show-button"
            onClick={() => filtersChanged({ path: "type", to: true })}
          >
            CHECK ALL
          </button>
          <button
            className="hide-button"
            onClick={() => filtersChanged({ path: "type", to: false })}
          >
            UNCHECK ALL
          </button>
        </div>

        <div
          className="checkbox-filters"
        >
          <CheckboxGroup state={filters} onChange={filtersChanged}>
            {filtersTemplate}
          </CheckboxGroup>
        </div>
      </div>
    </StickyBox>
  );
});
